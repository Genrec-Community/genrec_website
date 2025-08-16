/**
 * Font Optimization Script
 * 
 * This script optimizes font loading by generating font preload links
 * and adding font-display: swap to CSS files.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Source directory containing CSS files
  cssDir: path.join(__dirname, '../src/styles'),
  
  // Font file extensions to look for
  fontExtensions: ['.woff2', '.woff', '.ttf', '.eot', '.otf'],
  
  // Font directories to scan
  fontDirs: [
    path.join(__dirname, '../public/fonts'),
    path.join(__dirname, '../src/assets/fonts')
  ],
  
  // HTML file to add preload links to
  htmlFile: path.join(__dirname, '../public/index.html'),
  
  // Font display strategy
  fontDisplay: 'swap' // 'auto', 'block', 'swap', 'fallback', or 'optional'
};

/**
 * Finds all font files in the specified directories
 * 
 * @returns {Array} Array of font file paths
 */
function findFontFiles() {
  const fontFiles = [];
  
  // Check if font directories exist
  CONFIG.fontDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.warn(`Font directory does not exist: ${dir}`);
      return;
    }
    
    // Recursively find all font files
    function scanDir(directory) {
      const files = fs.readdirSync(directory);
      
      files.forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          scanDir(filePath);
        } else if (CONFIG.fontExtensions.includes(path.extname(file).toLowerCase())) {
          fontFiles.push(filePath);
        }
      });
    }
    
    scanDir(dir);
  });
  
  return fontFiles;
}

/**
 * Adds font-display property to CSS files
 */
function addFontDisplayToCSS() {
  if (!fs.existsSync(CONFIG.cssDir)) {
    console.warn(`CSS directory does not exist: ${CONFIG.cssDir}`);
    return;
  }
  
  // Find all CSS files
  const cssFiles = [];
  function findCSSFiles(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findCSSFiles(filePath);
      } else if (path.extname(file).toLowerCase() === '.css') {
        cssFiles.push(filePath);
      }
    });
  }
  
  findCSSFiles(CONFIG.cssDir);
  
  // Process each CSS file
  let totalModified = 0;
  
  cssFiles.forEach(cssFile => {
    let cssContent = fs.readFileSync(cssFile, 'utf8');
    const originalContent = cssContent;
    
    // Add font-display to @font-face rules that don't have it
    cssContent = cssContent.replace(
      /@font-face\s*{([^}]*)}/g,
      (match, fontFaceContent) => {
        if (!fontFaceContent.includes('font-display:')) {
          return `@font-face{${fontFaceContent}font-display: ${CONFIG.fontDisplay};}`;
        }
        return match;
      }
    );
    
    // Write back if modified
    if (cssContent !== originalContent) {
      fs.writeFileSync(cssFile, cssContent, 'utf8');
      totalModified++;
      console.log(`Added font-display: ${CONFIG.fontDisplay} to ${cssFile}`);
    }
  });
  
  console.log(`Modified ${totalModified} of ${cssFiles.length} CSS files`);
}

/**
 * Generates preload links for font files and adds them to index.html
 * 
 * @param {Array} fontFiles - Array of font file paths
 */
function addPreloadLinksToHTML(fontFiles) {
  if (!fs.existsSync(CONFIG.htmlFile)) {
    console.warn(`HTML file does not exist: ${CONFIG.htmlFile}`);
    return;
  }
  
  let htmlContent = fs.readFileSync(CONFIG.htmlFile, 'utf8');
  
  // Generate preload links
  const preloadLinks = fontFiles.map(fontFile => {
    const relativePath = path.relative(path.dirname(CONFIG.htmlFile), fontFile).replace(/\\/g, '/');
    const fontType = getMimeTypeFromExtension(path.extname(fontFile));
    
    return `  <link rel="preload" href="/${relativePath}" as="font" type="${fontType}" crossorigin>\n`;
  }).join('');
  
  // Check if preload links already exist
  if (htmlContent.includes('rel="preload"') && htmlContent.includes('as="font"')) {
    console.log('Font preload links already exist in HTML file');
    return;
  }
  
  // Add preload links to head
  htmlContent = htmlContent.replace(
    /<head>([\s\S]*?)<\/head>/,
    `<head>$1\n  <!-- Preload font files -->\n${preloadLinks}</head>`
  );
  
  // Write back to file
  fs.writeFileSync(CONFIG.htmlFile, htmlContent, 'utf8');
  console.log(`Added ${fontFiles.length} font preload links to ${CONFIG.htmlFile}`);
}

/**
 * Gets MIME type from file extension
 * 
 * @param {string} extension - File extension
 * @returns {string} MIME type
 */
function getMimeTypeFromExtension(extension) {
  const mimeTypes = {
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}

// Main execution
console.log('Starting font optimization...');

// Find font files
const fontFiles = findFontFiles();
console.log(`Found ${fontFiles.length} font files`);

// Add font-display to CSS
addFontDisplayToCSS();

// Add preload links to HTML
addPreloadLinksToHTML(fontFiles);

console.log('Font optimization completed!');
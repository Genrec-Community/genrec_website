const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');

// Configuration
const config = {
  jsDir: path.join(__dirname, '../src'),
  cssDir: path.join(__dirname, '../src'),
  outputDir: path.join(__dirname, '../public/assets/minified'),
  jsOptions: {
    compress: true,
    mangle: true
  },
  cssOptions: {
    level: 2
  }
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Process JavaScript files
const minifyJS = async (filePath, outputPath) => {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const result = await minify(code, config.jsOptions);
    fs.writeFileSync(outputPath, result.code);
    console.log(`Minified JS: ${outputPath}`);
  } catch (error) {
    console.error(`Error minifying ${filePath}:`, error);
  }
};

// Process CSS files
const minifyCSS = (filePath, outputPath) => {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const result = new CleanCSS(config.cssOptions).minify(code);
    fs.writeFileSync(outputPath, result.styles);
    console.log(`Minified CSS: ${outputPath}`);
  } catch (error) {
    console.error(`Error minifying ${filePath}:`, error);
  }
};

// Walk through directory recursively
const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
};

// Process all files
const processFiles = () => {
  // Process JS files
  walkDir(config.jsDir, (filePath) => {
    if (path.extname(filePath) === '.js') {
      const relativePath = path.relative(config.jsDir, filePath);
      const outputPath = path.join(config.outputDir, relativePath);
      const outputDir = path.dirname(outputPath);
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      minifyJS(filePath, outputPath);
    }
  });
  
  // Process CSS files
  walkDir(config.cssDir, (filePath) => {
    if (path.extname(filePath) === '.css') {
      const relativePath = path.relative(config.cssDir, filePath);
      const outputPath = path.join(config.outputDir, relativePath);
      const outputDir = path.dirname(outputPath);
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      minifyCSS(filePath, outputPath);
    }
  });
};

processFiles();
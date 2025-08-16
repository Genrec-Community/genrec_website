/**
 * Critical CSS Extraction Script
 * 
 * This script extracts critical CSS for above-the-fold content and inlines it
 * in the HTML to improve page load performance.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const puppeteer = require('puppeteer');

// Configuration
const CONFIG = {
  // HTML file to add critical CSS to
  htmlFile: path.join(__dirname, '../build/index.html'),
  
  // URL to extract critical CSS from (local development server)
  url: 'http://localhost:3000',
  
  // Viewport dimensions for critical CSS extraction
  viewport: {
    width: 1920,
    height: 1080
  },
  
  // Maximum size of critical CSS in bytes
  maxCriticalSize: 20 * 1024 // 20KB
};

/**
 * Extracts critical CSS from a webpage
 * 
 * @returns {Promise<string>} Critical CSS
 */
async function extractCriticalCSS() {
  console.log(`Extracting critical CSS from ${CONFIG.url}...`);
  
  let browser;
  try {
    // Launch headless browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport(CONFIG.viewport);
    
    // Navigate to URL
    await page.goto(CONFIG.url, { waitUntil: 'networkidle0' });
    
    // Extract all CSS
    const criticalCSS = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      let css = '';
      
      styleSheets.forEach(sheet => {
        try {
          // Skip external stylesheets (CORS restrictions)
          if (!sheet.href || sheet.href.startsWith(window.location.origin)) {
            const rules = Array.from(sheet.cssRules);
            
            rules.forEach(rule => {
              // Only include rules that apply to elements in the viewport
              if (rule.selectorText) {
                try {
                  const elements = document.querySelectorAll(rule.selectorText);
                  
                  for (let i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    const rect = element.getBoundingClientRect();
                    
                    // Check if element is in viewport
                    if (
                      rect.top < window.innerHeight &&
                      rect.left < window.innerWidth &&
                      rect.bottom > 0 &&
                      rect.right > 0
                    ) {
                      css += rule.cssText + '\n';
                      break;
                    }
                  }
                } catch (e) {
                  // Invalid selector, include it anyway
                  css += rule.cssText + '\n';
                }
              } else {
                // Include non-selector rules (e.g., @font-face, @keyframes)
                css += rule.cssText + '\n';
              }
            });
          }
        } catch (e) {
          console.warn(`Error processing stylesheet: ${e.message}`);
        }
      });
      
      return css;
    });
    
    // Limit size of critical CSS
    let limitedCSS = criticalCSS;
    if (criticalCSS.length > CONFIG.maxCriticalSize) {
      limitedCSS = criticalCSS.substring(0, CONFIG.maxCriticalSize);
      console.warn(`Critical CSS exceeds maximum size (${criticalCSS.length} bytes). Truncating to ${CONFIG.maxCriticalSize} bytes.`);
    }
    
    return limitedCSS;
  } catch (error) {
    console.error(`Error extracting critical CSS: ${error.message}`);
    return '';
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Inlines critical CSS in HTML file
 * 
 * @param {string} criticalCSS - Critical CSS to inline
 */
function inlineCriticalCSS(criticalCSS) {
  if (!fs.existsSync(CONFIG.htmlFile)) {
    console.warn(`HTML file does not exist: ${CONFIG.htmlFile}`);
    return;
  }
  
  try {
    // Read HTML file
    const htmlContent = fs.readFileSync(CONFIG.htmlFile, 'utf8');
    
    // Parse HTML
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    
    // Check if critical CSS already exists
    const existingCritical = document.querySelector('style[data-critical="true"]');
    if (existingCritical) {
      existingCritical.textContent = criticalCSS;
      console.log('Updated existing critical CSS');
    } else {
      // Create style element for critical CSS
      const styleElement = document.createElement('style');
      styleElement.setAttribute('data-critical', 'true');
      styleElement.textContent = criticalCSS;
      
      // Add to head
      const head = document.querySelector('head');
      head.insertBefore(styleElement, head.firstChild);
      
      console.log('Added critical CSS to HTML');
    }
    
    // Add preload for non-critical CSS
    const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
    linkElements.forEach(link => {
      // Change rel to preload and add onload handler
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'style');
      link.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");
      
      // Add noscript fallback
      const noscript = document.createElement('noscript');
      const fallbackLink = document.createElement('link');
      fallbackLink.setAttribute('rel', 'stylesheet');
      fallbackLink.setAttribute('href', link.getAttribute('href'));
      noscript.appendChild(fallbackLink);
      
      link.parentNode.insertBefore(noscript, link.nextSibling);
    });
    
    // Write modified HTML back to file
    fs.writeFileSync(CONFIG.htmlFile, dom.serialize(), 'utf8');
    console.log(`Inlined critical CSS in ${CONFIG.htmlFile}`);
  } catch (error) {
    console.error(`Error inlining critical CSS: ${error.message}`);
  }
}

// Main execution
async function main() {
  console.log('Starting critical CSS extraction...');
  
  try {
    // Extract critical CSS
    const criticalCSS = await extractCriticalCSS();
    
    if (criticalCSS) {
      // Inline critical CSS in HTML
      inlineCriticalCSS(criticalCSS);
      console.log(`Critical CSS extraction completed! (${criticalCSS.length} bytes)`);
    } else {
      console.warn('No critical CSS extracted.');
    }
  } catch (error) {
    console.error(`Critical CSS extraction failed: ${error.message}`);
  }
}

// Run the script
main();
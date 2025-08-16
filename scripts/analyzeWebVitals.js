/**
 * Core Web Vitals Analysis Script
 * 
 * This script helps analyze and improve Core Web Vitals metrics:
 * - Largest Contentful Paint (LCP): Under 2.5 seconds
 * - First Input Delay (FID): Under 100 milliseconds
 * - Cumulative Layout Shift (CLS): Under 0.1
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  htmlFile: path.join(__dirname, '../public/index.html'),
  cssFiles: [
    path.join(__dirname, '../src/App.css'),
    // Add other CSS files as needed
  ],
  jsFiles: [
    path.join(__dirname, '../src/index.js'),
    // Add other JS files as needed
  ]
};

// Analyze and optimize HTML for Core Web Vitals
const analyzeHTML = () => {
  console.log('\n🔍 Analyzing HTML for Core Web Vitals improvements...');
  
  try {
    const html = fs.readFileSync(config.htmlFile, 'utf8');
    
    // Check for preload of critical resources
    const hasPreloadFonts = html.includes('rel="preload"') && html.includes('as="font"');
    const hasPreloadCSS = html.includes('rel="preload"') && html.includes('as="style"');
    const hasPreloadJS = html.includes('rel="preload"') && html.includes('as="script"');
    
    console.log('✓ Preload critical fonts:', hasPreloadFonts ? 'Yes' : 'No - Consider adding preload for critical fonts');
    console.log('✓ Preload critical CSS:', hasPreloadCSS ? 'Yes' : 'No - Consider adding preload for critical CSS');
    console.log('✓ Preload critical JS:', hasPreloadJS ? 'Yes' : 'No - Consider adding preload for critical JS');
    
    // Check for render-blocking resources
    const hasRenderBlockingCSS = html.includes('<link rel="stylesheet"') && !html.includes('media="print"');
    const hasRenderBlockingJS = html.includes('<script') && !html.includes('defer') && !html.includes('async');
    
    console.log('✓ Render-blocking CSS:', hasRenderBlockingCSS ? 'Yes - Consider using media="print" and onload' : 'No');
    console.log('✓ Render-blocking JS:', hasRenderBlockingJS ? 'Yes - Consider adding defer or async attributes' : 'No');
    
    // Check for image optimization attributes
    const hasLazyLoading = html.includes('loading="lazy"');
    const hasSrcset = html.includes('srcset="');
    const hasSizes = html.includes('sizes="');
    
    console.log('✓ Lazy loading for images:', hasLazyLoading ? 'Yes' : 'No - Consider adding loading="lazy" to non-critical images');
    console.log('✓ Responsive images (srcset):', hasSrcset ? 'Yes' : 'No - Consider adding srcset for responsive images');
    console.log('✓ Responsive images (sizes):', hasSizes ? 'Yes' : 'No - Consider adding sizes attribute for responsive images');
  } catch (error) {
    console.error('Error analyzing HTML:', error);
  }
};

// Analyze and optimize CSS for Core Web Vitals
const analyzeCSS = () => {
  console.log('\n🔍 Analyzing CSS for Core Web Vitals improvements...');
  
  config.cssFiles.forEach(file => {
    try {
      const css = fs.readFileSync(file, 'utf8');
      const fileName = path.basename(file);
      
      // Check for layout shift causes
      const hasFixedHeight = css.includes('height:') || css.includes('height :');
      const hasFixedWidth = css.includes('width:') || css.includes('width :');
      const hasTransform = css.includes('transform:') || css.includes('transform :');
      
      console.log(`\nFile: ${fileName}`);
      console.log('✓ Fixed dimensions:', hasFixedHeight && hasFixedWidth ? 'Yes - Check if this could cause CLS issues' : 'No');
      console.log('✓ Using transform for animations:', hasTransform ? 'Yes - Good for performance' : 'No - Consider using transform instead of properties that trigger layout');
      
      // Check for content visibility
      const hasContentVisibility = css.includes('content-visibility:') || css.includes('content-visibility :');
      console.log('✓ Using content-visibility:', hasContentVisibility ? 'Yes - Good for performance' : 'No - Consider using content-visibility for off-screen content');
      
      // Check for will-change
      const hasWillChange = css.includes('will-change:') || css.includes('will-change :');
      console.log('✓ Using will-change:', hasWillChange ? 'Yes - Use sparingly' : 'No - Consider for frequently animated elements');
    } catch (error) {
      console.error(`Error analyzing CSS file ${file}:`, error);
    }
  });
};

// Analyze and optimize JS for Core Web Vitals
const analyzeJS = () => {
  console.log('\n🔍 Analyzing JS for Core Web Vitals improvements...');
  
  config.jsFiles.forEach(file => {
    try {
      const js = fs.readFileSync(file, 'utf8');
      const fileName = path.basename(file);
      
      // Check for performance issues
      const hasRequestAnimationFrame = js.includes('requestAnimationFrame');
      const hasIntersectionObserver = js.includes('IntersectionObserver');
      const hasEventListeners = (js.match(/addEventListener/g) || []).length;
      
      console.log(`\nFile: ${fileName}`);
      console.log('✓ Using requestAnimationFrame:', hasRequestAnimationFrame ? 'Yes - Good for animations' : 'No - Consider for animations');
      console.log('✓ Using IntersectionObserver:', hasIntersectionObserver ? 'Yes - Good for lazy loading' : 'No - Consider for lazy loading and deferring off-screen work');
      console.log('✓ Event listeners:', hasEventListeners > 0 ? `${hasEventListeners} found - Check if properly removed when not needed` : 'None found');
      
      // Check for code splitting
      const hasImportDynamic = js.includes('import(');
      const hasReactLazy = js.includes('React.lazy') || js.includes('lazy(');
      
      console.log('✓ Dynamic imports:', hasImportDynamic ? 'Yes - Good for code splitting' : 'No - Consider for large dependencies');
      console.log('✓ React.lazy:', hasReactLazy ? 'Yes - Good for code splitting' : 'No - Consider for component lazy loading');
    } catch (error) {
      console.error(`Error analyzing JS file ${file}:`, error);
    }
  });
};

// Provide recommendations for improving Core Web Vitals
const provideRecommendations = () => {
  console.log('\n📋 Core Web Vitals Improvement Recommendations:');
  
  console.log('\n🚀 Largest Contentful Paint (LCP) - Target: Under 2.5 seconds');
  console.log('1. Optimize and preload critical CSS');
  console.log('2. Optimize and preload web fonts');
  console.log('3. Implement responsive images with srcset and sizes');
  console.log('4. Use a CDN for static assets');
  console.log('5. Optimize server response time');
  
  console.log('\n⚡ First Input Delay (FID) - Target: Under 100 milliseconds');
  console.log('1. Break up long tasks (>50ms)');
  console.log('2. Optimize JavaScript execution');
  console.log('3. Use web workers for heavy computations');
  console.log('4. Implement code splitting and lazy loading');
  console.log('5. Minimize unused JavaScript');
  
  console.log('\n📏 Cumulative Layout Shift (CLS) - Target: Under 0.1');
  console.log('1. Always include size attributes on images and videos');
  console.log('2. Reserve space for ads, embeds, and iframes');
  console.log('3. Avoid inserting content above existing content');
  console.log('4. Use transform animations instead of properties that trigger layout');
  console.log('5. Preload fonts to prevent layout shift when fonts load');
};

// Run the analysis
const runAnalysis = () => {
  console.log('\n🔎 CORE WEB VITALS ANALYSIS');
  console.log('============================');
  
  analyzeHTML();
  analyzeCSS();
  analyzeJS();
  provideRecommendations();
  
  console.log('\n✅ Analysis complete. Implement the recommendations to improve Core Web Vitals scores.');
  console.log('📊 After implementation, test your site with:');
  console.log('   - Google PageSpeed Insights: https://pagespeed.web.dev/');
  console.log('   - Chrome DevTools Performance panel');
  console.log('   - Chrome User Experience Report in Google Search Console');
};

runAnalysis();
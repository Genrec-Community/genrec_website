/**
 * Utility functions for optimizing font loading
 */

/**
 * Dynamically load a font with optimal performance settings
 * @param {string} fontFamily - Font family name
 * @param {string} url - URL to the font file
 * @param {Object} options - Additional options
 * @param {string} options.fontStyle - Font style (default: 'normal')
 * @param {string} options.fontWeight - Font weight (default: '400')
 * @param {string} options.fontDisplay - Font display strategy (default: 'swap')
 */
export const loadFont = (fontFamily, url, options = {}) => {
  const {
    fontStyle = 'normal',
    fontWeight = '400',
    fontDisplay = 'swap'
  } = options;

  // Create a new @font-face rule
  const fontFace = new FontFace(
    fontFamily,
    `url(${url})`,
    {
      style: fontStyle,
      weight: fontWeight,
      display: fontDisplay
    }
  );

  // Load the font and add it to the document
  fontFace.load().then(loadedFace => {
    document.fonts.add(loadedFace);
  }).catch(error => {
    console.error(`Failed to load font: ${fontFamily}`, error);
  });
};

/**
 * Add a preload link for critical fonts
 * @param {string} url - URL to the font file
 * @param {string} type - Font MIME type (e.g., 'font/woff2')
 */
export const preloadFont = (url, type = 'font/woff2') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = 'font';
  link.type = type;
  link.crossOrigin = 'anonymous';
  
  document.head.appendChild(link);
};

/**
 * Initialize font optimization for the application
 * @param {Array} criticalFonts - Array of critical fonts to preload
 * @param {Array} nonCriticalFonts - Array of non-critical fonts to load with lower priority
 */
export const initFontOptimization = (criticalFonts = [], nonCriticalFonts = []) => {
  // Preload critical fonts immediately
  criticalFonts.forEach(font => {
    preloadFont(font.url, font.type);
    loadFont(font.family, font.url, {
      fontWeight: font.weight,
      fontStyle: font.style,
      fontDisplay: 'swap'
    });
  });

  // Load non-critical fonts after page load
  if (nonCriticalFonts.length > 0) {
    if (document.readyState === 'complete') {
      loadNonCriticalFonts();
    } else {
      window.addEventListener('load', loadNonCriticalFonts);
    }
  }

  function loadNonCriticalFonts() {
    // Use requestIdleCallback if available, otherwise use setTimeout
    const scheduleLoad = window.requestIdleCallback || 
      (cb => setTimeout(cb, 1));

    scheduleLoad(() => {
      nonCriticalFonts.forEach(font => {
        loadFont(font.family, font.url, {
          fontWeight: font.weight,
          fontStyle: font.style,
          fontDisplay: 'swap'
        });
      });
    });
  }
};
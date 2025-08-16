/**
 * Utility functions for lazy loading resources
 */

/**
 * Dynamically load a script when needed
 * @param {string} src - Script URL to load
 * @param {Function} callback - Optional callback function to execute when script loads
 * @param {Object} options - Additional options
 * @param {boolean} options.async - Whether to load the script asynchronously
 * @param {boolean} options.defer - Whether to defer loading the script
 * @returns {Promise} - Promise that resolves when the script is loaded
 */
export const loadScript = (src, callback, options = {}) => {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      if (callback) callback();
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    
    // Apply options
    if (options.async) script.async = true;
    if (options.defer) script.defer = true;
    
    // Set up load handlers
    script.onload = () => {
      if (callback) callback();
      resolve();
    };
    
    script.onerror = (error) => {
      console.error(`Failed to load script: ${src}`, error);
      reject(error);
    };
    
    document.body.appendChild(script);
  });
};

/**
 * Load a script only when the user scrolls to a certain point
 * @param {string} src - Script URL to load
 * @param {number} scrollThreshold - Percentage of page scrolled before loading (0-100)
 * @param {Function} callback - Optional callback function to execute when script loads
 */
export const loadScriptOnScroll = (src, scrollThreshold = 50, callback) => {
  const handleScroll = () => {
    const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercentage >= scrollThreshold) {
      // Remove scroll listener to prevent multiple loads
      window.removeEventListener('scroll', handleScroll);
      
      // Load the script
      loadScript(src, callback, { async: true });
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Check initial scroll position in case user is already past threshold
  handleScroll();
};

/**
 * Load a script only when a specific element is about to enter the viewport
 * @param {string} src - Script URL to load
 * @param {string} targetSelector - CSS selector for the target element
 * @param {Function} callback - Optional callback function to execute when script loads
 * @param {Object} options - IntersectionObserver options
 */
export const loadScriptOnElementVisible = (src, targetSelector, callback, options = {}) => {
  const element = document.querySelector(targetSelector);
  
  if (!element) {
    console.warn(`Element with selector "${targetSelector}" not found for lazy loading script`);
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Load the script
        loadScript(src, callback, { async: true });
        
        // Stop observing once loaded
        observer.disconnect();
      }
    });
  }, {
    rootMargin: '200px 0px', // Start loading when element is 200px from viewport
    threshold: 0,
    ...options
  });
  
  observer.observe(element);
};
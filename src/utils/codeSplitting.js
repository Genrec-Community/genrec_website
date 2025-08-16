/**
 * Code Splitting Utilities
 * 
 * This module provides utilities for implementing code splitting in React applications
 * to improve performance by reducing the initial bundle size and loading components
 * only when needed.
 */

import React, { lazy, Suspense } from 'react';

/**
 * Default loading component used as fallback during component loading
 */
export const DefaultLoadingComponent = () => (
  <div className="lazy-loading-fallback">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

/**
 * Creates a lazily loaded component with a custom loading fallback
 * 
 * @param {Function} importFunc - Dynamic import function that returns a promise
 * @param {Object} options - Configuration options
 * @param {React.Component} options.fallback - Component to show while loading
 * @param {number} options.delay - Minimum delay before showing component (ms)
 * @returns {React.Component} - Lazy-loaded component wrapped in Suspense
 */
export const lazyLoad = (importFunc, options = {}) => {
  const {
    fallback = <DefaultLoadingComponent />,
    delay = 0
  } = options;
  
  const LazyComponent = lazy(() => {
    // Add artificial delay if specified
    if (delay > 0) {
      return new Promise(resolve => {
        setTimeout(() => {
          importFunc().then(resolve);
        }, delay);
      });
    }
    return importFunc();
  });
  
  return props => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Creates a lazily loaded component with retry capability
 * 
 * @param {Function} importFunc - Dynamic import function that returns a promise
 * @param {Object} options - Configuration options
 * @param {React.Component} options.fallback - Component to show while loading
 * @param {number} options.maxRetries - Maximum number of retry attempts
 * @param {number} options.retryDelay - Base delay between retries (ms)
 * @returns {React.Component} - Lazy-loaded component with retry capability
 */
export const lazyLoadWithRetry = (importFunc, options = {}) => {
  const {
    fallback = <DefaultLoadingComponent />,
    maxRetries = 3,
    retryDelay = 1000
  } = options;
  
  const LazyComponent = lazy(() => {
    return retryImport(importFunc, maxRetries, retryDelay);
  });
  
  return props => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Helper function to retry imports with exponential backoff
 * 
 * @param {Function} importFunc - Dynamic import function
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Base delay between retries (ms)
 * @param {number} retryCount - Current retry count (internal use)
 * @returns {Promise} - Promise that resolves to the imported module
 */
const retryImport = (importFunc, maxRetries, delay, retryCount = 0) => {
  return importFunc().catch(error => {
    if (retryCount < maxRetries) {
      const nextRetryDelay = delay * Math.pow(2, retryCount);
      console.log(`Retrying import (${retryCount + 1}/${maxRetries}) after ${nextRetryDelay}ms`);
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(retryImport(importFunc, maxRetries, delay, retryCount + 1));
        }, nextRetryDelay);
      });
    }
    
    // If we've exhausted all retries, throw the error
    throw error;
  });
};

/**
 * Prefetches a component to improve perceived performance
 * 
 * @param {Function} importFunc - Dynamic import function
 */
export const prefetchComponent = (importFunc) => {
  importFunc().catch(error => {
    console.warn('Error prefetching component:', error);
  });
};

/**
 * Creates a bundle of related components that should be loaded together
 * 
 * @param {Object} imports - Object mapping component names to import functions
 * @param {Object} options - Configuration options
 * @returns {Object} - Object with lazy-loaded components
 */
export const createBundle = (imports, options = {}) => {
  const bundle = {};
  
  Object.entries(imports).forEach(([name, importFunc]) => {
    bundle[name] = lazyLoad(importFunc, options);
  });
  
  return bundle;
};
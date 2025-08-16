/**
 * Cache Control Middleware
 * 
 * This middleware sets appropriate cache headers for different types of static assets
 * to improve performance by leveraging browser caching.
 */

const path = require('path');

/**
 * Cache duration configuration (in seconds)
 */
const CACHE_DURATIONS = {
  // Long-term caching for assets with content hash in filename
  hashedAssets: 31536000, // 1 year
  
  // Medium-term caching for assets that change occasionally
  images: 604800, // 1 week
  videos: 604800, // 1 week
  fonts: 604800, // 1 week
  
  // Short-term caching for assets that may change frequently
  css: 86400, // 1 day
  js: 86400, // 1 day
  
  // No caching for HTML and other dynamic content
  html: 0,
  default: 3600 // 1 hour
};

/**
 * Determines if a file is a hashed asset (contains content hash in filename)
 * 
 * @param {string} filePath - Path of the file
 * @returns {boolean} - True if the file is a hashed asset
 */
const isHashedAsset = (filePath) => {
  // Check if filename contains a content hash pattern (e.g., main.a1b2c3d4.js)
  const filename = path.basename(filePath);
  return /\.[a-f0-9]{8,}\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/i.test(filename);
};

/**
 * Gets the appropriate cache duration based on file extension
 * 
 * @param {string} filePath - Path of the file
 * @returns {number} - Cache duration in seconds
 */
const getCacheDuration = (filePath) => {
  // Check if it's a hashed asset first
  if (isHashedAsset(filePath)) {
    return CACHE_DURATIONS.hashedAssets;
  }
  
  const ext = path.extname(filePath).toLowerCase();
  
  switch (ext) {
    case '.html':
    case '.htm':
      return CACHE_DURATIONS.html;
      
    case '.css':
      return CACHE_DURATIONS.css;
      
    case '.js':
      return CACHE_DURATIONS.js;
      
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
    case '.webp':
    case '.svg':
      return CACHE_DURATIONS.images;
      
    case '.mp4':
    case '.webm':
    case '.ogg':
      return CACHE_DURATIONS.videos;
      
    case '.woff':
    case '.woff2':
    case '.ttf':
    case '.eot':
    case '.otf':
      return CACHE_DURATIONS.fonts;
      
    default:
      return CACHE_DURATIONS.default;
  }
};

/**
 * Middleware function to set cache control headers
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const cacheControl = (req, res, next) => {
  // Skip for API requests
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  const cacheDuration = getCacheDuration(req.path);
  
  if (cacheDuration > 0) {
    // Set Cache-Control header
    res.setHeader(
      'Cache-Control',
      `public, max-age=${cacheDuration}, stale-while-revalidate=${Math.floor(cacheDuration * 0.1)}`
    );
    
    // Set Expires header
    const expiresDate = new Date();
    expiresDate.setSeconds(expiresDate.getSeconds() + cacheDuration);
    res.setHeader('Expires', expiresDate.toUTCString());
  } else {
    // No caching for HTML and dynamic content
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
};

module.exports = cacheControl;
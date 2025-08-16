/**
 * Compression Middleware Configuration
 * 
 * This module configures compression middleware for Express to reduce
 * the size of HTTP responses, improving load times and reducing bandwidth usage.
 */

const compression = require('compression');

/**
 * Determines if compression should be applied based on request and response
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Boolean} - Whether compression should be applied
 */
const shouldCompress = (req, res) => {
  // Don't compress if client doesn't accept gzip encoding
  if (req.headers['accept-encoding'] && !req.headers['accept-encoding'].includes('gzip')) {
    return false;
  }
  
  // Don't compress responses with this header
  if (req.headers['x-no-compression']) {
    return false;
  }
  
  // Skip compression for small responses (less than 1KB)
  if (res.getHeader('Content-Length') && parseInt(res.getHeader('Content-Length')) < 1024) {
    return false;
  }
  
  // Use compression filter
  return compression.filter(req, res);
};

/**
 * Compression middleware configuration
 */
const compressionMiddleware = compression({
  // Compression level (0-9, where 9 is maximum compression)
  level: 6,
  
  // Minimum size threshold in bytes (don't compress responses smaller than this)
  threshold: 1024, // 1KB
  
  // Custom compression filter function
  filter: shouldCompress,
  
  // Compression strategy
  strategy: compression.Z_DEFAULT_STRATEGY,
  
  // Response byte threshold at which to use synchronous deflate
  chunkSize: 16 * 1024, // 16KB
  
  // Minimum compression ratio (compressed size / original size)
  // If compression doesn't achieve this ratio, uncompressed response is sent
  minRatio: 0.8 // 20% compression ratio
});

module.exports = compressionMiddleware;
/**
 * HTTP/2 Server Push Middleware
 * 
 * This middleware implements HTTP/2 Server Push for critical assets
 * to improve page load performance by proactively sending resources
 * to the client before they are explicitly requested.
 */

const fs = require('fs');
const path = require('path');

/**
 * Configuration for assets to push
 * Add critical assets that should be pushed to the client
 */
const ASSETS_TO_PUSH = [
  { path: '/Genrec_Full_Logo.png', type: 'image/png' },
  { path: '/background-video.mp4', type: 'video/mp4' },
  { path: '/static/css/main.chunk.css', type: 'text/css' },
  { path: '/static/js/main.chunk.js', type: 'application/javascript' }
];

/**
 * Middleware function to implement HTTP/2 Server Push
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const http2ServerPush = (req, res, next) => {
  // Only push assets for HTML requests (main page loads)
  if (req.path === '/' || req.path.endsWith('.html')) {
    // Check if we're using HTTP/2
    if (req.httpVersion === '2.0') {
      // Create Link header for HTTP/2 Server Push
      const linkHeader = ASSETS_TO_PUSH.map(asset => {
        return `<${asset.path}>; rel=preload; as=${getAssetType(asset.type)}`;
      }).join(', ');
      
      // Set Link header for HTTP/2 Server Push
      if (linkHeader) {
        res.setHeader('Link', linkHeader);
      }
      
      console.log(`HTTP/2 Server Push enabled for ${req.path}`);
    } else {
      console.log(`HTTP/2 not detected, Server Push disabled for ${req.path}`);
    }
  }
  
  next();
};

/**
 * Get the asset type for the 'as' attribute in Link header
 * 
 * @param {string} mimeType - MIME type of the asset
 * @returns {string} - Asset type for preload
 */
const getAssetType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'text/css') return 'style';
  if (mimeType === 'application/javascript') return 'script';
  if (mimeType === 'font/woff2' || mimeType === 'font/woff') return 'font';
  return 'fetch';
};

/**
 * Dynamically generate the list of assets to push based on the build directory
 * 
 * @param {string} buildDir - Path to the build directory
 * @returns {Array} - List of assets to push
 */
const generateAssetsToPush = (buildDir) => {
  const assets = [];
  
  try {
    // Read the asset-manifest.json file to get the list of assets
    const manifestPath = path.join(buildDir, 'asset-manifest.json');
    
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Add main CSS files
      if (manifest.files && manifest.files['main.css']) {
        assets.push({
          path: manifest.files['main.css'],
          type: 'text/css'
        });
      }
      
      // Add main JS files
      if (manifest.files && manifest.files['main.js']) {
        assets.push({
          path: manifest.files['main.js'],
          type: 'application/javascript'
        });
      }
    }
    
    // Add other critical assets
    assets.push({ path: '/Genrec_Full_Logo.png', type: 'image/png' });
    assets.push({ path: '/background-video.mp4', type: 'video/mp4' });
    
    return assets;
  } catch (error) {
    console.error('Error generating assets to push:', error);
    return ASSETS_TO_PUSH; // Fallback to default assets
  }
};

module.exports = http2ServerPush;
module.exports.generateAssetsToPush = generateAssetsToPush;
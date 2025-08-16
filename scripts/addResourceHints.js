/**
 * Resource Hints Implementation Script
 * 
 * This script adds resource hints to the index.html file to improve performance:
 * - dns-prefetch: Pre-resolves DNS for external domains
 * - preconnect: Establishes early connections to important origins
 * - preload: Loads critical resources earlier in the page lifecycle
 * - prefetch: Fetches resources likely needed for future navigations
 * - prerender: Pre-renders pages likely to be visited next
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  htmlFile: path.join(__dirname, '../public/index.html'),
  resourceHints: {
    dnsPrefetch: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://app.posthog.com'
    ],
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ],
    preload: [
      { href: '/Genrec_Full_Logo.png', as: 'image', type: 'image/png' },
      { href: '/background-video.mp4', as: 'video', type: 'video/mp4' }
    ],
    prefetch: [
      { href: '/images/projects/project1.jpg', as: 'image' },
      { href: '/images/projects/project2.jpg', as: 'image' }
    ]
  }
};

// Generate resource hint tags
const generateResourceHints = () => {
  let hints = '';
  
  // DNS Prefetch
  config.resourceHints.dnsPrefetch.forEach(url => {
    hints += `    <link rel="dns-prefetch" href="${url}">\n`;
  });
  
  // Preconnect
  config.resourceHints.preconnect.forEach(url => {
    hints += `    <link rel="preconnect" href="${url}" crossorigin>\n`;
  });
  
  // Preload
  config.resourceHints.preload.forEach(resource => {
    hints += `    <link rel="preload" href="${resource.href}" as="${resource.as}"${resource.type ? ` type="${resource.type}"` : ''}${resource.as === 'font' ? ' crossorigin' : ''}>\n`;
  });
  
  // Prefetch
  config.resourceHints.prefetch.forEach(resource => {
    hints += `    <link rel="prefetch" href="${resource.href}"${resource.as ? ` as="${resource.as}"` : ''}>\n`;
  });
  
  return hints;
};

// Add resource hints to HTML file
const addResourceHints = () => {
  try {
    // Read the HTML file
    let html = fs.readFileSync(config.htmlFile, 'utf8');
    
    // Generate resource hints
    const resourceHints = generateResourceHints();
    
    // Check if resource hints already exist
    if (html.includes('dns-prefetch') || html.includes('preconnect')) {
      console.log('Resource hints already exist in the HTML file.');
      console.log('Updating existing resource hints...');
      
      // Find the head section
      const headStartIndex = html.indexOf('<head>');
      const headEndIndex = html.indexOf('</head>');
      
      if (headStartIndex !== -1 && headEndIndex !== -1) {
        const headContent = html.substring(headStartIndex + 6, headEndIndex);
        
        // Remove existing resource hints
        const cleanedHeadContent = headContent
          .replace(/<link rel="dns-prefetch"[^>]*>/g, '')
          .replace(/<link rel="preconnect"[^>]*>/g, '')
          .replace(/<link rel="preload"[^>]*>/g, '')
          .replace(/<link rel="prefetch"[^>]*>/g, '');
        
        // Add new resource hints at the beginning of the head
        const newHeadContent = `<head>\n${resourceHints}${cleanedHeadContent}`;
        
        // Replace the head section
        html = html.replace(html.substring(headStartIndex, headEndIndex + 7), newHeadContent + '</head>');
      }
    } else {
      // Add resource hints after the head tag
      html = html.replace('<head>', `<head>\n${resourceHints}`);
    }
    
    // Write the updated HTML file
    fs.writeFileSync(config.htmlFile, html);
    
    console.log('Resource hints added successfully!');
  } catch (error) {
    console.error('Error adding resource hints:', error);
  }
};

// Run the script
addResourceHints();
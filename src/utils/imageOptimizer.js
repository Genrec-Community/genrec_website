/**
 * Utility functions for optimizing images
 */

/**
 * Generate a responsive srcset for an image
 * @param {string} baseUrl - Base URL of the image
 * @param {Array<number>} widths - Array of widths to generate srcset for
 * @param {string} format - Image format (jpg, png, webp, avif)
 * @returns {string} - Formatted srcset string
 */
export const generateSrcSet = (baseUrl, widths = [320, 640, 960, 1280, 1920], format = 'webp') => {
  // Extract base path and original extension
  const lastDotIndex = baseUrl.lastIndexOf('.');
  const basePath = lastDotIndex !== -1 ? baseUrl.substring(0, lastDotIndex) : baseUrl;
  
  // Generate srcset string
  return widths
    .map(width => `${basePath}-${width}.${format} ${width}w`)
    .join(', ');
};

/**
 * Generate a picture element with multiple source formats for optimal browser support
 * @param {Object} props - Component props
 * @param {string} props.src - Original image source
 * @param {string} props.alt - Image alt text
 * @param {Array<number>} props.widths - Array of widths for srcset
 * @param {Array<string>} props.formats - Array of formats to include (default: ['webp', 'jpg'])
 * @param {Object} props.imgProps - Additional props for img element
 * @returns {JSX.Element} - Picture element with sources
 */
export const ResponsivePicture = ({ src, alt, widths, formats = ['webp', 'jpg'], imgProps = {} }) => {
  // Extract base path and original extension
  const lastDotIndex = src.lastIndexOf('.');
  const basePath = lastDotIndex !== -1 ? src.substring(0, lastDotIndex) : src;
  const originalExt = lastDotIndex !== -1 ? src.substring(lastDotIndex + 1) : 'jpg';
  
  return (
    <picture>
      {formats.map(format => (
        <source 
          key={format}
          type={`image/${format}`}
          srcSet={generateSrcSet(src, widths, format)}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ))}
      <img 
        src={src} 
        alt={alt} 
        loading="lazy"
        {...imgProps}
      />
    </picture>
  );
};

/**
 * Determine if an image should be lazy loaded based on its position
 * @param {number} index - Index of the image in a list
 * @param {number} threshold - Number of images to eagerly load
 * @returns {string} - 'eager' or 'lazy'
 */
export const getLoadingStrategy = (index, threshold = 2) => {
  return index < threshold ? 'eager' : 'lazy';
};

/**
 * Get appropriate image dimensions based on viewport size
 * @param {Object} dimensions - Object containing dimension options
 * @param {Object} dimensions.mobile - Mobile dimensions {width, height}
 * @param {Object} dimensions.tablet - Tablet dimensions {width, height}
 * @param {Object} dimensions.desktop - Desktop dimensions {width, height}
 * @returns {Object} - CSS object with responsive dimensions
 */
export const getResponsiveDimensions = ({ mobile, tablet, desktop }) => {
  return {
    width: '100%',
    height: 'auto',
    maxWidth: '100%',
    aspectRatio: `${desktop.width} / ${desktop.height}`,
    '@media (max-width: 768px)': {
      aspectRatio: `${tablet.width} / ${tablet.height}`,
    },
    '@media (max-width: 480px)': {
      aspectRatio: `${mobile.width} / ${mobile.height}`,
    },
  };
};
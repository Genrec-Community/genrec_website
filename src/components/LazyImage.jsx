import React, { useState, useEffect, useRef } from 'react';

/**
 * LazyImage component for optimized image loading using IntersectionObserver
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - CSS classes
 * @param {string} props.placeholderColor - Background color while loading (default: #1a1a1a)
 * @param {string} props.placeholderSrc - Optional placeholder image to show while loading
 * @param {number} props.threshold - Intersection observer threshold (0 to 1)
 * @param {string} props.rootMargin - Intersection observer root margin
 * @param {Object} props.imgProps - Additional props to pass to the img element
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderColor = '#1a1a1a',
  placeholderSrc = null,
  threshold = 0.1,
  rootMargin = '200px 0px',
  ...rest 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);

  // Set up intersection observer to detect when image enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [threshold, rootMargin]);

  // Load image when it comes into view
  useEffect(() => {
    if (!isInView) return;
    
    // Reset state when src changes
    setIsLoaded(false);
    setImageSrc(null);

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      setIsLoaded(true); // Still mark as loaded to remove placeholder
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, isInView]);

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: !isLoaded ? placeholderColor : 'transparent',
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* Placeholder image shown until the actual image is loaded */}
      {!isLoaded && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Actual image that loads when in viewport */}
      {isInView && imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          decoding="async"
          {...rest}
        />
      )}
    </div>
  );
};

export default LazyImage;
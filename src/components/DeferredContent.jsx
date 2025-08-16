import React, { useState, useEffect, useRef } from 'react';

/**
 * DeferredContent component that delays rendering its children until they are about to enter the viewport
 * or after a specified delay, whichever comes first.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be deferred
 * @param {number} props.delay - Maximum delay in ms before rendering regardless of visibility (default: 5000ms)
 * @param {string} props.placeholder - Optional placeholder to show while content is loading
 * @param {number} props.threshold - Intersection observer threshold (0-1)
 * @param {string} props.rootMargin - Intersection observer root margin
 */
const DeferredContent = ({
  children,
  delay = 5000,
  placeholder = null,
  threshold = 0,
  rootMargin = '200px 0px',
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Set up intersection observer to detect when element is near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Set up fallback timer to ensure content eventually renders
    const timer = setTimeout(() => {
      setShouldRender(true);
      observer.disconnect();
    }, delay);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [delay, threshold, rootMargin]);

  return (
    <div ref={containerRef}>
      {shouldRender ? children : placeholder}
    </div>
  );
};

export default DeferredContent;
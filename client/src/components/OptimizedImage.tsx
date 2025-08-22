import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  loading = 'lazy',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadTime, setLoadTime] = useState<number>(0);

  // Performance tracking
  useEffect(() => {
    const startTime = performance.now();
    
    const img = new Image();
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      setLoadTime(loadTime);
      setIsLoaded(true);
      
      // Log performance metrics for monitoring
      const pageName = window.location.pathname.split('/').pop() || 'home';
      console.log(`Image Performance: ${src} loaded in ${loadTime}ms (${getConnectionType()}) on ${pageName}`);
      
      onLoad?.();
    };
    
    img.onerror = () => {
      setHasError(true);
      onError?.();
    };
    
    img.src = currentSrc;
  }, [currentSrc, src, onLoad, onError]);

  // Get WebP version path
  const getWebPSrc = (originalSrc: string) => {
    if (originalSrc.includes('/optimized_assets/')) {
      return originalSrc.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    }
    
    // For attached_assets, try optimized version first
    if (originalSrc.includes('/attached_assets/')) {
      return originalSrc.replace('/attached_assets/', '/optimized_assets/').replace(/\.(png|jpg|jpeg)$/i, '.webp');
    }
    
    return originalSrc;
  };

  // Detect connection type for performance logging
  const getConnectionType = () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.effectiveType || 'unknown';
    }
    return 'network';
  };

  // Support for WebP with fallback
  const webpSrc = getWebPSrc(src);
  const supportsWebP = typeof window !== 'undefined' && 
    document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;

  const handleImageError = () => {
    if (currentSrc === webpSrc && webpSrc !== src) {
      // Fallback to original format
      setCurrentSrc(src);
    } else {
      setHasError(true);
      onError?.();
    }
  };

  // Use WebP if supported and available
  useEffect(() => {
    if (supportsWebP && webpSrc !== src) {
      setCurrentSrc(webpSrc);
    }
  }, [src, webpSrc, supportsWebP]);

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100 text-gray-400 text-sm",
          className
        )}
        style={{ width, height }}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <picture>
      {/* WebP source for modern browsers */}
      {supportsWebP && webpSrc !== src && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      
      {/* Fallback image */}
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        onError={handleImageError}
        style={{
          maxWidth: '100%',
          height: 'auto',
          ...(width && height ? { aspectRatio: `${width}/${height}` } : {})
        }}
      />
    </picture>
  );
}

// Hook for lazy loading images
export function useLazyImage(src: string, threshold = 0.1) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return { shouldLoad, ref: setRef };
}

// Preload critical images
export function preloadImage(src: string, priority: 'high' | 'low' = 'low') {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  
  if (priority === 'high') {
    link.setAttribute('fetchpriority', 'high');
  }
  
  document.head.appendChild(link);
}
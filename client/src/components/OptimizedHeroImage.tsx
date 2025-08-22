import { useState, useEffect } from 'react';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { imageCache } from '@/lib/imageCache';
import { heroImageOptimizer } from '@/lib/heroImageOptimizer';
import LoadingSkeleton from './LoadingSkeleton';

interface OptimizedHeroImageProps {
  src: string;
  className?: string;
  children?: React.ReactNode;
  fallbackColor?: string;
  priority?: boolean;
  overlayOpacity?: number;
}

export default function OptimizedHeroImage({ 
  src, 
  className = "", 
  children, 
  fallbackColor = "from-blue-900 to-blue-700",
  priority = true,
  overlayOpacity = 60
}: OptimizedHeroImageProps) {
  // Get optimized image source
  const optimizedSrc = heroImageOptimizer.getOptimalImageSrc(src);
  const { isLoaded, isError, isLoading } = useImagePreloader({ src: optimizedSrc, priority });
  const [imageError, setImageError] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (isError) {
      setImageError(true);
      console.warn(`Failed to load hero image: ${optimizedSrc}`);
    }
  }, [isError, optimizedSrc]);

  useEffect(() => {
    if (isLoaded && !imageError) {
      // Immediate show for better performance
      setShowImage(true);
    }
  }, [isLoaded, imageError]);

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Background Layer */}
      <div className="absolute inset-0">
        {/* Fallback gradient background - always visible */}
        <div className={`absolute inset-0 bg-gradient-to-br ${fallbackColor}`} />
        
        {/* Loading skeleton while image loads */}
        {isLoading && !isLoaded && (
          <LoadingSkeleton className="absolute inset-0" />
        )}
        
        {/* Image background - optimized fade in when loaded */}
        {showImage && (
          <div 
            className="absolute inset-0 hero-bg-optimized"
            style={{
              backgroundImage: `url(${optimizedSrc})`,
              opacity: 1,
              transition: 'opacity 0.2s ease-out',
              willChange: 'opacity',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          />
        )}
        
        {/* Dark overlay for text readability */}
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-300"
          style={{ opacity: overlayOpacity / 100 }}
        />
      </div>

      {/* Content - always visible to prevent layout shift */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
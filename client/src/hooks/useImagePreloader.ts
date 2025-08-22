import { useState, useEffect } from 'react';
import { imageCache } from '@/lib/imageCache';

interface UseImagePreloaderProps {
  src: string;
  priority?: boolean;
  page?: string;
}

export const useImagePreloader = ({ src, priority = false, page }: UseImagePreloaderProps) => {
  const [isLoaded, setIsLoaded] = useState(() => imageCache.isImageCached(src));
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(() => !imageCache.isImageCached(src));

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setIsError(true);
      return;
    }

    // If image is already cached, mark as loaded immediately
    if (imageCache.isImageCached(src)) {
      setIsLoaded(true);
      setIsError(false);
      setIsLoading(false);
      return;
    }

    // Load image through cache
    let cancelled = false;
    
    imageCache.loadImage(src, priority, page)
      .then(() => {
        if (!cancelled) {
          setIsLoaded(true);
          setIsError(false);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.warn(`Failed to load image: ${src}`, error);
          setIsError(true);
          setIsLoaded(false);
          setIsLoading(false);
        }
      });
    
    // Cleanup
    return () => {
      cancelled = true;
    };
  }, [src, priority, page]);

  return { isLoaded, isError, isLoading };
};

export const preloadImages = (imageSources: string[]) => {
  return Promise.allSettled(
    imageSources.map((src) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.fetchPriority = 'high';
        img.loading = 'eager';
        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error(`Failed to preload: ${src}`));
        img.src = src;
      });
    })
  );
};
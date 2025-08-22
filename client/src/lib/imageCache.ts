import { imagePerformanceMonitor } from './imagePerformanceMonitor';

// Image cache management for better performance
class ImageCache {
  private cache = new Map<string, HTMLImageElement>();
  private loadingPromises = new Map<string, Promise<HTMLImageElement>>();
  private maxCacheSize = 100;

  async loadImage(src: string, priority = false, page?: string): Promise<HTMLImageElement> {
    const startTime = performance.now();
    const pageName = page || window.location.pathname.replace('/', '') || 'home';
    
    // Return cached image if available
    if (this.cache.has(src)) {
      const loadTime = performance.now() - startTime;
      imagePerformanceMonitor.recordImageLoad(src, loadTime, true, pageName, true);
      return this.cache.get(src)!;
    }

    // Return existing loading promise if image is already being loaded
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    // Create new loading promise
    const promise = this.createImageLoadPromise(src, priority);
    this.loadingPromises.set(src, promise);

    try {
      const img = await promise;
      const loadTime = performance.now() - startTime;
      
      // Manage cache size to prevent memory leaks
      if (this.cache.size >= this.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        if (firstKey) this.cache.delete(firstKey);
      }
      
      this.cache.set(src, img);
      this.loadingPromises.delete(src);
      
      // Record successful load
      imagePerformanceMonitor.recordImageLoad(src, loadTime, false, pageName, true);
      
      return img;
    } catch (error) {
      const loadTime = performance.now() - startTime;
      this.loadingPromises.delete(src);
      
      // Record failed load
      imagePerformanceMonitor.recordImageLoad(src, loadTime, false, pageName, false, error instanceof Error ? error.message : 'Unknown error');
      
      throw error;
    }
  }

  private createImageLoadPromise(src: string, priority: boolean): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Performance optimizations
      img.decoding = 'async';
      img.crossOrigin = 'anonymous';
      
      if (priority) {
        img.fetchPriority = 'high';
        img.loading = 'eager';
      } else {
        img.fetchPriority = 'low';
        img.loading = 'lazy';
      }

      // Add timeout to prevent hanging loads
      const timeout = setTimeout(() => {
        reject(new Error(`Image load timeout: ${src}`));
      }, 15000);

      img.onload = () => {
        clearTimeout(timeout);
        resolve(img);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });
  }

  isImageCached(src: string): boolean {
    return this.cache.has(src);
  }

  preloadImages(sources: string[], highPriority = true): Promise<PromiseSettledResult<HTMLImageElement>[]> {
    const promises = sources.map((src, index) => {
      // First few images get highest priority
      const priority = highPriority && index < 3;
      return this.loadImage(src, priority);
    });
    return Promise.allSettled(promises);
  }

  // Preload critical images for container service pages
  preloadContainerServiceImages(): void {
    const criticalImages = [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    ];
    
    this.preloadImages(criticalImages);
  }

  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const imageCache = new ImageCache();
import { imageCache } from './imageCache';

// Advanced hero image optimization utilities
export class HeroImageOptimizer {
  private static instance: HeroImageOptimizer;
  private readonly supportedFormats = ['webp', 'avif', 'jpg', 'png'];
  private formatSupport: Record<string, boolean> = {};

  private constructor() {
    this.detectFormatSupport();
  }

  static getInstance(): HeroImageOptimizer {
    if (!HeroImageOptimizer.instance) {
      HeroImageOptimizer.instance = new HeroImageOptimizer();
    }
    return HeroImageOptimizer.instance;
  }

  private async detectFormatSupport(): Promise<void> {
    // Detect WebP support
    const webpTest = new Promise<boolean>((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => resolve(webP.height === 2);
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
    this.formatSupport.webp = await webpTest;

    // Detect AVIF support
    const avifTest = new Promise<boolean>((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => resolve(avif.height === 2);
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=';
    });
    this.formatSupport.avif = await avifTest;
  }

  // Get optimal image format based on browser support
  getOptimalImageSrc(originalSrc: string): string {
    // If it's already an external optimized URL, return as-is
    if (originalSrc.includes('unsplash.com')) {
      return this.optimizeUnsplashUrl(originalSrc);
    }

    // For local assets, check if we have optimized versions
    if (originalSrc.startsWith('/attached_assets/')) {
      // TODO: In production, you could implement server-side format conversion
      // For now, return original with cache optimization
      return originalSrc;
    }

    return originalSrc;
  }

  private optimizeUnsplashUrl(url: string): string {
    // Enhance Unsplash URLs with optimal parameters
    const urlObj = new URL(url);
    
    // Set optimal quality and format
    urlObj.searchParams.set('q', '75'); // Balanced quality/size
    urlObj.searchParams.set('fm', this.formatSupport.webp ? 'webp' : 'jpg');
    urlObj.searchParams.set('fit', 'crop');
    urlObj.searchParams.set('auto', 'format,compress');
    
    // Add responsive sizing based on viewport
    const viewportWidth = window.innerWidth;
    if (viewportWidth <= 768) {
      urlObj.searchParams.set('w', '800');
    } else if (viewportWidth <= 1200) {
      urlObj.searchParams.set('w', '1200');
    } else {
      urlObj.searchParams.set('w', '1600');
    }

    return urlObj.toString();
  }

  // Preload hero images with optimal format selection
  async preloadOptimizedHeroImage(src: string, priority = true): Promise<void> {
    const optimizedSrc = this.getOptimalImageSrc(src);
    
    try {
      await imageCache.loadImage(optimizedSrc, priority);
      console.log(`✅ Hero image preloaded: ${optimizedSrc}`);
    } catch (error) {
      console.warn(`⚠️ Failed to preload hero image: ${optimizedSrc}`, error);
    }
  }

  // Batch preload multiple hero images
  async batchPreloadHeroImages(sources: string[]): Promise<void> {
    const optimizedSources = sources.map(src => this.getOptimalImageSrc(src));
    
    // Preload in batches to avoid overwhelming the browser
    const batchSize = 3;
    for (let i = 0; i < optimizedSources.length; i += batchSize) {
      const batch = optimizedSources.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map((src, index) => 
          this.preloadOptimizedHeroImage(src, i === 0 && index < 2) // High priority for first 2 images
        )
      );
    }
  }

  // Get format support information for debugging
  getFormatSupport(): Record<string, boolean> {
    return { ...this.formatSupport };
  }
}

export const heroImageOptimizer = HeroImageOptimizer.getInstance();
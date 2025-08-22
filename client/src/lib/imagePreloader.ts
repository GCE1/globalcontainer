// Critical hero images that should be preloaded immediately
export const CRITICAL_HERO_IMAGES = [
  '/attached_assets/hero%20image.png',
  '/attached_assets/container-depot_1749154371445.png',
  '/attached_assets/Container-Sales_1749330300707.png',
  '/attached_assets/Container-route-tracking_1749584960797.png',
  '/attached_assets/Membership-hero-image_1749589356481.png',
  '/attached_assets/Container-Guide_1752776996742.png',
  '/attached_assets/Container-Leasing_1749330394138.png',
  '/attached_assets/Container-Storage_1749493321153.png',
  '/attached_assets/Container-Tracking_1749330535652.png',
  '/attached_assets/Container-Modifications_1749498610110.png',
  '/attached_assets/Container-Transport_1749330467948.png'
];

// Additional hero images used across service pages
export const SERVICE_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
];

import { imageCache } from './imageCache';
import { heroImageOptimizer } from './heroImageOptimizer';
import { serviceWorkerManager } from './serviceWorkerManager';

export const preloadCriticalImages = () => {
  if (typeof window === 'undefined') return;

  // Enhanced preloading with multiple strategies
  const allCriticalImages = [...CRITICAL_HERO_IMAGES, ...SERVICE_HERO_IMAGES];
  
  // Strategy 0: Service Worker for aggressive caching
  serviceWorkerManager.registerHeroCacheWorker();
  
  // Strategy 1: Browser native preload with optimized URLs
  allCriticalImages.forEach((src, index) => {
    const optimizedSrc = heroImageOptimizer.getOptimalImageSrc(src);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimizedSrc;
    link.fetchPriority = index < 2 ? 'high' : 'auto'; // Highest priority for first 2 images
    link.crossOrigin = 'anonymous';
    
    // Add to head immediately for faster DNS resolution
    document.head.appendChild(link);
  });

  // Strategy 2: DNS prefetch for external domains
  const dnsLink = document.createElement('link');
  dnsLink.rel = 'dns-prefetch';
  dnsLink.href = 'https://images.unsplash.com';
  document.head.appendChild(dnsLink);

  // Strategy 3: Preconnect for faster external requests
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://images.unsplash.com';
  preconnect.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect);

  // Strategy 4: Advanced batch preloading with optimization
  heroImageOptimizer.batchPreloadHeroImages(allCriticalImages);
  
  // Strategy 5: Fallback cache system for compatibility
  imageCache.preloadImages(CRITICAL_HERO_IMAGES, true);
  
  // Log optimization status
  console.log('🖼️ Hero Image Format Support:', heroImageOptimizer.getFormatSupport());
  console.log('🚀 Service Worker Support:', serviceWorkerManager.isSupported());
};

export const createImagePreloader = (imageSources: string[]) => {
  return imageCache.preloadImages(imageSources);
};
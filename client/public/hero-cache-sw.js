// Service Worker for aggressive hero image caching
const HERO_CACHE_NAME = 'gce-hero-images-v1';
const HERO_IMAGES = [
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

// Install event - cache critical hero images immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(HERO_CACHE_NAME)
      .then((cache) => {
        console.log('🚀 Caching critical hero images...');
        return cache.addAll(HERO_IMAGES);
      })
      .then(() => {
        // Force activation
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('gce-hero-images-') && cacheName !== HERO_CACHE_NAME) {
            console.log('🧹 Cleaning old hero image cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve hero images from cache with network fallback
self.addEventListener('fetch', (event) => {
  // Only handle hero image requests
  const url = event.request.url;
  const isHeroImage = HERO_IMAGES.some(heroImg => url.includes(heroImg.replace('%20', ' '))) ||
                      url.includes('images.unsplash.com');
  
  if (isHeroImage && event.request.method === 'GET') {
    event.respondWith(
      caches.open(HERO_CACHE_NAME)
        .then((cache) => {
          return cache.match(event.request)
            .then((response) => {
              if (response) {
                // Serve from cache immediately
                console.log('⚡ Serving hero image from cache:', url);
                return response;
              }
              
              // Fetch from network and cache
              return fetch(event.request)
                .then((networkResponse) => {
                  // Cache the response for future use
                  if (networkResponse.ok) {
                    cache.put(event.request, networkResponse.clone());
                    console.log('📥 Cached new hero image:', url);
                  }
                  return networkResponse;
                })
                .catch((error) => {
                  console.warn('❌ Failed to fetch hero image:', url, error);
                  throw error;
                });
            });
        })
    );
  }
});

// Message event for manual cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_HERO_CACHE') {
    caches.delete(HERO_CACHE_NAME)
      .then(() => {
        event.ports[0].postMessage({ success: true });
      });
  }
});
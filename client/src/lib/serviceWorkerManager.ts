// Service Worker Manager for Hero Image Caching
export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  async registerHeroCacheWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/hero-cache-sw.js', {
        scope: '/'
      });

      console.log('🎯 Hero cache service worker registered successfully');

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 New hero cache service worker available');
            }
          });
        }
      });

    } catch (error) {
      console.warn('Hero cache service worker registration failed:', error);
    }
  }

  async clearHeroCache(): Promise<boolean> {
    if (!this.registration || !this.registration.active) {
      return false;
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success);
      };

      this.registration!.active!.postMessage(
        { type: 'CLEAR_HERO_CACHE' },
        [messageChannel.port2]
      );
    });
  }

  isSupported(): boolean {
    return 'serviceWorker' in navigator;
  }
}

export const serviceWorkerManager = ServiceWorkerManager.getInstance();
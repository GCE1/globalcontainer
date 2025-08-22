import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { getSEOConfig, updatePageSEO, type SEOConfig } from '@/lib/seo';

export function useSEO(customConfig?: Partial<SEOConfig>) {
  const [location] = useLocation();

  useEffect(() => {
    const baseConfig = getSEOConfig(location);
    const finalConfig = customConfig ? { ...baseConfig, ...customConfig } : baseConfig;
    
    updatePageSEO(finalConfig, location);
    
    // Add performance timing
    if (window.performance && window.performance.mark) {
      window.performance.mark('seo-updated');
    }
  }, [location, customConfig]);
}

export function useStructuredData(data: object) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
}
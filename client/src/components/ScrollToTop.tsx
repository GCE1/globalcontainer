import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Immediately scroll to top when location changes
    window.scrollTo(0, 0);
    
    // Also ensure document body scroll is reset
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Reset any potential scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, [location]);

  return null;
}
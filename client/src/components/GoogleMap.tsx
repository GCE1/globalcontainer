import { useEffect, useRef } from 'react';

interface GoogleMapProps {
  apiKey: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  markers?: Array<{
    lat: number;
    lng: number;
    title?: string;
    info?: string;
  }>;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function GoogleMap({ 
  apiKey, 
  center, 
  zoom = 15, 
  markers = [], 
  className = "w-full h-full" 
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!apiKey) {
      console.error('Google Maps API key is required');
      return;
    }

    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      // Set up callback
      window.initMap = initializeMap;
      script.onload = initializeMap;
      
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      // Create map
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "on" }]
          }
        ]
      });

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add markers
      markers.forEach(markerData => {
        const marker = new window.google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map: mapInstanceRef.current,
          title: markerData.title || 'Location',
          animation: window.google.maps.Animation.DROP
        });

        markersRef.current.push(marker);

        // Add info window if info is provided
        if (markerData.info) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="padding: 10px; max-width: 200px;">
              <h3 style="margin: 0 0 5px 0; color: #1f2937; font-size: 14px; font-weight: bold;">
                ${markerData.title || 'Location'}
              </h3>
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                ${markerData.info}
              </p>
            </div>`
          });

          marker.addListener('click', () => {
            infoWindow.open(mapInstanceRef.current, marker);
          });
        }
      });
    };

    loadGoogleMaps();

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, [apiKey, center, zoom, markers]);

  return (
    <div 
      ref={mapRef} 
      className={className}
      style={{ minHeight: '200px' }}
    />
  );
}
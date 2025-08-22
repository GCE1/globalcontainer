import { useEffect, useRef } from 'react';

interface NearestDepotMapProps {
  userLocation: { latitude: number; longitude: number };
  depotLocation: { latitude: number; longitude: number; name: string; city: string };
  distance: number;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export default function NearestDepotMap({ userLocation, depotLocation, distance }: NearestDepotMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Try to get API key from environment first, then fallback to server
      let apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      console.log('Google Maps API Key status (environment):', {
        exists: !!apiKey,
        length: apiKey?.length || 0,
        env: import.meta.env.MODE
      });
      
      // If not found in environment, try to fetch from server
      if (!apiKey) {
        try {
          console.log('Fetching Google Maps API key from server...');
          const response = await fetch('/api/google-maps-config');
          if (response.ok) {
            const config = await response.json();
            apiKey = config.apiKey;
            console.log('Successfully fetched API key from server:', {
              exists: !!apiKey,
              length: apiKey?.length || 0
            });
          } else {
            console.error('Failed to fetch Google Maps config from server:', response.status);
          }
        } catch (error) {
          console.error('Error fetching Google Maps config:', error);
        }
      }
      
      if (!apiKey) {
        console.error('Google Maps API key not found in environment or server');
        // Display enhanced error message with depot information
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; color: #374151; font-family: Arial, sans-serif;">
              <div style="text-align: center; padding: 20px;">
                <div style="margin-bottom: 16px;">
                  <svg width="48" height="48" style="margin: 0 auto; color: #6b7280;" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">Depot Location</h4>
                <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 500; color: #1f2937;">${depotLocation.name}</p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">${depotLocation.city}</p>
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #059669;">${distance.toFixed(1)} miles away</p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">Interactive map loading...</p>
              </div>
            </div>
          `;
        }
        return;
      }
      
      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      
      script.onerror = (error) => {
        console.error('Failed to load Google Maps API:', error);
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background-color: #f3f4f6; color: #6b7280; font-family: Arial, sans-serif;">
              <div style="text-align: center;">
                <p style="margin: 0; font-size: 16px;">Map temporarily unavailable</p>
                <p style="margin: 4px 0 0 0; font-size: 14px;">Location: ${depotLocation.name}, ${depotLocation.city}</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #9ca3af;">Distance: ${distance.toFixed(1)} miles</p>
              </div>
            </div>
          `;
        }
      };
      
      window.initGoogleMaps = initializeMap;
      script.onload = initializeMap;
      
      console.log('Loading Google Maps API with key:', apiKey.substring(0, 10) + '...');
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) {
        console.error('Map container not found');
        return;
      }
      
      if (!window.google) {
        console.error('Google Maps API not loaded');
        return;
      }
      
      // Validate coordinates
      if (!userLocation || !depotLocation || 
          typeof userLocation.latitude !== 'number' || 
          typeof userLocation.longitude !== 'number' ||
          typeof depotLocation.latitude !== 'number' || 
          typeof depotLocation.longitude !== 'number' ||
          isNaN(userLocation.latitude) || isNaN(userLocation.longitude) ||
          isNaN(depotLocation.latitude) || isNaN(depotLocation.longitude)) {
        console.error('Invalid coordinates for map display:', { userLocation, depotLocation });
        return;
      }
      
      console.log('Initializing Google Maps with:', { userLocation, depotLocation, distance });

      // Center map between user location and depot
      const centerLat = (userLocation.latitude + depotLocation.latitude) / 2;
      const centerLng = (userLocation.longitude + depotLocation.longitude) / 2;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: 6,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // User location marker (blue)
      new window.google.maps.Marker({
        position: { lat: userLocation.latitude, lng: userLocation.longitude },
        map: map,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24),
          anchor: new window.google.maps.Point(12, 12)
        }
      });

      // Depot location marker (red)
      const depotMarker = new window.google.maps.Marker({
        position: { lat: depotLocation.latitude, lng: depotLocation.longitude },
        map: map,
        title: `${depotLocation.name} - ${depotLocation.city}`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#DC2626"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32)
        }
      });

      // Info window for depot
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #001937; font-size: 16px;">${depotLocation.name}</h3>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${depotLocation.city}</p>
            <p style="margin: 0; color: #333; font-size: 14px; font-weight: bold;">${distance.toFixed(1)} miles away</p>
          </div>
        `
      });

      depotMarker.addListener('click', () => {
        infoWindow.open(map, depotMarker);
      });

      // Auto-open info window
      setTimeout(() => {
        infoWindow.open(map, depotMarker);
      }, 500);

      // Draw line between locations
      const flightPath = new window.google.maps.Polyline({
        path: [
          { lat: userLocation.latitude, lng: userLocation.longitude },
          { lat: depotLocation.latitude, lng: depotLocation.longitude }
        ],
        geodesic: true,
        strokeColor: '#001937',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        icons: [{
          icon: {
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 3,
            fillColor: '#001937',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: 'white'
          },
          offset: '50%'
        }]
      });

      flightPath.setMap(map);

      // Fit map to show both markers
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: userLocation.latitude, lng: userLocation.longitude });
      bounds.extend({ lat: depotLocation.latitude, lng: depotLocation.longitude });
      map.fitBounds(bounds);

      // Ensure minimum zoom level
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 10) map.setZoom(10);
        window.google.maps.event.removeListener(listener);
      });
    };

    loadGoogleMaps();

    return () => {
      if (mapInstanceRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(mapInstanceRef.current);
      }
    };
  }, [userLocation, depotLocation, distance]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-[#001937] mb-3">
        Nearest Depot Location
      </h3>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-80"
          style={{ minHeight: '320px' }}
        />
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-[#001937]">{depotLocation.name}</h4>
              <p className="text-sm text-gray-600">{depotLocation.city}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#001937]">{distance.toFixed(1)} miles</p>
              <p className="text-sm text-gray-600">Distance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
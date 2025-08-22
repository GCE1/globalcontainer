// Google Maps JavaScript API integration for distance calculations
let googleMapsLoaded = false;
let loadingPromise: Promise<void> | null = null;

// Load Google Maps JavaScript API
export const loadGoogleMaps = (): Promise<void> => {
  if (googleMapsLoaded) {
    return Promise.resolve();
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = new Promise((resolve, reject) => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      googleMapsLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      googleMapsLoaded = true;
      resolve();
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API'));
    };
    
    document.head.appendChild(script);
  });

  return loadingPromise;
};

// Calculate distance between two coordinates using Google Maps API
export const calculateDistance = async (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): Promise<number> => {
  await loadGoogleMaps();
  
  const origin = new google.maps.LatLng(lat1, lng1);
  const destination = new google.maps.LatLng(lat2, lng2);
  
  // Use Google Maps geometry library for accurate distance calculation
  const distance = google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
  
  // Convert from meters to miles
  return distance * 0.000621371;
};

// Get user's current location using browser geolocation
export const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    );
  });
};

// Geocode an address or postal code to coordinates
export const geocodeAddress = async (address: string): Promise<{ latitude: number; longitude: number; formattedAddress: string }> => {
  await loadGoogleMaps();
  
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          latitude: location.lat(),
          longitude: location.lng(),
          formattedAddress: results[0].formatted_address
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};

// Declare global types for Google Maps
declare global {
  interface Window {
    google: any;
  }
}
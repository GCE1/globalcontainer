import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';

interface GeolocationSearchParams {
  latitude: number;
  longitude: number;
  radiusMiles?: number;
  types?: string[];
  conditions?: string[];
  priceMin?: string;
  priceMax?: string;
  city?: string;
  postalCode?: string;
}

interface GeolocationSearchResult {
  success: boolean;
  containers: any[];
  userLocation: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    source: string;
  };
  totalFound: number;
  searchRadius: number;
  source: string;
}

export const useGeolocationSearch = () => {
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user's current location using browser geolocation
  const getCurrentLocation = useCallback((): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      setIsLocationLoading(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocationLoading(false);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setIsLocationLoading(false);
          let errorMessage = 'Failed to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          setLocationError(errorMessage);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }, []);

  // Search containers using geolocation
  const searchMutation = useMutation({
    mutationFn: async (params: GeolocationSearchParams): Promise<GeolocationSearchResult> => {
      const response = await fetch('/api/containers/geolocation-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
  });

  // Search containers near current location
  const searchNearMe = useCallback(async (searchFilters: Omit<GeolocationSearchParams, 'latitude' | 'longitude'> = {}) => {
    try {
      const location = await getCurrentLocation();
      console.log('User location detected:', location);
      
      return searchMutation.mutateAsync({
        ...location,
        radiusMiles: 2000, // Expanded search radius for international depot access
        ...searchFilters,
      });
    } catch (error) {
      throw error;
    }
  }, [getCurrentLocation, searchMutation]);

  // Search containers at specific location
  const searchAtLocation = useCallback((params: GeolocationSearchParams) => {
    return searchMutation.mutateAsync(params);
  }, [searchMutation]);

  return {
    // State
    isLocationLoading,
    locationError,
    isSearching: searchMutation.isPending,
    searchError: searchMutation.error,
    searchResults: searchMutation.data,
    
    // Actions
    getCurrentLocation,
    searchNearMe,
    searchAtLocation,
    resetSearch: searchMutation.reset,
  };
};
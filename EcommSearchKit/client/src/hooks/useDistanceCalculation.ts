import { useState, useCallback } from 'react';
import { loadGoogleMaps, calculateDistance, geocodeAddress, getUserLocation } from '@/lib/googleMaps';

interface ContainerWithDistance {
  id: number;
  sku: string;
  type: string;
  condition: string;
  quantity: number | null;
  price: string;
  depot_name: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  distance?: number;
  formattedDistance?: string;
}

interface LocationInfo {
  latitude: number;
  longitude: number;
  formattedAddress?: string;
}

export const useDistanceCalculation = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate distances for containers from user location
  const calculateContainerDistances = useCallback(async (
    containers: any[],
    userLat: number,
    userLng: number
  ): Promise<ContainerWithDistance[]> => {
    setIsCalculating(true);
    setError(null);

    try {
      await loadGoogleMaps();

      const containersWithDistance = await Promise.all(
        containers.map(async (container) => {
          try {
            const distance = await calculateDistance(
              userLat,
              userLng,
              container.latitude,
              container.longitude
            );

            return {
              ...container,
              distance,
              formattedDistance: `${Math.round(distance)} miles`
            };
          } catch (distanceError) {
            console.warn(`Failed to calculate distance for container ${container.sku}:`, distanceError);
            return {
              ...container,
              distance: undefined,
              formattedDistance: 'Distance unavailable'
            };
          }
        })
      );

      // Sort by distance (nearest first)
      return containersWithDistance.sort((a, b) => {
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });

    } catch (err: any) {
      setError(`Failed to calculate distances: ${err.message}`);
      return containers.map(container => ({
        ...container,
        distance: undefined,
        formattedDistance: 'Distance unavailable'
      }));
    } finally {
      setIsCalculating(false);
    }
  }, []);

  // Get user's current location
  const getCurrentLocation = useCallback(async (): Promise<LocationInfo | null> => {
    setIsCalculating(true);
    setError(null);

    try {
      const location = await getUserLocation();
      setUserLocation(location);
      return location;
    } catch (err: any) {
      setError(`Failed to get location: ${err.message}`);
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, []);

  // Geocode an address to get coordinates
  const geocodeLocation = useCallback(async (address: string): Promise<LocationInfo | null> => {
    setIsCalculating(true);
    setError(null);

    try {
      const result = await geocodeAddress(address);
      const location = {
        latitude: result.latitude,
        longitude: result.longitude,
        formattedAddress: result.formattedAddress
      };
      setUserLocation(location);
      return location;
    } catch (err: any) {
      setError(`Failed to geocode address: ${err.message}`);
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, []);

  return {
    isCalculating,
    userLocation,
    error,
    calculateContainerDistances,
    getCurrentLocation,
    geocodeLocation,
    clearError: () => setError(null)
  };
};
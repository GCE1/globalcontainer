import { useQuery } from '@tanstack/react-query';

export interface DepotLocation {
  id: number;
  country: string;
  city: string;
  code: string;
  depot_name: string;
  address: string;
  latitude: number;
  longitude: number;
  services_offered: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DepotLocationsResponse {
  success: boolean;
  depots: DepotLocation[];
  region?: string;
}

export function useDepotLocations(region?: string) {
  const endpoint = region ? `/api/depot-locations/region/${region}` : '/api/depot-locations';
  
  return useQuery<DepotLocationsResponse>({
    queryKey: ['depot-locations', region],
    queryFn: async () => {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch depot locations');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });
}
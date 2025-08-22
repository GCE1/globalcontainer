import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Terminal49TrackingResult {
  success: boolean;
  shipments?: any[];
  containers?: any[];
  message?: string;
}

export interface Terminal49Shipment {
  id: string;
  attributes: {
    ref_numbers: string[];
    shipping_line_scac: string;
    shipping_line_name: string;
    port_of_lading_name: string;
    port_of_discharge_name: string;
    pod_vessel_name?: string;
    pol_vessel_name?: string;
    pod_voyage_number?: string;
    pol_voyage_number?: string;
    destination_name?: string;
    origin_name?: string;
    pol_eta_at?: string;
    pod_eta_at?: string;
    destination_eta_at?: string;
    pod_ata_at?: string;
    pol_ata_at?: string;
    created_at: string;
    updated_at: string;
  };
  relationships: {
    containers: {
      data: { id: string; type: string }[];
    };
  };
}

export interface Terminal49Container {
  id: string;
  attributes: {
    number: string;
    seal_number?: string;
    size: string;
    type: string;
    fees_at_pod_terminal?: number;
    holds_at_pod_terminal?: any[];
    pickup_lfd?: string;
    availability_known: boolean;
    available_for_pickup: boolean;
    available_for_pickup_at?: string;
    container_availability_status?: string;
    terminal_name?: string;
    terminal_firms_code?: string;
    created_at: string;
    updated_at: string;
  };
}

export interface Terminal49TransportEvent {
  id: string;
  attributes: {
    event: string;
    location: string;
    vessel?: string;
    voyage?: string;
    timestamp: string;
    timezone: string;
    status: 'actual' | 'estimated';
    created_at: string;
  };
}

// Hook for tracking containers by reference number
export const useTrackContainer = () => {
  return useMutation({
    mutationFn: async (referenceNumber: string): Promise<Terminal49TrackingResult> => {
      try {
        const response = await fetch('/api/terminal49/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ referenceNumber }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to track container: ${response.status} ${errorText}`);
        }

        return response.json();
      } catch (error) {
        console.error('Container tracking error:', error);
        throw error;
      }
    },
  });
};

// Hook for fetching all shipments
export const useShipments = (page?: number, perPage?: number) => {
  return useQuery({
    queryKey: ['terminal49', 'shipments', page, perPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (perPage) params.append('per_page', perPage.toString());
      
      const response = await fetch(`/api/terminal49/shipments?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch shipments');
      }
      return response.json() as Promise<{ success: boolean; data: any }>;
    },
    enabled: false // Don't auto-fetch, only when explicitly requested
  });
};

// Hook for fetching specific shipment details
export const useShipment = (shipmentId: string) => {
  return useQuery({
    queryKey: ['terminal49', 'shipments', shipmentId],
    queryFn: async () => {
      const response = await fetch(`/api/terminal49/shipments/${shipmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch shipment details');
      }
      return response.json() as Promise<{ success: boolean; data: any }>;
    },
    enabled: !!shipmentId
  });
};

// Hook for fetching container transport events
export const useContainerEvents = (containerId: string) => {
  return useQuery({
    queryKey: ['terminal49', 'containers', containerId, 'events'],
    queryFn: async () => {
      const response = await fetch(`/api/terminal49/containers/${containerId}/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch container events');
      }
      return response.json() as Promise<{ success: boolean; data: any }>;
    },
    enabled: !!containerId
  });
};

// Hook for creating tracking requests
export const useCreateTrackingRequest = () => {
  return useMutation({
    mutationFn: async (trackingData: {
      request_type: 'bill_of_lading' | 'booking_number' | 'container_number';
      request_number: string;
      scac?: string;
    }) => {
      return apiRequest('/api/terminal49/tracking-request', 'POST', trackingData);
    },
  });
};

// Hook for fetching tracking requests
export const useTrackingRequests = () => {
  return useQuery({
    queryKey: ['terminal49', 'tracking-requests'],
    queryFn: async () => {
      const response = await fetch('/api/terminal49/tracking-requests');
      if (!response.ok) {
        throw new Error('Failed to fetch tracking requests');
      }
      return response.json() as Promise<{ success: boolean; data: any }>;
    },
    enabled: false // Don't auto-fetch
  });
};
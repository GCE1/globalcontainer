import fetch from 'node-fetch';

export interface Terminal49TrackingRequest {
  request_type: 'bill_of_lading' | 'booking_number' | 'container';
  request_number: string;
  scac?: string; // Shipping line SCAC code
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

class Terminal49Service {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.terminal49.com/v2';

  constructor() {
    this.apiKey = process.env.TERMINAL49_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('TERMINAL49_API_KEY environment variable is required');
    }
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Authorization': `Token ${this.apiKey}`,
      'Content-Type': 'application/vnd.api+json',
      'Accept': 'application/vnd.api+json'
    };

    const config: any = {
      method,
      headers
    };

    if (body && method === 'POST') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Terminal49 API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Terminal49 API error (${response.status}): ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Terminal49 API request failed:', error);
      throw error;
    }
  }

  // Create a tracking request
  async createTrackingRequest(trackingData: Terminal49TrackingRequest) {
    const body = {
      data: {
        type: 'tracking_request',
        attributes: {
          request_type: trackingData.request_type,
          request_number: trackingData.request_number,
          ...(trackingData.scac && { scac: trackingData.scac })
        }
      }
    };

    return this.makeRequest('/tracking_requests', 'POST', body);
  }

  // Get tracking request status
  async getTrackingRequest(id: string) {
    return this.makeRequest(`/tracking_requests/${id}`);
  }

  // List all tracking requests
  async listTrackingRequests() {
    return this.makeRequest('/tracking_requests');
  }

  // List all shipments
  async listShipments(page?: number, perPage?: number) {
    let endpoint = '/shipments?include=containers';
    if (page) endpoint += `&page[number]=${page}`;
    if (perPage) endpoint += `&page[size]=${perPage}`;
    
    return this.makeRequest(endpoint);
  }

  // Get specific shipment
  async getShipment(id: string) {
    return this.makeRequest(`/shipments/${id}?include=containers`);
  }

  // List containers
  async listContainers(shipmentId?: string) {
    let endpoint = '/containers';
    if (shipmentId) {
      endpoint += `?filter[shipment_id]=${shipmentId}`;
    }
    return this.makeRequest(endpoint);
  }

  // Get container transport events
  async getContainerTransportEvents(containerId: string) {
    return this.makeRequest(`/containers/${containerId}/transport_events`);
  }

  // Get container raw events (includes estimated events)
  async getContainerRawEvents(containerId: string) {
    return this.makeRequest(`/containers/${containerId}/raw_events`);
  }

  // Search for shipments by reference number
  async searchByReference(referenceNumber: string): Promise<{
    success: boolean;
    shipments?: Terminal49Shipment[];
    containers?: Terminal49Container[];
    message?: string;
  }> {
    try {
      // First try to find existing shipments
      const shipmentsResponse = await this.listShipments() as { data: Terminal49Shipment[] };
      const shipments = shipmentsResponse.data || [];
      
      // Filter shipments by reference number
      const matchingShipments = shipments.filter((shipment: Terminal49Shipment) => 
        shipment.attributes.ref_numbers.some(ref => 
          ref.toLowerCase().includes(referenceNumber.toLowerCase())
        )
      );

      if (matchingShipments.length > 0) {
        // Get containers for matching shipments
        const containers: Terminal49Container[] = [];
        for (const shipment of matchingShipments) {
          if (shipment.relationships?.containers?.data) {
            for (const containerRef of shipment.relationships.containers.data) {
              try {
                const containerResponse = await this.makeRequest(`/containers/${containerRef.id}`) as { data: Terminal49Container };
                containers.push(containerResponse.data);
              } catch (error) {
                console.warn(`Could not fetch container ${containerRef.id}:`, error);
              }
            }
          }
        }

        return {
          success: true,
          shipments: matchingShipments,
          containers
        };
      }

      // If no existing shipments found, try to create a tracking request
      // Determine request type based on format
      let requestType: 'bill_of_lading' | 'booking_number' | 'container' = 'bill_of_lading';
      let scac: string | undefined;
      
      // Check if it's a container number (4 letters + 7 digits)
      if (/^[A-Z]{4}[0-9]{7}$/.test(referenceNumber.toUpperCase())) {
        requestType = 'container';
        // Extract SCAC from container number (first 4 characters)
        scac = referenceNumber.substring(0, 4).toUpperCase();
      } else if (referenceNumber.length <= 15 && /^[A-Z0-9]+$/.test(referenceNumber.toUpperCase())) {
        // Likely a booking number (alphanumeric, up to 15 chars)
        requestType = 'booking_number';
      }
      // Otherwise default to bill_of_lading

      // Try to create tracking request - first with SCAC if available, then without
      let trackingRequest;
      let finalMessage = '';
      
      if (scac) {
        try {
          trackingRequest = await this.createTrackingRequest({
            request_type: requestType,
            request_number: referenceNumber.toUpperCase(),
            scac
          });
          finalMessage = `Tracking request created for ${referenceNumber} with shipping line ${scac}. Terminal49 is now monitoring this ${requestType.replace('_', ' ')}.`;
        } catch (scacError: any) {
          // If SCAC is not recognized, try without SCAC
          if (scacError.message.includes('not recognized')) {
            console.log(`SCAC ${scac} not recognized, trying without SCAC...`);
            try {
              trackingRequest = await this.createTrackingRequest({
                request_type: requestType,
                request_number: referenceNumber.toUpperCase()
              });
              finalMessage = `Tracking request created for ${referenceNumber}. Note: Shipping line ${scac} not recognized in Terminal49 database, but tracking has been initiated.`;
            } catch (noScacError: any) {
              throw noScacError;
            }
          } else {
            throw scacError;
          }
        }
      } else {
        trackingRequest = await this.createTrackingRequest({
          request_type: requestType,
          request_number: referenceNumber.toUpperCase()
        });
        finalMessage = `Tracking request created for ${referenceNumber}. Terminal49 is now monitoring this ${requestType.replace('_', ' ')}.`;
      }

      return {
        success: true,
        message: finalMessage,
        trackingRequestId: trackingRequest?.data?.id
      };

    } catch (error: any) {
      console.error('Terminal49 search error:', error);
      
      // Provide more specific error messages based on the error type
      if (error.message && error.message.includes('not recognized') && error.message.includes('Scac')) {
        return {
          success: false,
          message: `Container ${referenceNumber} appears to be from a shipping line not currently supported by Terminal49's tracking database. While this container may be in transit, tracking data is not available through Terminal49's 160+ shipping line network. You may want to contact the shipping line directly for tracking information.`,
          error: 'unsupported_shipping_line'
        };
      } else if (error.message && error.message.includes('422')) {
        return {
          success: false,
          message: `Container ${referenceNumber} format is valid but not found in Terminal49's current tracking database. If this container is recently shipped or from a smaller shipping line, tracking data may not be available yet.`,
          error: 'container_not_found'
        };
      } else {
        return {
          success: false,
          message: `Unable to track ${referenceNumber}. This may be due to: (1) Container not yet in Terminal49's database, (2) Shipping line not supported by Terminal49, or (3) Invalid reference number format. For containers in transit on ocean vessels, tracking data should appear within 24-48 hours if the shipping line is supported.`
        };
      }
    }
  }
}

export const terminal49Service = new Terminal49Service();
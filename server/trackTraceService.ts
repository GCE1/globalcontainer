import { Request, Response } from 'express';

// Shipsgo API Configuration
const SHIPSGO_API_BASE = 'https://api.shipsgo.com/v2';
const SHIPSGO_API_KEY = process.env.SHIPSGO_API_KEY;

if (!SHIPSGO_API_KEY) {
  console.warn('SHIPSGO_API_KEY not found in environment variables');
}

export interface TrackingResult {
  containerNumber: string;
  status: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
    port?: string;
    terminal?: string;
  };
  destination: {
    address: string;
    port?: string;
    estimatedArrival: string;
  };
  route: {
    waypoints: Array<{
      location: string;
      timestamp: string;
      status: string;
      coordinates?: { lat: number; lng: number };
    }>;
    progress: number;
  };
  vessel?: {
    name: string;
    imo: string;
    flag: string;
  };
  alerts: Array<{
    type: 'delay' | 'deviation' | 'milestone' | 'security' | 'temperature';
    message: string;
    timestamp: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  sensorData?: {
    temperature?: number;
    humidity?: number;
    shock?: boolean;
    door?: 'closed' | 'open';
  };
  lastUpdate: string;
}

export interface AlertPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  webhookUrl?: string;
  alertTypes: Array<'delay' | 'deviation' | 'milestone' | 'security' | 'temperature'>;
  updateFrequency: 'realtime' | 'hourly' | 'daily';
}

// Comprehensive list of supported shipping carriers for track-trace connect
const SUPPORTED_SHIPPING_CARRIERS = {
  'msc': { name: 'MSC (Mediterranean Shipping Company)', code: 'MSCU', apiEndpoint: '/msc' },
  'maersk': { name: 'Maersk Line', code: 'MAEU', apiEndpoint: '/maersk' },
  'cma-cgm': { name: 'CMA CGM', code: 'CMAU', apiEndpoint: '/cma-cgm' },
  'cosco': { name: 'COSCO Shipping', code: 'COSU', apiEndpoint: '/cosco' },
  'hapag-lloyd': { name: 'Hapag-Lloyd', code: 'HLCU', apiEndpoint: '/hapag-lloyd' },
  'evergreen': { name: 'Evergreen Line', code: 'EGLV', apiEndpoint: '/evergreen' },
  'oocl': { name: 'OOCL (Orient Overseas Container Line)', code: 'OOLU', apiEndpoint: '/oocl' },
  'yang-ming': { name: 'Yang Ming Marine Transport', code: 'YMLU', apiEndpoint: '/yang-ming' },
  'pil': { name: 'Pacific International Lines', code: 'PILU', apiEndpoint: '/pil' },
  'mol': { name: 'Mitsui O.S.K. Lines', code: 'MOLU', apiEndpoint: '/mol' },
  'nyk': { name: 'NYK Line (Nippon Yusen)', code: 'NYKU', apiEndpoint: '/nyk' },
  'k-line': { name: 'Kawasaki Kisen Kaisha (K Line)', code: 'KKLU', apiEndpoint: '/k-line' },
  'zim': { name: 'ZIM Integrated Shipping Services', code: 'ZIMU', apiEndpoint: '/zim' },
  'hyundai': { name: 'Hyundai Merchant Marine', code: 'HMMU', apiEndpoint: '/hyundai' },
  'one': { name: 'Ocean Network Express (ONE)', code: 'ONEU', apiEndpoint: '/one' },
  'apl': { name: 'American President Lines', code: 'APLU', apiEndpoint: '/apl' },
  'matson': { name: 'Matson Navigation', code: 'MATU', apiEndpoint: '/matson' },
  'acl': { name: 'Atlantic Container Line', code: 'ACLU', apiEndpoint: '/acl' },
  'arkas': { name: 'Arkas Line', code: 'ARKU', apiEndpoint: '/arkas' },
  'sealand': { name: 'Sealand - A Maersk Company', code: 'SEAU', apiEndpoint: '/sealand' },
  'safmarine': { name: 'Safmarine', code: 'SAFU', apiEndpoint: '/safmarine' },
  'hamburg-sud': { name: 'Hamburg Süd', code: 'SUDU', apiEndpoint: '/hamburg-sud' },
  'alianca': { name: 'Aliança Navegação', code: 'ALIU', apiEndpoint: '/alianca' },
  'csav': { name: 'Compañía Sud Americana de Vapores', code: 'CSAV', apiEndpoint: '/csav' },
  'crowley': { name: 'Crowley Maritime', code: 'CRWU', apiEndpoint: '/crowley' },
  'tote': { name: 'TOTE Maritime', code: 'TOTU', apiEndpoint: '/tote' }
};

export class ShipsgoTrackingService {
  private apiBaseUrl: string;
  private apiKey: string;
  private supportedCarriers: typeof SUPPORTED_SHIPPING_CARRIERS;

  constructor() {
    this.apiBaseUrl = SHIPSGO_API_BASE;
    this.apiKey = SHIPSGO_API_KEY || '';
    this.supportedCarriers = SUPPORTED_SHIPPING_CARRIERS;
    
    if (!this.apiKey) {
      console.warn('Shipsgo API key not configured');
    } else {
      console.log('Shipsgo API initialized successfully');
    }
  }

  /**
   * Get list of all supported shipping carriers
   */
  getSupportedCarriers() {
    return Object.entries(this.supportedCarriers).map(([key, carrier]) => ({
      value: key,
      label: carrier.name,
      code: carrier.code
    }));
  }

  /**
   * Search for container using Shipsgo API
   */
  async searchContainer(trackingNumber: string, shippingLine?: string, searchType: string = 'container'): Promise<TrackingResult | null> {
    try {
      console.log(`Shipsgo tracking search: ${trackingNumber}, carrier: ${shippingLine}, type: ${searchType}`);
      
      if (!this.apiKey) {
        throw new Error('Shipsgo API key not configured');
      }

      // First, create a shipment in Shipsgo system
      const createResponse = await fetch(`${this.apiBaseUrl}/ocean/shipments`, {
        method: 'POST',
        headers: {
          'X-Shipsgo-User-Token': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          container_number: trackingNumber,
          shipping_line: shippingLine?.toUpperCase() || 'AUTO',
          email_address: 'tracking@globalcontainerexchange.com'
        })
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error(`Shipsgo create shipment error: ${createResponse.status} - ${errorText}`);
        
        // Handle specific error cases
        if (createResponse.status === 409 || createResponse.status === 422) {
          // Shipment already exists, try to find it
          return await this.findExistingShipment(trackingNumber);
        } else if (createResponse.status === 401) {
          // Invalid API token - provide helpful error message
          throw new Error('Invalid Shipsgo API credentials. Please verify your API token is activated and your account has sufficient credits.');
        } else if (createResponse.status === 402) {
          // Insufficient credits
          throw new Error('Insufficient Shipsgo credits. Please add credits to your account.');
        } else if (createResponse.status === 429) {
          // Rate limit exceeded
          throw new Error('Rate limit exceeded. Please try again in a few minutes.');
        }
        
        throw new Error(`Shipsgo API request failed: ${createResponse.status} - ${errorText}`);
      }

      const shipmentData = await createResponse.json();
      console.log('Shipsgo shipment created:', shipmentData.data?.id || 'SUCCESS');
      
      // Get detailed tracking information
      if (shipmentData.data?.id) {
        return await this.getShipmentDetails(shipmentData.data.id, trackingNumber);
      }
      
      return this.mapShipsgoResponseToTrackingResult(shipmentData.data, trackingNumber);
    } catch (error) {
      console.error('Shipsgo API error:', error);
      throw error;
    }
  }

  /**
   * Find existing shipment by container number
   */
  private async findExistingShipment(containerNumber: string): Promise<TrackingResult | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/ocean/shipments?filters[container_number]=eq:${containerNumber}`, {
        headers: {
          'X-Shipsgo-User-Token': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to find existing shipment: ${response.status}`);
      }

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        return await this.getShipmentDetails(data.data[0].id, containerNumber);
      }
      
      return null;
    } catch (error) {
      console.error('Error finding existing shipment:', error);
      return null;
    }
  }

  /**
   * Get detailed shipment information
   */
  private async getShipmentDetails(shipmentId: string, containerNumber: string): Promise<TrackingResult | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/ocean/shipments/${shipmentId}`, {
        headers: {
          'X-Shipsgo-User-Token': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get shipment details: ${response.status}`);
      }

      const data = await response.json();
      return this.mapShipsgoResponseToTrackingResult(data.data, containerNumber);
    } catch (error) {
      console.error('Error getting shipment details:', error);
      return null;
    }
  }

  /**
   * Map Shipsgo API response to our TrackingResult format
   */
  private mapShipsgoResponseToTrackingResult(data: any, trackingNumber: string): TrackingResult {
    const currentLocation = data.current_location || {};
    const destination = data.destination || {};
    const vessel = data.vessel || {};
    const movements = data.movements || [];

    return {
      containerNumber: trackingNumber,
      status: data.status || data.container_status || 'In Transit',
      currentLocation: {
        latitude: currentLocation.latitude || 0,
        longitude: currentLocation.longitude || 0,
        address: currentLocation.address || currentLocation.location || 'Unknown Location',
        port: currentLocation.port_code || currentLocation.port,
        terminal: currentLocation.terminal
      },
      destination: {
        address: destination.address || destination.location || 'Unknown Destination',
        port: destination.port_code || destination.port,
        estimatedArrival: destination.eta || destination.estimated_arrival || new Date().toISOString()
      },
      route: {
        waypoints: movements.map((movement: any) => ({
          location: movement.location || movement.terminal,
          timestamp: movement.actual_time || movement.estimated_time,
          status: movement.status || movement.event,
          coordinates: movement.coordinates ? { 
            lat: movement.coordinates.latitude, 
            lng: movement.coordinates.longitude 
          } : undefined
        })),
        progress: this.calculateProgress(movements)
      },
      vessel: vessel.name ? {
        name: vessel.name,
        imo: vessel.imo || vessel.imo_number,
        flag: vessel.flag || vessel.flag_country
      } : undefined,
      alerts: this.generateAlerts(data),
      sensorData: data.sensor_data,
      lastUpdate: data.updated_at || data.last_update || new Date().toISOString()
    };
  }

  /**
   * Calculate route progress percentage
   */
  private calculateProgress(movements: any[]): number {
    if (!movements || movements.length === 0) return 0;
    
    const completedMovements = movements.filter(m => m.actual_time);
    return Math.round((completedMovements.length / movements.length) * 100);
  }

  /**
   * Generate alerts from shipment data
   */
  private generateAlerts(data: any): Array<{
    type: 'delay' | 'deviation' | 'milestone' | 'security' | 'temperature';
    message: string;
    timestamp: string;
    priority: 'low' | 'medium' | 'high';
  }> {
    const alerts = [];
    
    // Check for delays
    if (data.is_delayed) {
      alerts.push({
        type: 'delay' as const,
        message: `Container is delayed. ${data.delay_reason || 'Reason unknown'}`,
        timestamp: data.delay_detected_at || new Date().toISOString(),
        priority: 'high' as const
      });
    }

    // Check for milestone updates
    if (data.latest_movement) {
      alerts.push({
        type: 'milestone' as const,
        message: `Container ${data.latest_movement.event} at ${data.latest_movement.location}`,
        timestamp: data.latest_movement.actual_time || new Date().toISOString(),
        priority: 'medium' as const
      });
    }

    return alerts;
  }

  /**
   * Setup real-time alerts for container tracking via Shipsgo
   */
  async setupAlerts(containerNumber: string, preferences: AlertPreferences, userEmail: string): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.log('Shipsgo API key not configured, alerts setup failed');
        return false;
      }

      const response = await fetch(`${this.apiBaseUrl}/ocean/shipments/${containerNumber}/followers`, {
        method: 'POST',
        headers: {
          'X-Shipsgo-User-Token': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Shipsgo alert setup error:', error);
      return false;
    }
  }

  /**
   * Get detailed route history for container via Shipsgo
   */
  async getRouteHistory(containerNumber: string): Promise<TrackingResult['route'] | null> {
    try {
      if (!this.apiKey) {
        console.log('Shipsgo API key not configured');
        return null;
      }

      const response = await fetch(`${this.apiBaseUrl}/api/tracking/route/${containerNumber}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Shipsgo route API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.route;
    } catch (error) {
      console.error('Shipsgo route history error:', error);
      return null;
    }
  }

  /**
   * Get live updates for container via Shipsgo
   */
  async getLiveUpdates(containerNumber: string): Promise<Partial<TrackingResult> | null> {
    try {
      if (!this.apiKey) {
        console.log('Shipsgo API key not configured');
        return null;
      }

      const response = await fetch(`${this.apiBaseUrl}/ocean/shipments?filters[container_number]=eq:${containerNumber}`, {
        headers: {
          'X-Shipsgo-User-Token': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Shipsgo live updates request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.mapShipsgoResponseToTrackingResult(data, containerNumber);
    } catch (error) {
      console.error('Shipsgo live updates error:', error);
      return null;
    }
  }

  /**
   * Map external API response to our TrackingResult interface
   */
  private mapApiResponseToTrackingResult(apiData: any): TrackingResult {
    // This will be customized based on the actual track-trace API response format
    return {
      containerNumber: apiData.container_id || apiData.containerNumber,
      status: apiData.status,
      currentLocation: {
        latitude: apiData.current_location?.lat || 0,
        longitude: apiData.current_location?.lng || 0,
        address: apiData.current_location?.address || '',
        port: apiData.current_location?.port,
        terminal: apiData.current_location?.terminal
      },
      destination: {
        address: apiData.destination?.address || '',
        port: apiData.destination?.port,
        estimatedArrival: apiData.eta || apiData.estimated_arrival
      },
      route: {
        waypoints: apiData.waypoints || [],
        progress: apiData.progress || 0
      },
      vessel: apiData.vessel,
      alerts: apiData.alerts || [],
      sensorData: apiData.sensors,
      lastUpdate: apiData.last_updated || new Date().toISOString()
    };
  }

  /**
   * Enhanced demo tracking data with shipping line awareness for development testing
   */
  private getEnhancedDemoTrackingData(containerNumber: string, shippingLine?: string): TrackingResult {
    const carrierInfo = shippingLine && this.supportedCarriers[shippingLine as keyof typeof SUPPORTED_SHIPPING_CARRIERS] 
      ? this.supportedCarriers[shippingLine as keyof typeof SUPPORTED_SHIPPING_CARRIERS] 
      : { name: 'Auto-Detected Carrier', code: 'AUTO', apiEndpoint: '/auto' };

    const vesselNames = {
      'msc': 'MSC MEDITERRANEAN',
      'maersk': 'MAERSK ESSEX', 
      'cma-cgm': 'CMA CGM MARCO POLO',
      'cosco': 'COSCO SHANGHAI',
      'hapag-lloyd': 'HAPAG LLOYD BERLIN',
      'evergreen': 'EVER GOLDEN',
      'oocl': 'OOCL HONG KONG',
      'yang-ming': 'YM EXCELLENCE',
      'one': 'ONE COLUMBA',
      'apl': 'APL HOLLAND',
      'zim': 'ZIM BARCELONA',
      'hyundai': 'HYUNDAI TRUST'
    };

    const selectedVessel = shippingLine && vesselNames[shippingLine as keyof typeof vesselNames]
      ? vesselNames[shippingLine as keyof typeof vesselNames]
      : 'GLOBAL TRADER';

    const ports = {
      'maersk': { origin: 'Port of Rotterdam, Netherlands', destination: 'Port of Los Angeles, CA, USA' },
      'msc': { origin: 'Port of Genoa, Italy', destination: 'Port of New York, NY, USA' },
      'cma-cgm': { origin: 'Port of Le Havre, France', destination: 'Port of Long Beach, CA, USA' },
      'cosco': { origin: 'Port of Shanghai, China', destination: 'Port of Seattle, WA, USA' },
      'default': { origin: 'Port of Los Angeles, CA, USA', destination: 'Port of New York, NY, USA' }
    };

    const selectedPorts = ports[shippingLine as keyof typeof ports] || ports.default;

    return {
      containerNumber,
      status: 'In Transit',
      currentLocation: {
        latitude: 33.7701,
        longitude: -118.1937,
        address: selectedPorts.origin,
        port: shippingLine === 'maersk' ? 'NLRTM' : 'USLAX',
        terminal: `${carrierInfo.name} Terminal`
      },
      destination: {
        address: selectedPorts.destination,
        port: 'USNYC',
        estimatedArrival: '2025-08-05T10:00:00Z'
      },
      route: {
        waypoints: [
          {
            location: `Origin Depot - ${selectedPorts.origin}`,
            timestamp: '2025-07-25T08:00:00Z',
            status: 'Container Loaded',
            coordinates: { lat: 33.7701, lng: -118.1937 }
          },
          {
            location: `${carrierInfo.name} Terminal`,
            timestamp: '2025-07-26T14:30:00Z',
            status: 'Port Operations',
            coordinates: { lat: 34.0522, lng: -118.2437 }
          },
          {
            location: `Vessel ${selectedVessel} - Atlantic Ocean`,
            timestamp: '2025-07-27T09:15:00Z',
            status: 'Departed Port',
            coordinates: { lat: 40.7128, lng: -50.0000 }
          }
        ],
        progress: 45
      },
      vessel: {
        name: selectedVessel,
        imo: '9123456',
        flag: shippingLine === 'maersk' ? 'Denmark' : 'Panama'
      },
      alerts: [
        {
          type: 'milestone',
          message: `Container has departed ${selectedPorts.origin} via ${carrierInfo.name}`,
          timestamp: '2025-07-27T09:15:00Z',
          priority: 'medium'
        }
      ],
      sensorData: {
        temperature: 22.5,
        humidity: 65,
        shock: false,
        door: 'closed'
      },
      lastUpdate: new Date().toISOString()
    };
  }

  /**
   * Demo tracking data structure for development
   */
  private getDemoTrackingData(containerNumber: string): TrackingResult {
    return {
      containerNumber,
      status: 'In Transit',
      currentLocation: {
        latitude: 33.7701,
        longitude: -118.1937,
        address: 'Port of Los Angeles, CA, USA',
        port: 'USLAX',
        terminal: 'APM Terminal'
      },
      destination: {
        address: 'Port of New York, NY, USA',
        port: 'USNYC',
        estimatedArrival: '2025-08-05T10:00:00Z'
      },
      route: {
        waypoints: [
          {
            location: 'Origin Depot - Los Angeles, CA',
            timestamp: '2025-07-25T08:00:00Z',
            status: 'Container Loaded',
            coordinates: { lat: 33.7701, lng: -118.1937 }
          },
          {
            location: 'Port of Los Angeles Terminal',
            timestamp: '2025-07-26T14:30:00Z',
            status: 'Port Operations',
            coordinates: { lat: 33.7362, lng: -118.2649 }
          },
          {
            location: 'Vessel MSC MARIA - Pacific Ocean',
            timestamp: '2025-07-27T09:15:00Z',
            status: 'Departed Port',
            coordinates: { lat: 34.0522, lng: -118.2437 }
          }
        ],
        progress: 35
      },
      vessel: {
        name: 'MSC MARIA',
        imo: '9123456',
        flag: 'Panama'
      },
      alerts: [
        {
          type: 'milestone',
          message: 'Container has departed Los Angeles port',
          timestamp: '2025-07-27T09:15:00Z',
          priority: 'medium'
        }
      ],
      sensorData: {
        temperature: 22.5,
        humidity: 65,
        shock: false,
        door: 'closed'
      },
      lastUpdate: new Date().toISOString()
    };
  }

  private getDemoRouteHistory(containerNumber: string) {
    return {
      waypoints: [
        {
          location: 'Shenzhen Depot, China',
          timestamp: '2025-07-20T06:00:00Z',
          status: 'Empty Pickup',
          coordinates: { lat: 22.5431, lng: 114.0579 }
        },
        {
          location: 'Shenzhen Port, China',
          timestamp: '2025-07-21T10:30:00Z',
          status: 'Loaded',
          coordinates: { lat: 22.4908, lng: 113.9172 }
        },
        {
          location: 'Port of Los Angeles, CA',
          timestamp: '2025-07-26T14:30:00Z',
          status: 'Discharged',
          coordinates: { lat: 33.7362, lng: -118.2649 }
        }
      ],
      progress: 35
    };
  }

  private getDemoLiveUpdate(containerNumber: string) {
    return {
      currentLocation: {
        latitude: 33.7701 + (Math.random() - 0.5) * 0.01,
        longitude: -118.1937 + (Math.random() - 0.5) * 0.01,
        address: 'Pacific Ocean - En Route',
        port: 'At Sea'
      },
      sensorData: {
        temperature: 22.5 + (Math.random() - 0.5) * 2,
        humidity: 65 + (Math.random() - 0.5) * 10,
        shock: false,
        door: 'closed' as 'closed' | 'open'
      },
      lastUpdate: new Date().toISOString()
    };
  }
}

export const trackTraceService = new ShipsgoTrackingService();
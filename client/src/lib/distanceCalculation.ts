// Distance calculation utility for shipping cost calculation
// Adds $7.00 per mile surcharge for deliveries beyond 50 miles

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface DistanceCalculationResult {
  distanceMiles: number;
  surcharge: number;
  totalDistanceCost: number;
}

// Calculate distance between two points using Google Maps Distance Matrix API
export async function calculateShippingDistance(
  depotLocation: LocationCoordinates,
  customerAddress: string
): Promise<DistanceCalculationResult> {
  try {
    // If Google Maps is not available, fall back to Haversine formula
    if (!window.google || !window.google.maps) {
      console.warn('Google Maps API not available, using fallback calculation');
      return calculateFallbackDistance(depotLocation, customerAddress);
    }

    const service = new window.google.maps.DistanceMatrixService();
    
    return new Promise((resolve, reject) => {
      service.getDistanceMatrix({
        origins: [new window.google.maps.LatLng(depotLocation.latitude, depotLocation.longitude)],
        destinations: [customerAddress],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false,
      }, (response: any, status: any) => {
        if (status === window.google.maps.DistanceMatrixStatus.OK && response) {
          const element = response.rows[0].elements[0];
          
          if (element.status === 'OK') {
            const distanceMiles = element.distance.value * 0.000621371; // Convert meters to miles
            const surcharge = distanceMiles > 50 ? (distanceMiles - 50) * 7 : 0;
            
            resolve({
              distanceMiles: Math.round(distanceMiles * 100) / 100, // Round to 2 decimal places
              surcharge: Math.round(surcharge * 100) / 100,
              totalDistanceCost: Math.round(surcharge * 100) / 100
            });
          } else {
            console.warn('Distance calculation failed:', element.status);
            resolve(calculateFallbackDistance(depotLocation, customerAddress));
          }
        } else {
          console.warn('Distance Matrix API failed:', status);
          // Use fallback instead of rejecting
          resolve(calculateFallbackDistance(depotLocation, customerAddress));
        }
      });
    });
  } catch (error) {
    console.error('Error calculating distance:', error);
    return calculateFallbackDistance(depotLocation, customerAddress);
  }
}

// Enhanced fallback distance calculation using server-side geocoding
async function calculateFallbackDistance(
  depotLocation: LocationCoordinates,
  customerAddress: string
): Promise<DistanceCalculationResult> {
  try {
    console.log('🔄 Using enhanced fallback distance calculation for:', customerAddress);
    
    // First try server-side geocoding for any postal/zip code
    let customerCoords: LocationCoordinates | null = null;
    
    try {
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: customerAddress })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.coordinates) {
          customerCoords = data.coordinates;
          console.log('🌍 Server geocoding successful:', customerCoords);
        }
      }
    } catch (error) {
      console.warn('Server geocoding failed, using local fallback:', error);
    }
    
    // If server geocoding failed, use known coordinates or browser geocoding
    if (!customerCoords) {
      customerCoords = await getKnownOrBrowserGeocode(customerAddress);
    }
    
    if (!customerCoords) {
      console.warn('❌ Could not geocode customer address:', customerAddress);
      return { distanceMiles: 25, surcharge: 0, totalDistanceCost: 0 };
    }

    const distanceMiles = haversineDistance(depotLocation, customerCoords);
    const surcharge = distanceMiles > 50 ? (distanceMiles - 50) * 7 : 0;
    
    console.log('📏 Enhanced fallback calculation:', {
      customerAddress,
      depotLocation,
      customerCoords, 
      distanceMiles,
      surcharge
    });
    
    return {
      distanceMiles: Math.round(distanceMiles * 100) / 100,
      surcharge: Math.round(surcharge * 100) / 100,
      totalDistanceCost: Math.round(surcharge * 100) / 100
    };
  } catch (error) {
    console.error('Enhanced fallback distance calculation failed:', error);
    return { distanceMiles: 25, surcharge: 0, totalDistanceCost: 0 };
  }
}

// Get coordinates from known locations or browser geocoding  
async function getKnownOrBrowserGeocode(address: string): Promise<LocationCoordinates | null> {
  // Comprehensive local postal code database (matching server-side)
  const knownLocations: Record<string, LocationCoordinates> = {
    // Canadian Major Cities
    'T9H': { latitude: 56.7233483, longitude: -111.3794888 }, // Fort McMurray
    'T6E': { latitude: 53.5461, longitude: -113.4938 }, // Edmonton
    'T2P': { latitude: 51.0447, longitude: -114.0719 }, // Calgary  
    'V6B': { latitude: 49.2827, longitude: -123.1207 }, // Vancouver
    'M5V': { latitude: 43.6426, longitude: -79.3871 }, // Toronto
    'L5B': { latitude: 43.5890, longitude: -79.6441 }, // Mississauga
    'L2G': { latitude: 43.0911809, longitude: -79.0780985 }, // Niagara Falls
    'N1G': { latitude: 43.5256842, longitude: -80.2244631 }, // Guelph
    'K9H': { latitude: 44.32574839999999, longitude: -78.33194859999999 }, // Peterborough
    'H3B': { latitude: 45.5017, longitude: -73.5673 }, // Montreal
    'K1A': { latitude: 45.4215, longitude: -75.6972 }, // Ottawa
    
    // US Major Cities
    '10001': { latitude: 40.7505, longitude: -73.9934 }, // New York  
    '90210': { latitude: 34.0901, longitude: -118.4065 }, // Beverly Hills
    '33101': { latitude: 25.7617, longitude: -80.1918 }, // Miami
    '60601': { latitude: 41.8781, longitude: -87.6298 }, // Chicago
    '77001': { latitude: 29.7604, longitude: -95.3698 }, // Houston
    '94102': { latitude: 37.7849, longitude: -122.4094 }, // San Francisco
    '98101': { latitude: 47.6062, longitude: -122.3321 }, // Seattle
    '02101': { latitude: 42.3601, longitude: -71.0589 }, // Boston
    
    // International
    'M25': { latitude: 51.5074, longitude: -0.1278 }, // London
    '75001': { latitude: 48.8566, longitude: 2.3522 }, // Paris
    '2000': { latitude: -33.8688, longitude: 151.2093 }, // Sydney
  };
  
  // Enhanced postal code matching
  const cleanAddress = address.replace(/\s+/g, '').toUpperCase();
  
  // Check for known postal/zip codes with better matching
  for (const [code, coords] of Object.entries(knownLocations)) {
    if (cleanAddress.includes(code)) {
      console.log('🎯 Using known coordinates for', address, ':', coords);
      return coords;
    }
  }
  
  // Try browser geocoding if available
  if (window.google && window.google.maps) {
    const browserResult = await geocodeAddress(address);
    if (browserResult) {
      console.log('🌐 Browser geocoding successful for', address);
      return browserResult;
    }
  }
  
  console.warn('❌ No geocoding available for:', address);
  return null;
}

// Geocode address to coordinates
async function geocodeAddress(address: string): Promise<LocationCoordinates | null> {
  if (!window.google || !window.google.maps) {
    return null;
  }

  const geocoder = new window.google.maps.Geocoder();
  
  return new Promise((resolve) => {
    geocoder.geocode({ address }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          latitude: location.lat(),
          longitude: location.lng()
        });
      } else {
        console.warn('Geocoding failed:', status);
        resolve(null);
      }
    });
  });
}

// Haversine distance calculation (fallback when Google Maps API is unavailable)
function haversineDistance(coord1: LocationCoordinates, coord2: LocationCoordinates): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadian(coord2.latitude - coord1.latitude);
  const dLon = toRadian(coord2.longitude - coord1.longitude);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadian(coord1.latitude)) * Math.cos(toRadian(coord2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRadian(degree: number): number {
  return degree * (Math.PI / 180);
}

// Get depot coordinates from cart item
export function getDepotCoordinates(cartItem: any): LocationCoordinates | null {
  // This would typically come from a depot location database
  // For now, we'll use a simple mapping based on depot names
  const depotCoordinates: Record<string, LocationCoordinates> = {
    'Edmonton Container Depot': { latitude: 53.4689, longitude: -113.4921 },
    'Vancouver Container Depot': { latitude: 49.2827, longitude: -123.1207 },
    'Toronto Container Depot': { latitude: 43.6532, longitude: -79.3832 },
    'Montreal Container Depot': { latitude: 45.5017, longitude: -73.5673 },
    // Add more depot locations as needed
  };

  return depotCoordinates[cartItem.depot_name] || null;
}
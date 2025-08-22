// Google Geocoding API integration for converting postal codes to coordinates
class GeocodingAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  }

  // Convert postal code or zip code to coordinates
  async geocodePostalCode(postalCode) {
    try {
      const cleanedCode = postalCode.replace(/\s+/g, ''); // Remove spaces
      const url = `${this.baseUrl}?address=${encodeURIComponent(cleanedCode)}&region=us|ca&key=${this.apiKey}`;
      
      console.log(`Geocoding postal code: ${postalCode}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const result = data.results[0];
        const location = result.geometry.location;
        
        // Verify it's in North America (US/Canada)
        const isNorthAmerica = result.address_components.some(component =>
          component.types.includes('country') && 
          (component.short_name === 'US' || component.short_name === 'CA')
        );
        
        if (!isNorthAmerica) {
          throw new Error('Postal code is not in North America (US/Canada)');
        }
        
        console.log(`Geocoded ${postalCode} to: ${location.lat}, ${location.lng}`);
        
        return {
          latitude: location.lat,
          longitude: location.lng,
          formatted_address: result.formatted_address,
          source: 'google_geocoding'
        };
      } else {
        throw new Error(`Geocoding failed: ${data.status} - ${data.error_message || 'Unknown error'}`);
      }

    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  // Calculate distance between two coordinates using Haversine formula
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(deg) {
    return deg * (Math.PI / 180);
  }
}

export default GeocodingAPI;
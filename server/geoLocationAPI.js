// Using built-in fetch (Node.js 18+)

// Production-ready Google Geolocation API integration
class GeoLocationAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://www.googleapis.com/geolocation/v1/geolocate';
  }

  // Get current location using Google Geolocation API
  async getCurrentLocation(cellTowers = [], wifiAccessPoints = []) {
    try {
      const requestBody = {
        considerIp: true,
        ...(cellTowers.length > 0 && { cellTowers }),
        ...(wifiAccessPoints.length > 0 && { wifiAccessPoints })
      };

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Geolocation API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.location) {
        return {
          latitude: data.location.lat,
          longitude: data.location.lng,
          accuracy: data.accuracy,
          source: 'google_geolocation'
        };
      } else {
        throw new Error('No location data returned from Geolocation API');
      }

    } catch (error) {
      console.error('Google Geolocation API error:', error);
      throw error;
    }
  }

  // Calculate distance between two coordinates using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Find nearest containers based on current location
  async findNearestContainers(containers, userLocation = null, radiusMiles = 50) {
    try {
      let currentLocation = userLocation;
      
      // If no user location provided, try to get current location
      if (!currentLocation) {
        currentLocation = await this.getCurrentLocation();
      }

      // Calculate distances to all containers
      const containersWithDistance = containers.map(container => {
        const distance = this.calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          container.latitude,
          container.longitude
        );

        return {
          ...container,
          distance,
          distanceFormatted: `${distance} miles`
        };
      });

      // Filter by radius if specified
      let filteredContainers = containersWithDistance;
      if (radiusMiles > 0) {
        filteredContainers = containersWithDistance.filter(
          container => container.distance <= radiusMiles
        );
      }

      // Sort by distance (nearest first)
      filteredContainers.sort((a, b) => a.distance - b.distance);

      return {
        userLocation: currentLocation,
        containers: filteredContainers,
        totalFound: filteredContainers.length,
        searchRadius: radiusMiles
      };

    } catch (error) {
      console.error('Error finding nearest containers:', error);
      throw error;
    }
  }

  // Get containers within specific geographic boundaries
  getContainersInBounds(containers, northEast, southWest) {
    return containers.filter(container => {
      return container.latitude <= northEast.lat &&
             container.latitude >= southWest.lat &&
             container.longitude <= northEast.lng &&
             container.longitude >= southWest.lng;
    });
  }

  // Find containers by city proximity
  findContainersByCity(containers, cityName, maxDistance = 25) {
    // This would typically use geocoding to get city coordinates
    // For now, using simple city name matching
    const cityContainers = containers.filter(container => 
      container.city && container.city.toLowerCase().includes(cityName.toLowerCase())
    );

    return cityContainers.map(container => ({
      ...container,
      matchType: 'city_match'
    }));
  }

  // Get location statistics for containers
  getLocationStatistics(containers) {
    const stats = {
      totalContainers: containers.length,
      uniqueLocations: new Set(containers.map(c => `${c.city}, ${c.state}`)).size,
      averageLatitude: 0,
      averageLongitude: 0,
      boundingBox: {
        north: Math.max(...containers.map(c => c.latitude)),
        south: Math.min(...containers.map(c => c.latitude)),
        east: Math.max(...containers.map(c => c.longitude)),
        west: Math.min(...containers.map(c => c.longitude))
      }
    };

    // Calculate center point
    stats.averageLatitude = containers.reduce((sum, c) => sum + c.latitude, 0) / containers.length;
    stats.averageLongitude = containers.reduce((sum, c) => sum + c.longitude, 0) / containers.length;

    return stats;
  }
}

export default GeoLocationAPI;
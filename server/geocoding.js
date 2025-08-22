// ZIP code to coordinates mapping for proximity search
const zipCoordinates = {
  '90210': { lat: 34.0901, lng: -118.4065, location: 'Los Angeles, CA' }, // Beverly Hills, CA
  '10001': { lat: 40.7505, lng: -73.9934, location: 'New York, NY' },  // New York, NY
  '60601': { lat: 41.8819, lng: -87.6278, location: 'Chicago, IL' },  // Chicago, IL
  '33101': { lat: 25.7617, lng: -80.1918, location: 'Miami, FL' },  // Miami, FL
  '02101': { lat: 42.3584, lng: -71.0598, location: 'Boston, MA' },  // Boston, MA
  '75141': { lat: 32.6439, lng: -96.7075, location: 'Dallas, TX' },  // Dallas, TX (actual depot)
  '80221': { lat: 39.8200, lng: -105.0100, location: 'Denver, CO' }, // Denver, CO (actual depot)
};

// Known depot locations from your authentic CSV data
const depotLocations = [
  { name: 'Dallas Depot', lat: 32.6439, lng: -96.7075, postal_code: '75141' },
  { name: 'Denver Depot', lat: 39.8200, lng: -105.0100, postal_code: '80221' }
];

function getCoordinatesFromZip(zipCode) {
  return zipCoordinates[zipCode] || null;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in miles
}

function findNearestDepot(searchLat, searchLng) {
  let nearestDepot = null;
  let minDistance = Infinity;
  
  for (const depot of depotLocations) {
    const distance = calculateDistance(searchLat, searchLng, depot.lat, depot.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearestDepot = depot;
    }
  }
  
  return { depot: nearestDepot, distance: minDistance };
}

export { getCoordinatesFromZip, findNearestDepot, calculateDistance };
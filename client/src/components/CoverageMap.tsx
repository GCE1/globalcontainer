import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { useDepotLocations } from '@/hooks/useDepotLocations';

// Fix for Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CoverageMap = () => {
  const { data: depotData, isLoading, error } = useDepotLocations();

  useEffect(() => {
    // Force a resize event after the component mounts to fix any rendering issues
    window.dispatchEvent(new Event('resize'));
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading global coverage map...</div>
      </div>
    );
  }

  if (error || !depotData?.success) {
    return (
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Unable to load depot locations</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {depotData.depots.map((depot) => (
          <div key={depot.id}>
            <Marker position={[depot.latitude, depot.longitude]}>
              <Popup>
                <div className="p-2">
                  <strong className="text-[#001937]">{depot.depot_name}</strong><br />
                  <span className="text-sm text-gray-600">{depot.city}, {depot.country}</span><br />
                  <span className="text-xs text-gray-500">Code: {depot.code}</span><br />
                  <span className="text-xs text-[#42d1bd]">Services: {depot.services_offered.join(', ')}</span>
                </div>
              </Popup>
            </Marker>
            
            <Circle 
              center={[depot.latitude, depot.longitude]} 
              radius={50000} // 50km service radius
              pathOptions={{ 
                fillColor: '#42d1bd', 
                fillOpacity: 0.1,
                color: '#2dd4bf',
                weight: 1
              }} 
            />
          </div>
        ))}
      </MapContainer>
    </div>
  );
};

export default CoverageMap;
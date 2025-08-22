import CoverageMap from './CoverageMap';
import { useDepotLocations } from '@/hooks/useDepotLocations';

export default function CoverageSection() {
  const { data: depotData } = useDepotLocations();
  const depotCount = depotData?.depots?.length || 0;

  return (
    <section className="pt-6 pb-6 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#001937]">
            Our Global Coverage
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            With strategic locations across the world's major shipping routes, we provide seamless container exchange services wherever your business takes you.
          </p>
        </div>
        
        <div className="mt-10">
          <CoverageMap />
        </div>
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">
              {depotCount > 0 ? `${depotCount} Depots` : 'Global Depots'} with Containers
            </h3>
            <p className="text-gray-600">
              Strategically positioned in the world's busiest ports to ensure efficient container movement.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">24/7 Service</h3>
            <p className="text-gray-600">
              Round-the-clock operations and support to accommodate global shipping schedules.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Worldwide Network</h3>
            <p className="text-gray-600">
              Partnerships with local agents to provide seamless service beyond our major hubs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
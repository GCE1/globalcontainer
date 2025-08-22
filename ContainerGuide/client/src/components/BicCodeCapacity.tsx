import Tooltip from './Tooltip';

export default function BicCodeCapacity() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* BIC Code Section */}
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">Understanding BIC Codes</h2>
            <p className="mb-4">The Bureau International des Containers (BIC) code is the fundamental identifier in global container operations, serving as a container's unique "license plate" in international shipping.</p>
            
            <div className="bg-[#F5F5F5] p-6 rounded-lg mb-6">
              <h3 className="font-heading font-bold text-lg mb-3">BIC Code Format</h3>
              <p className="mb-2">BIC codes consist of four letters followed by a seven-digit number:</p>
              <div className="flex items-center justify-center bg-white p-4 rounded-lg mb-4 shadow-sm">
                <div className="text-center px-3 py-2 bg-[#0054A6] text-white rounded-l-md">
                  <span className="block text-xs">Owner Code</span>
                  <span className="font-mono font-bold">ABCU</span>
                </div>
                <div className="text-center px-3 py-2 bg-[#00A651] text-white">
                  <span className="block text-xs">Number</span>
                  <span className="font-mono font-bold">123456</span>
                </div>
                <div className="text-center px-3 py-2 bg-[#F7941D] text-white rounded-r-md">
                  <span className="block text-xs">Check Digit</span>
                  <span className="font-mono font-bold">7</span>
                </div>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-semibold">Owner Code:</span> Three letters identifying the container owner</li>
                <li><span className="font-semibold">Category Identifier:</span> U (for freight containers)</li>
                <li><span className="font-semibold">Serial Number:</span> Six digits uniquely identifying the container</li>
                <li><span className="font-semibold">Check Digit:</span> Validates the accuracy of the BIC code</li>
              </ul>
            </div>
            
            <p>Every container in our inventory is registered with a unique BIC code, ensuring proper tracking and identification throughout its journey.</p>
          </div>
          
          {/* Container Capacity Section */}
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">Understanding Container Capacity</h2>
            <p className="mb-6">When it comes to container solutions, selecting the right capacity is crucial for optimizing your shipping and storage efficiency.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse mb-6">
                <thead>
                  <tr className="bg-[#0054A6] text-white">
                    <th className="p-3 font-heading">Container Type</th>
                    <th className="p-3 font-heading">Internal Volume</th>
                    <th className="p-3 font-heading">Payload Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-[#F5F5F5]">
                    <td className="p-3 font-semibold">20ft Standard</td>
                    <td className="p-3">33.2m³ (1,172 cu ft)</td>
                    <td className="p-3">28,180kg (62,130 lbs)</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-[#F5F5F5]">
                    <td className="p-3 font-semibold">40ft Standard</td>
                    <td className="p-3">67.7m³ (2,390 cu ft)</td>
                    <td className="p-3">26,730kg (58,930 lbs)</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-[#F5F5F5]">
                    <td className="p-3 font-semibold">40ft High Cube</td>
                    <td className="p-3">76.4m³ (2,700 cu ft)</td>
                    <td className="p-3">26,460kg (58,330 lbs)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-[#F5F5F5] p-6 rounded-lg">
              <h3 className="font-heading font-bold text-lg mb-3">Choosing the Right Size</h3>
              <p className="mb-3">Consider these factors when selecting your container:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Nature and volume of goods to be transported or stored</li>
                <li>Weight distribution requirements</li>
                <li>Transportation restrictions and regulations</li>
                <li>Loading and unloading logistics</li>
                <li>Future expansion or <Tooltip text="Adding features such as doors, windows, ventilation, insulation, or specialized equipment to containers">modification</Tooltip> plans</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

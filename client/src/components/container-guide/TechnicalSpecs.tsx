export default function TechnicalSpecs() {
  return (
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#0054A6]">Technical Specifications</h2>
        <p className="text-center text-[#666666] max-w-3xl mx-auto mb-12 text-lg">Our containers feature industry-leading specifications designed for durability, security, and versatility.</p>
        
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left border-collapse bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
            <thead>
              <tr className="bg-[#0054A6] text-white">
                <th className="p-4 font-bold">Feature</th>
                <th className="p-4 font-bold">Standard 20ft</th>
                <th className="p-4 font-bold">Standard 40ft</th>
                <th className="p-4 font-bold">High Cube 40ft</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-[#F8F9FA] transition-colors duration-200">
                <td className="p-4 font-semibold text-[#333333]">External Length</td>
                <td className="p-4 text-[#555555]">6.06m (19' 10.5")</td>
                <td className="p-4 text-[#555555]">12.19m (40' 0")</td>
                <td className="p-4 text-[#555555]">12.19m (40' 0")</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-[#F8F9FA] transition-colors duration-200">
                <td className="p-4 font-semibold text-[#333333]">External Width</td>
                <td className="p-4 text-[#555555]">2.44m (8' 0")</td>
                <td className="p-4 text-[#555555]">2.44m (8' 0")</td>
                <td className="p-4 text-[#555555]">2.44m (8' 0")</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-[#F8F9FA] transition-colors duration-200">
                <td className="p-4 font-semibold text-[#333333]">External Height</td>
                <td className="p-4 text-[#555555]">2.59m (8' 6")</td>
                <td className="p-4 text-[#555555]">2.59m (8' 6")</td>
                <td className="p-4 text-[#555555]">2.90m (9' 6")</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-[#F8F9FA] transition-colors duration-200">
                <td className="p-4 font-semibold text-[#333333]">Internal Volume</td>
                <td className="p-4 text-[#555555]">33.2m³</td>
                <td className="p-4 text-[#555555]">67.7m³</td>
                <td className="p-4 text-[#555555]">76.4m³</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-[#F8F9FA] transition-colors duration-200">
                <td className="p-4 font-semibold text-[#333333]">Tare Weight</td>
                <td className="p-4 text-[#555555]">2,300kg</td>
                <td className="p-4 text-[#555555]">3,750kg</td>
                <td className="p-4 text-[#555555]">4,020kg</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-[#F8F9FA] transition-colors duration-200">
                <td className="p-4 font-semibold text-[#333333]">Max Payload</td>
                <td className="p-4 text-[#555555]">28,180kg</td>
                <td className="p-4 text-[#555555]">26,730kg</td>
                <td className="p-4 text-[#555555]">26,460kg</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white p-8 rounded-xl border-l-4 border-[#0054A6] shadow-lg">
            <h3 className="font-bold text-xl mb-4 text-[#0054A6]">Construction Materials</h3>
            <ul className="space-y-2 text-[#555555]">
              <li>• <strong className="text-[#333333]">Steel Grade:</strong> Corten weathering steel</li>
              <li>• <strong className="text-[#333333]">Floor:</strong> Marine-grade plywood 28mm thick</li>
              <li>• <strong className="text-[#333333]">Insulation:</strong> Polyurethane foam (reefer units)</li>
              <li>• <strong className="text-[#333333]">Paint:</strong> Multi-layer protective coating system</li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-xl border-l-4 border-[#00A651] shadow-lg">
            <h3 className="font-bold text-xl mb-4 text-[#00A651]">Safety Features</h3>
            <ul className="space-y-2 text-[#555555]">
              <li>• <strong className="text-[#333333]">Locking:</strong> High-security cam locks</li>
              <li>• <strong className="text-[#333333]">Corner Castings:</strong> ISO standard twist locks</li>
              <li>• <strong className="text-[#333333]">Ventilation:</strong> Passive air circulation system</li>
              <li>• <strong className="text-[#333333]">Drainage:</strong> Integrated floor drainage</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
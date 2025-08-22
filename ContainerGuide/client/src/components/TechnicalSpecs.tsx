import Tooltip from './Tooltip';

export default function TechnicalSpecs() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-heading font-bold text-center mb-4">Technical Specifications</h2>
        <p className="text-center text-[#666666] max-w-3xl mx-auto mb-12">Our containers feature industry-leading specifications designed for durability, security, and versatility.</p>
        
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0054A6] text-white">
                <th className="p-4 font-heading">Feature</th>
                <th className="p-4 font-heading">Standard 20ft</th>
                <th className="p-4 font-heading">Standard 40ft</th>
                <th className="p-4 font-heading">High Cube 40ft</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-[#F5F5F5]">
                <td className="p-4 font-semibold">External Length</td>
                <td className="p-4">6.06m (19' 10.5")</td>
                <td className="p-4">12.19m (40' 0")</td>
                <td className="p-4">12.19m (40' 0")</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-[#F5F5F5]">
                <td className="p-4 font-semibold">External Width</td>
                <td className="p-4">2.44m (8' 0")</td>
                <td className="p-4">2.44m (8' 0")</td>
                <td className="p-4">2.44m (8' 0")</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-[#F5F5F5]">
                <td className="p-4 font-semibold">External Height</td>
                <td className="p-4">2.59m (8' 6")</td>
                <td className="p-4">2.59m (8' 6")</td>
                <td className="p-4">2.90m (9' 6")</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-[#F5F5F5]">
                <td className="p-4 font-semibold">Internal Volume</td>
                <td className="p-4">33.2m³</td>
                <td className="p-4">67.7m³</td>
                <td className="p-4">76.4m³</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-[#F5F5F5]">
                <td className="p-4 font-semibold">Tare Weight</td>
                <td className="p-4">2,300kg</td>
                <td className="p-4">3,750kg</td>
                <td className="p-4">4,020kg</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-[#F5F5F5]">
                <td className="p-4 font-semibold">Max Payload</td>
                <td className="p-4">28,180kg</td>
                <td className="p-4">26,730kg</td>
                <td className="p-4">26,460kg</td>
              </tr>
            </tbody>
          </table>
        </div>
        

      </div>
    </section>
  );
}

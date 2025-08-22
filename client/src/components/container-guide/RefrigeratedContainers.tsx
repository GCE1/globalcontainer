import reeferImage from '@assets/reefer.png';
import reeferMultiImage from '@assets/Reefer-multi-images.png';

export default function RefrigeratedContainers() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">Refrigerated & Temperature-Controlled Containers</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">Maintain precise temperature control for your temperature-sensitive cargo with our range of refrigerated container solutions.</p>
        
        {/* Reefer Container Image */}
        <div className="mb-12 flex justify-center">
          <div className="bg-gray-50 p-5 rounded-lg max-w-4xl shadow-md">
            <img 
              src={reeferMultiImage} 
              alt="Multiple views of refrigerated containers showing different reefer unit configurations" 
              className="w-full h-auto rounded-lg" 
            />
            <p className="text-center text-sm mt-4 text-gray-600">Multiple images of a refrigerated container showcasing interior layout</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-3 text-blue-600">Standard Reefers</h3>
            <p className="mb-4">High-cube refrigerated containers for general temperature-controlled cargo. Ideal for fresh produce, dairy products, and pharmaceuticals.</p>
            <ul className="text-sm space-y-2">
              <li>• Temperature range: -30°C to +30°C</li>
              <li>• Precise humidity control</li>
              <li>• Fresh air ventilation system</li>
              <li>• Advanced monitoring technology</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-3 text-blue-600">Super Freezers</h3>
            <p className="mb-4">Ultra-low temperature containers for frozen goods requiring extreme cold storage during transport.</p>
            <ul className="text-sm space-y-2">
              <li>• Temperature range: -60°C to -18°C</li>
              <li>• Enhanced insulation</li>
              <li>• Rapid pull-down capability</li>
              <li>• Perfect for seafood & frozen foods</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-xl mb-3 text-blue-600">Controlled Atmosphere</h3>
            <p className="mb-4">Specialized containers that modify atmospheric composition to extend the shelf life of fresh produce.</p>
            <ul className="text-sm space-y-2">
              <li>• Modified atmosphere technology</li>
              <li>• Extended freshness period</li>
              <li>• Reduced spoilage rates</li>
              <li>• Ideal for fruits & vegetables</li>
            </ul>
          </div>
        </div>
        
        <h3 className="font-bold text-2xl mb-6 text-center text-gray-800">Key Features & Benefits</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white border-l-4 border-blue-600 p-6 rounded-lg shadow-lg">
            <h4 className="font-bold text-xl mb-4 text-blue-600">Advanced Technology</h4>
            <ul className="space-y-2 text-gray-800 leading-relaxed">
              <li>• Real-time temperature monitoring</li>
              <li>• GPS tracking and remote diagnostics</li>
              <li>• Automatic temperature recording</li>
              <li>• Power failure alerts and backup systems</li>
              <li>• Integration with cold chain management</li>
            </ul>
          </div>
          
          <div className="bg-white border-l-4 border-orange-500 p-6 rounded-lg shadow-lg">
            <h4 className="font-bold text-xl mb-4 text-orange-500">Applications</h4>
            <ul className="space-y-2 text-gray-800 leading-relaxed">
              <li>• Fresh fruits and vegetables</li>
              <li>• Frozen and chilled meats</li>
              <li>• Dairy products and beverages</li>
              <li>• Pharmaceuticals and vaccines</li>
              <li>• Flowers and plants</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border-l-4 border-green-600 p-6 rounded-lg shadow-lg">
            <h4 className="font-bold text-xl mb-3 text-green-600">Energy Efficiency</h4>
            <p className="text-gray-800 leading-relaxed">Our modern reefer containers feature energy-efficient refrigeration systems that reduce fuel consumption while maintaining precise temperature control throughout your supply chain.</p>
          </div>
          
          <div className="bg-white border-l-4 border-red-500 p-6 rounded-lg shadow-lg">
            <h4 className="font-bold text-xl mb-3 text-red-500">Global Compliance</h4>
            <p className="text-gray-800 leading-relaxed">All refrigerated containers meet international food safety standards including HACCP, ensuring your temperature-sensitive cargo maintains quality and regulatory compliance worldwide.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
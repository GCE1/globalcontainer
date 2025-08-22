import modernOffice from '@assets/Modern-Office.png';
import emergencyResponse from '@assets/Emergency Response Units.png';
import containerHome from '@assets/home.png';

export default function ArchitecturalInnovation() {
  return (
    <section className="py-12 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-heading font-bold text-center mb-4">Architectural Innovation</h2>
        <p className="text-center text-[#666666] max-w-3xl mx-auto mb-12">Experience the future of sustainable architecture with our container conversion possibilities. From basic modifications to complete transformations.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <img 
              src={emergencyResponse} 
              alt="Emergency Response Medical Container Unit" 
              className="w-full h-64 object-cover" 
            />
            <div className="p-6">
              <h3 className="text-xl font-heading font-bold mb-3">Emergency Response Units</h3>
              <p>Rapid deployment housing and medical facilities for disaster relief and emergency situations. These versatile units can be quickly transported and set up to provide immediate shelter and critical services when communities need them most.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <img 
              src={modernOffice} 
              alt="Container office complex" 
              className="w-full h-64 object-cover" 
            />
            <div className="p-6">
              <h3 className="text-xl font-heading font-bold mb-3">Modern Office Complexes</h3>
              <p>Contemporary workplace designs that offer flexibility, mobility, and cost-effectiveness. Container offices can be easily expanded, relocated, or modified as business needs change.</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col">
            <div className="p-0">
              <img 
                src={containerHome} 
                alt="Modern container home with glass walls" 
                className="w-full h-40 object-cover rounded-t-lg" 
              />
            </div>
            <div className="p-4 flex-grow">
              <h3 className="font-heading font-bold text-lg mb-2">Eco-friendly Housing</h3>
              <p className="text-sm">Sustainable living solutions combining modern design with environmentally-conscious construction and unique architectural possibilities.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col">
            <div className="p-0 h-40">
              <img 
                src="/business.png" 
                alt="Container converted into a business kiosk with serving counter" 
                className="w-full h-40 object-cover rounded-t-lg" 
              />
            </div>
            <div className="p-4 flex-grow">
              <h3 className="font-heading font-bold text-lg mb-2">Remote Work Stations</h3>
              <p className="text-sm">Off-grid operational bases for industries requiring temporary facilities in remote locations.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col">
            <div className="p-0 h-40">
              <img 
                src="/garage-shed.png" 
                alt="Container garage with outdoor equipment and storage" 
                className="w-full h-40 object-cover rounded-t-lg" 
              />
            </div>
            <div className="p-4 flex-grow">
              <h3 className="font-heading font-bold text-lg mb-2">Garage & Shed Solutions</h3>
              <p className="text-sm">Affordable, quick-to-deploy storage and workspace solutions perfect for residential properties and small businesses. Great for lake lots or cabins.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

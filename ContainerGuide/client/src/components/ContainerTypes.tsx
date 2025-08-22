import { useState } from 'react';
import Tooltip from './Tooltip';
import { ContainerDetailsModal } from './ContainerDetailsModals';
import { Button } from '@/components/ui/button';
import iicl from '@assets/IICL.png';
import cargoWorthy from '@assets/Cargo-Worthy.png';
import windWaterTight from '@assets/WWT.png';
import asIs from '@assets/Damaged-As-Is.png';

export default function ContainerTypes() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  
  return (
    <section id="container-types" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-heading font-bold text-center mb-4">Container Classification Guide</h2>
        <p className="text-center text-[#666666] max-w-3xl mx-auto mb-12">Understand the different container types and certifications to make an informed purchase decision for your specific needs.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* IICL Container */}
          <div className="container-type bg-white rounded-lg overflow-hidden shadow-lg flex flex-col h-full">
            <div className="relative">
              <img 
                src={iicl} 
                alt="IICL Certified Container" 
                className="w-full h-64 object-cover" 
              />
              <div className="absolute top-4 right-4 bg-[#0054A6] text-white text-sm font-semibold py-1 px-3 rounded-full">Premium</div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex-grow">
                <h3 className="text-xl font-heading font-bold mb-3">IICL Certified Containers</h3>
                <p className="mb-4">The pinnacle of shipping container quality and reliability in the global logistics industry. Each IICL certified container undergoes rigorous inspection and meets exacting international standards.</p>
                
                <div className="mb-4">
                  <h4 className="font-heading font-semibold text-[#0054A6] mb-2">Key Features:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Meets highest industry standards for international shipping</li>
                    <li>Certified by authorized <Tooltip text="Institute of International Container Lessors - The premier trade association of the international container leasing industry">IICL</Tooltip> inspectors</li>
                    <li>Structural integrity verified for ocean freight</li>
                    <li>Premium condition with minimal wear</li>
                    <li>Comes with original manufacturer warranty</li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <span className="text-xs text-[#999999]">Best for:</span>
                  <p className="font-semibold text-[#666666]">International Shipping, Long-term Investment</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex justify-end">
                <Button 
                  className="bg-[#0054A6] hover:bg-opacity-90 text-white font-heading font-semibold px-3 py-1.5 rounded text-sm transition duration-300 whitespace-nowrap"
                  onClick={() => setOpenModal('iicl')}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
          
          {/* CWO Container */}
          <div className="container-type bg-white rounded-lg overflow-hidden shadow-lg flex flex-col h-full">
            <div className="relative">
              <img 
                src={cargoWorthy} 
                alt="Cargo Worthy Container" 
                className="w-full h-64 object-cover" 
              />
              <div className="absolute top-4 right-4 bg-[#00A651] text-white text-sm font-semibold py-1 px-3 rounded-full">Standard</div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex-grow">
                <h3 className="text-xl font-heading font-bold mb-3">Cargo Worthy (CWO) Containers</h3>
                <p className="mb-4">Cargo Worthy certified containers have undergone rigorous inspection to verify their structural integrity and suitability for international cargo transport.</p>
                
                <div className="mb-4">
                  <h4 className="font-heading font-semibold text-[#0054A6] mb-2">Key Features:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Official certification by authorized marine cargo surveyors</li>
                    <li>Structurally sound for international shipping</li>
                    <li>Weather-resistant and secure</li>
                    <li>May show signs of previous use but fully functional</li>
                    <li>Economical alternative to IICL containers</li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <span className="text-xs text-[#999999]">Best for:</span>
                  <p className="font-semibold text-[#666666]">Ocean Transport, General Cargo Shipping</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex justify-end">
                <Button 
                  className="bg-[#0054A6] hover:bg-opacity-90 text-white font-heading font-semibold px-3 py-1.5 rounded text-sm transition duration-300 whitespace-nowrap"
                  onClick={() => setOpenModal('cargo-worthy')}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
          
          {/* WWT Container */}
          <div className="container-type bg-white rounded-lg overflow-hidden shadow-lg flex flex-col h-full">
            <div className="relative">
              <img 
                src={windWaterTight} 
                alt="Wind and Water Tight Container" 
                className="w-full h-64 object-cover" 
              />
              <div className="absolute top-4 right-4 bg-[#F7941D] text-white text-sm font-semibold py-1 px-3 rounded-full">Economic</div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex-grow">
                <h3 className="text-xl font-heading font-bold mb-3">Wind & Watertight (WWT) Containers</h3>
                <p className="mb-4">Wind and Water Tight containers maintain basic weatherproof capabilities while being more economical than CWO containers. Ideal for static storage or domestic transport.</p>
                
                <div className="mb-4">
                  <h4 className="font-heading font-semibold text-[#0054A6] mb-2">Key Features:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Weather-resistant construction</li>
                    <li>Functional doors, seals, and locks</li>
                    <li>Suitable for domestic transport</li>
                    <li>May have cosmetic damage but maintains integrity</li>
                    <li>Cost-effective storage solution</li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <span className="text-xs text-[#999999]">Best for:</span>
                  <p className="font-semibold text-[#666666]">Domestic Use, Storage, Modifications</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex justify-end">
                <Button 
                  className="bg-[#0054A6] hover:bg-opacity-90 text-white font-heading font-semibold px-3 py-1.5 rounded text-sm transition duration-300 whitespace-nowrap"
                  onClick={() => setOpenModal('wind-water-tight')}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
          
          {/* AS-IS Container */}
          <div className="container-type bg-white rounded-lg overflow-hidden shadow-lg flex flex-col h-full">
            <div className="relative">
              <img 
                src={asIs} 
                alt="As-Is Container" 
                className="w-full h-64 object-cover" 
              />
              <div className="absolute top-4 right-4 bg-[#666666] text-white text-sm font-semibold py-1 px-3 rounded-full">Basic</div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex-grow">
                <h3 className="text-xl font-heading font-bold mb-3">Damaged (AS-IS) Containers</h3>
                <p className="mb-4">Damaged As-Is containers are sold in their current condition with existing damage or wear. These containers offer value for specific applications such as modification projects.</p>
                
                <div className="mb-4">
                  <h4 className="font-heading font-semibold text-[#0054A6] mb-2">Key Features:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Sold with documented existing damage</li>
                    <li>May have structural issues or significant wear</li>
                    <li>Perfect for modification projects</li>
                    <li>Available at significantly reduced prices</li>
                    <li>Suitable for parts salvage or non-storage applications</li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <span className="text-xs text-[#999999]">Best for:</span>
                  <p className="font-semibold text-[#666666]">Modifications, Parts, Creative Projects</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex justify-end">
                <Button 
                  className="bg-[#0054A6] hover:bg-opacity-90 text-white font-heading font-semibold px-3 py-1.5 rounded text-sm transition duration-300 whitespace-nowrap"
                  onClick={() => setOpenModal('as-is')}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Container Details Modals */}
      {openModal && (
        <ContainerDetailsModal 
          isOpen={!!openModal} 
          onClose={() => setOpenModal(null)} 
          containerType={openModal} 
        />
      )}
    </section>
  );
}

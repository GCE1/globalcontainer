import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import iicl from '@assets/IICL.png';
import cargoWorthy from '@assets/Cargo-Worthy.png';
import windWaterTight from '@assets/WWT.png';
import asIs from '@assets/Damaged-As-Is_1749156494264.png';

export default function ContainerTypes() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  
  const containerTypes = [
    {
      id: 'iicl',
      title: 'IICL Certified Containers',
      badge: 'Premium',
      description: 'The pinnacle of shipping container quality and reliability in the global logistics industry. Each IICL certified container undergoes rigorous inspection and meets exacting international standards.',
      features: [
        'Meets highest industry standards for international shipping',
        'Certified by authorized IICL inspectors',
        'Structural integrity verified for ocean freight',
        'Premium condition with minimal wear',
        'Comes with original manufacturer warranty'
      ],
      bestFor: 'International Shipping, Long-term Investment',
      image: iicl
    },
    {
      id: 'cargo-worthy',
      title: 'Cargo Worthy (CW) Containers',
      badge: 'Standard',
      description: 'Reliable containers that meet all requirements for safe cargo transportation. Perfect balance of quality and value for most shipping needs.',
      features: [
        'Structurally sound for cargo transportation',
        'Weather-resistant and secure',
        'Suitable for domestic and international shipping',
        'Cost-effective solution',
        'Regular maintenance performed'
      ],
      bestFor: 'General Cargo, Regular Shipping',
      image: cargoWorthy
    },
    {
      id: 'wind-water-tight',
      title: 'Wind & Water Tight (WWT) Containers',
      badge: 'Value',
      description: 'Basic protection against weather elements. Suitable for storage and non-critical shipping applications where cost is a primary concern.',
      features: [
        'Weather protection for stored goods',
        'Structurally intact',
        'Budget-friendly option',
        'Suitable for storage applications',
        'Basic security features'
      ],
      bestFor: 'Storage, Non-critical Shipping',
      image: windWaterTight
    },
    {
      id: 'as-is',
      title: 'As-Is / Damaged Containers',
      badge: 'Economy',
      description: 'Containers with visible damage or wear, sold at reduced prices. Ideal for modification projects or temporary storage needs.',
      features: [
        'Significantly reduced pricing',
        'Suitable for modification projects',
        'Various damage levels available',
        'Sold without warranty',
        'Creative repurposing opportunities'
      ],
      bestFor: 'Modifications, Temporary Storage',
      image: asIs
    }
  ];

  const ContainerModal = ({ container }: { container: typeof containerTypes[0] }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">{container.title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <img 
          src={container.image} 
          alt={container.title}
          className="w-full h-64 object-cover rounded-lg" 
        />
        <p className="text-gray-700">{container.description}</p>
        
        <div>
          <h4 className="font-semibold text-blue-600 mb-2">Key Features:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {container.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <span className="text-xs text-gray-500">Best for:</span>
          <p className="font-semibold text-gray-700">{container.bestFor}</p>
        </div>
      </div>
    </DialogContent>
  );
  
  return (
    <section id="container-types" className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#0054A6]">Container Classification Guide</h2>
        <p className="text-center text-[#666666] max-w-3xl mx-auto mb-12 text-lg">
          Understand the different container types and certifications to make an informed purchase decision for your specific needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {containerTypes.map((container) => (
            <div key={container.id} className="bg-white rounded-xl overflow-hidden shadow-lg flex flex-col h-full border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={container.image} 
                  alt={container.title}
                  className="w-full h-64 object-cover" 
                />
                <div className={`absolute top-4 right-4 text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg ${
                  container.badge === 'Premium' ? 'bg-[#0054A6]' :
                  container.badge === 'Standard' ? 'bg-[#00A651]' :
                  container.badge === 'Value' ? 'bg-[#F7931E]' : 'bg-[#666666]'
                }`}>
                  {container.badge}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-4 text-[#0054A6]">{container.title}</h3>
                  <p className="mb-6 text-[#555555] leading-relaxed">{container.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-[#0054A6] mb-3">Key Features:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {container.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-[#555555] text-sm leading-relaxed">{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-xs text-[#999999] uppercase tracking-wide">Best for:</span>
                    <p className="font-semibold text-[#333333] mt-1">{container.bestFor}</p>
                  </div>
                </div>
                
                <div className="mt-auto flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-[#0054A6] hover:bg-[#003d80] text-white font-semibold px-4 py-2 rounded-lg transition duration-300 shadow-lg">
                        Learn More
                      </Button>
                    </DialogTrigger>
                    <ContainerModal container={container} />
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
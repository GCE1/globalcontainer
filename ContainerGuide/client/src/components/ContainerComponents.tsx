import labeledContainer from '@assets/Labeled Container.png';
import { 
  ArrowBigUp, 
  Lock, 
  ShieldCheck, 
  RotateCcw, 
  FileSpreadsheet, 
  Hash, 
  SquareCode, 
  Wind, 
  Scale, 
  Columns, 
  Truck, 
  CircleDot 
} from 'lucide-react';

export default function ContainerComponents() {
  const containerParts = [
    {
      name: "High Cube Indicator",
      description: "Signifies containers with additional vertical space (9'6\" height vs standard 8'6\"). Provides 13% more cubic capacity for efficient volume shipping.",
      icon: ArrowBigUp
    },
    {
      name: "Locking Bar",
      description: "Vertical security mechanism that secures container doors when closed. Designed to prevent unauthorized entry and ensure cargo remains sealed during transport.",
      icon: Lock
    },
    {
      name: "Secure Lock Box",
      description: "Reinforced housing that protects the container's locking mechanism from tampering. Essential for maintaining supply chain security and cargo integrity.",
      icon: ShieldCheck
    },
    {
      name: "Locking Bar Door Handle",
      description: "Rotating handle that engages or disengages the locking bars. Features anti-tamper design with provisions for industry-standard security seals.",
      icon: RotateCcw
    },
    {
      name: "Location of CSC Plate",
      description: "Position of the Convention for Safe Containers plate, certifying the container meets international safety regulations. Contains inspection dates and approval information.",
      icon: FileSpreadsheet
    },
    {
      name: "Location of Unit Serial Number",
      description: "Standardized identification number unique to each container. Essential for tracking, inventory management, and customs documentation throughout the container's lifecycle.",
      icon: Hash
    },
    {
      name: "Corner Casting",
      description: "Reinforced corner fittings designed for lifting, stacking, and securing containers. ISO-standardized connection points for cranes, twist-locks, and lashing systems.",
      icon: SquareCode
    },
    {
      name: "Container Vents",
      description: "Pressure-equalization openings that prevent vacuum formation inside the container. Allows airflow while maintaining weather resistance and preventing condensation.",
      icon: Wind
    },
    {
      name: "Weight & Capacity Markings",
      description: "Regulatory information displaying maximum gross weight, tare weight, and payload capacity. Critical for safe handling, transportation compliance, and load planning.",
      icon: Scale
    },
    {
      name: "Corner Post",
      description: "Vertical structural element that transfers compressive loads when containers are stacked. Engineered to withstand multi-container stacking forces in diverse conditions.",
      icon: Columns
    },
    {
      name: "Fork Lift Pockets",
      description: "Reinforced openings in the base that allow forklift handling when the container is empty. Provides operational flexibility in facilities without overhead lifting equipment.",
      icon: Truck
    },
    {
      name: "Rubber Door Gasket",
      description: "Weather-tight seal around the container doors that prevents water intrusion. Essential for maintaining cargo integrity and protection against environmental elements.",
      icon: CircleDot
    }
  ];

  return (
    <section id="container-components" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-heading font-bold text-center mb-4">Container Component Guide</h2>
        <p className="text-center text-[#666666] max-w-3xl mx-auto mb-12">
          Understanding the key components of a shipping container helps you assess quality, functionality, and suitability for your specific needs.
        </p>
        
        <div className="mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img 
              src={labeledContainer} 
              alt="Labeled Container Components" 
              className="w-full max-w-4xl mx-auto mb-8 rounded-lg" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {containerParts.map((part, index) => (
                <div key={index} className="bg-[#F5F5F5] p-4 rounded-md flex items-start">
                  <div className="text-[#0054A6] mr-3 mt-1">
                    {part.icon && <part.icon size={18} />}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-[#0054A6] mb-2">{part.name}</h3>
                    <p className="text-[#555555] text-sm">{part.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
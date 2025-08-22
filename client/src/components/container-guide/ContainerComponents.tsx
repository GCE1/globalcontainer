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
import labeledContainerImage from '@assets/LabeledContainer.png';

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
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">Container Component Guide</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Understanding the key components of a shipping container helps you assess quality, functionality, and suitability for your specific needs.
        </p>
        
        <div className="mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img 
              src={labeledContainerImage} 
              alt="Labeled Container Components" 
              className="w-full max-w-4xl mx-auto mb-8 rounded-lg" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {containerParts.map((part, index) => {
                const IconComponent = part.icon;
                return (
                  <div key={index} className="bg-gray-50 p-4 rounded-md flex items-start">
                    <div className="text-blue-600 mr-3 mt-1">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-2">{part.name}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{part.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-bold text-xl mb-4 text-blue-600">Quality Inspection Points</h3>
          <p className="mb-4">When evaluating a container, our certified inspectors examine each of these components to ensure:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm">
              <li>• Structural integrity of corner posts and castings</li>
              <li>• Proper operation of locking mechanisms</li>
              <li>• Weather-tight sealing of doors and vents</li>
              <li>• Accuracy of weight and capacity markings</li>
            </ul>
            <ul className="space-y-2 text-sm">
              <li>• Readability of identification numbers and plates</li>
              <li>• Condition of forklift pockets and lifting points</li>
              <li>• Overall structural soundness for intended use</li>
              <li>• Compliance with international safety standards</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
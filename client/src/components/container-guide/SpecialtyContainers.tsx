import openTopImage from '@assets/Open-top containers.png';
import doubleDoorImage from '@assets/Double-door containners.png';
import halfHeightImage from '@assets/Half-height containers.png';
import openSideImage from '@assets/Open-side containers.png';
import sideDoorImage from '@assets/Side-door containers.png';
import flatRackImage from '@assets/Flat-rack containers.png';

export default function SpecialtyContainers() {
  const specialtyContainers = [
    {
      name: "Open-top Containers",
      description: "Designed for oversized cargo that cannot fit through standard container doors. Features a removable tarpaulin roof for top-loading access, making them ideal for machinery, construction materials, and other tall items that require crane loading.",
      image: openTopImage,
      keyFeatures: ["Removable tarpaulin roof", "Top-loading capability", "Standard floor dimensions", "Suitable for oversized cargo"]
    },
    {
      name: "Double Door Containers", 
      description: "Feature doors at both ends of the container, providing enhanced loading flexibility and improved cargo access. Perfect for efficient loading and unloading operations, especially useful for long items and streamlined warehouse operations.",
      image: doubleDoorImage,
      keyFeatures: ["Doors at both ends", "Enhanced loading flexibility", "Improved cargo access", "Streamlined operations"]
    },
    {
      name: "Half Height Containers",
      description: "Compact containers with reduced height, specifically designed for heavy, dense cargo such as coal, ore, steel, and other materials where weight is more critical than volume. Maintains standard length and width dimensions.",
      image: halfHeightImage, 
      keyFeatures: ["Reduced height design", "Heavy cargo capacity", "Standard length/width", "Optimized for dense materials"]
    },
    {
      name: "Open-side Containers",
      description: "Feature a fully removable side panel, providing wide lateral access for loading oversized or irregularly shaped cargo. Ideal for machinery, vehicles, and items that require side-loading access with cranes or forklifts.",
      image: openSideImage,
      keyFeatures: ["Removable side panel", "Wide lateral access", "Side-loading capability", "Irregular cargo accommodation"]
    },
    {
      name: "Side Door Containers",
      description: "Equipped with additional doors along the side panels while maintaining standard end doors. Offers multiple access points for selective loading and unloading, improving operational efficiency in warehousing and distribution.",
      image: sideDoorImage,
      keyFeatures: ["Multiple access points", "Side and end doors", "Selective loading", "Warehouse efficiency"]
    },
    {
      name: "Flat-Rack Containers",
      description: "Feature collapsible or fixed end walls with no roof or side walls, designed for heavy machinery, vehicles, boats, and oversized industrial equipment. Provides maximum flexibility for securing and transporting irregular-shaped cargo.",
      image: flatRackImage,
      keyFeatures: ["No roof or side walls", "Collapsible end walls", "Heavy machinery transport", "Maximum cargo flexibility"]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#0054A6]">Specialty Containers</h2>
        <p className="text-center text-[#666666] max-w-3xl mx-auto mb-12 text-lg">
          Specialized container solutions designed for unique cargo requirements and specific industry applications beyond standard shipping containers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialtyContainers.map((container, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-48 bg-[#F8F9FA] flex items-center justify-center p-4">
                <img 
                  src={container.image} 
                  alt={container.name} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3 text-[#0054A6]">{container.name}</h3>
                <p className="text-[#555555] text-sm mb-4 leading-relaxed">{container.description}</p>
                
                <div>
                  <h4 className="font-semibold text-[#333333] mb-2">Key Features:</h4>
                  <ul className="text-xs text-[#666666] space-y-1">
                    {container.keyFeatures.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className="text-[#00A651] mr-2 font-bold">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-[#F8F9FA] p-8 rounded-xl shadow-lg max-w-4xl mx-auto border border-gray-100">
            <h3 className="font-bold text-xl mb-4 text-[#0054A6]">Custom Specialty Container Solutions</h3>
            <p className="text-[#555555] mb-4 leading-relaxed">
              Our specialty containers undergo the same rigorous quality inspections as our standard containers, ensuring reliability and performance for your specialized cargo needs. Each container type is available in various condition grades to meet your specific requirements and budget.
            </p>
            <p className="text-[#666666] text-sm">
              Contact our specialists to discuss custom modifications or specific specialty container requirements for your unique applications.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
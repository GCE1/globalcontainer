import worldwideContainerVolumeIcon from "@assets/Worldwide Container Volume-b.png";
import firstInClassServiceIcon from "@assets/First-In-Class Service-b.png";
import containerIcon from "@assets/Container-bpng.png";
import freightForwardersIcon from "@assets/Freight Forwarders-b.png";
import wholesalersIcon from "@assets/Wholesalers-b.png";
import enterpriseCorporationsIcon from "@assets/Enterprise Corporations-b.png";

export default function WhyChooseUsSection() {
  const features = [
    {
      title: "Worldwide Container Volume",
      content: "For Manufacturers and Distribution Companies. We have 410 Depots with Current Container Volume, 66 Across North America and more to come.",
      icon: <img src={worldwideContainerVolumeIcon} alt="Worldwide Container Volume" className="w-12 h-12" />
    },
    {
      title: "First-In-Class Service",
      content: "24/7 customer support, real-time tracking, and dedicated account management for seamless container transactions worldwide.",
      icon: <img src={firstInClassServiceIcon} alt="First-In-Class Service" className="w-12 h-12" />
    },
    {
      title: "Container",
      content: "1,372,950 Containers In Circulation, on every Major Shipping Line Internationally (MSC, MAERSK, ONE, LLOYD, EVERGREEN)",
      icon: <img src={containerIcon} alt="Container" className="w-12 h-12" />
    },
    {
      title: "Freight Forwarders",
      content: "The one stop container shop worldwide (89 Countries) to use containers on one way leasing agreements, PUC Rates, SOC Rates, we can provide it all.",
      icon: <img src={freightForwardersIcon} alt="Freight Forwarders" className="w-12 h-12" />
    },
    {
      title: "Wholesalers",
      content: "Exclusive wholesale pricing and bulk container deals for resellers, distributors, and container trading companies worldwide.",
      icon: <img src={wholesalersIcon} alt="Wholesalers" className="w-12 h-12" />
    },
    {
      title: "Enterprise Corporations",
      content: "Scrap Dealers and Lumber Mills are obtaining 20% off Export Rates out of North America, Lets keep these containers flowing worldwide.",
      icon: <img src={enterpriseCorporationsIcon} alt="Enterprise Corporations" className="w-12 h-12" />
    }
  ];

  return (
    <section className="pt-6 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#001937] mb-6">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            This Is Why Freight Forwarders always come back to use our services
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300" style={{backgroundColor: '#ecf8ff'}}>
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#001937] mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
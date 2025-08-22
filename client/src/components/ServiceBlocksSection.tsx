import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function ServiceBlocksSection() {
  const [, setLocation] = useLocation();
  
  const handleNavigation = (path: string) => {
    setLocation(path);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  const serviceBlocks = [
    {
      title: "Insights",
      subtitle: "Analytics & Tracking",
      content: (
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <span className="text-gray-400 line-through text-sm">$99</span>
            <span className="text-2xl font-bold text-[#001937] ml-2">$49</span>
            <span className="text-gray-600 text-sm ml-1">month</span>
          </div>
          <ul className="text-gray-700 text-xs space-y-3 flex-grow mb-4">
            <li><span className="text-[#33d2b9]">★</span> Track All Container Purchases by Location</li>
            <li><span className="text-[#33d2b9]">★</span> Track All Container Leases by Location</li>
            <li><span className="text-[#33d2b9]">★</span> Analytics Dashboard with Performance Metrics</li>
            <li><span className="text-[#33d2b9]">★</span> Monthly Insights Reports & Cost Analysis</li>
            <li className="invisible"><span className="text-[#33d2b9]">★</span> Additional space for alignment</li>
          </ul>
          <div className="mt-auto">
            <Button 
              className="bg-[#001937] hover:bg-[#33d2b9] text-white font-semibold px-6 py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg w-full"
              onClick={() => handleNavigation('/payment?tier=insights&price=49')}
            >
              Subscribe Now
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Expert",
      subtitle: "Leasing",
      content: (
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <span className="text-gray-400 line-through text-sm">$249</span>
            <span className="text-2xl font-bold text-[#001937] ml-2">$149</span>
            <span className="text-gray-600 text-sm ml-1">month</span>
          </div>
          <ul className="text-gray-700 text-xs space-y-2 flex-grow">
            <li><span className="text-[#33d2b9]">★</span> Leasing Throughout 89 Countries</li>
            <li><span className="text-[#33d2b9]">★</span> Utilize SOC Rates</li>
            <li><span className="text-[#33d2b9]">★</span> Foreign Trade Depots</li>
            <li><span className="text-[#33d2b9]">★</span> Don't pay VAT & Duty Fees before products are sold or relocated</li>
          </ul>
          <div className="mt-auto">
            <Button 
              className="bg-[#001937] hover:bg-[#33d2b9] text-white font-semibold px-6 py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg w-full"
              onClick={() => handleNavigation('/payment?tier=expert&price=149')}
            >
              Subscribe Now
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Pro",
      subtitle: "Wholesale",
      content: (
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <span className="text-gray-400 line-through text-sm">$299</span>
            <span className="text-2xl font-bold text-[#001937] ml-2">$199</span>
            <span className="text-gray-600 text-sm ml-1">month</span>
          </div>
          <ul className="text-gray-700 text-xs space-y-2 flex-grow">
            <li><span className="text-[#33d2b9]">★</span> Wholesale Rates Throughout 89 Countries</li>
            <li><span className="text-[#33d2b9]">★</span> CRM Dashboard Optimize Sales & Margins</li>
            <li><span className="text-[#33d2b9]">★</span> Depot Directory</li>
            <li><span className="text-[#33d2b9]">★</span> Buy Now Pay Later Options Allowing for customer Reassurances</li>
          </ul>
          <div className="mt-auto">
            <Button 
              className="bg-[#001937] hover:bg-[#33d2b9] text-white font-semibold px-6 py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg w-full"
              onClick={() => handleNavigation('/payment?tier=pro&price=199')}
            >
              Subscribe Now
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="memberships-section" className="pt-8 pb-3 bg-white" style={{marginBottom: '5px'}}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#001937] mb-2">Become a Member - Exclusive package options</h2>
          <p className="text-lg text-gray-600">Join the Global Container Exchange platform Today!</p>
        </div>
        
        {/* New integrated layout with image and packages */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Left side - Membership packages */}
          <div className="flex-1 lg:w-2/3 flex flex-col">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
              {serviceBlocks.map((block, index) => (
                <div key={index} className="bg-gradient-to-br from-[#001937] to-[#4a90e2] rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col relative">
                  <div className="absolute top-6 right-6 z-10">
                    <img 
                      src="/attached_assets/PayPal-Buynow-pay-later.png"
                      alt="PayPal Buy Now Pay Later"
                      className="h-9 w-auto border border-white/30 rounded"
                      style={{
                        imageRendering: 'crisp-edges',
                        filter: 'contrast(1.15) brightness(1.08) saturate(1.05) unsharp-mask(amount=0.5, radius=0.5, threshold=0)',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        textRendering: 'optimizeLegibility'
                      }}
                    />
                  </div>
                  <div className="mb-4 pr-20">
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {block.title}
                      </h3>
                      <h4 className="text-sm font-semibold text-white/90 whitespace-nowrap">
                        {block.subtitle}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 flex-1 flex flex-col shadow-inner">
                    <div className="text-gray-800 h-full">
                      {block.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Ad copy card below packages - flex-1 to fill remaining space */}
            <div className="flex-1 bg-gray-100 rounded-lg p-6 shadow-md flex items-center">
              <div className="text-center w-full">
                <h3 className="text-lg font-semibold text-[#001937] mb-3">
                  Why Choose Global Container Exchange?
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                  <div className="flex flex-col items-center">
                    <div className="text-[#33d2b9] text-xl mb-2">🌍</div>
                    <p className="font-medium text-blue-600">Global Network</p>
                    <p>Access to 89 countries with established depot partnerships worldwide</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-[#33d2b9] text-xl mb-2">💰</div>
                    <p className="font-medium text-blue-600">Best Pricing</p>
                    <p>Wholesale rates and SOC options that save you money on every transaction</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-[#33d2b9] text-xl mb-2">🔒</div>
                    <p className="font-medium text-blue-600">Secure & Trusted</p>
                    <p>Bank-level security and verified partnerships with major shipping lines worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Customer service image */}
          <div className="flex-1 lg:w-1/3 lg:max-w-md">
            <div className="bg-gradient-to-br from-[#001937] to-[#4a90e2] rounded-lg p-6 shadow-lg h-full">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">Expert Support</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Our dedicated team of container logistics experts is here to help you succeed. 
                  Get personalized guidance for your shipping needs.
                </p>
              </div>
              
              <div className="relative mb-6">
                <img 
                  src="/images/customer-service.jpg" 
                  alt="Global Container Exchange Expert Support" 
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
              
              <div className="space-y-3 text-white/90 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#33d2b9] rounded-full mr-3"></div>
                  <span>24/7 Customer Support</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#33d2b9] rounded-full mr-3"></div>
                  <span>Personalized Consultation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#33d2b9] rounded-full mr-3"></div>
                  <span>Global Logistics Expertise</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6 bg-white text-[#001937] hover:bg-gray-100 font-semibold"
                onClick={() => handleNavigation('/contact-us')}
              >
                Get Expert Help
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
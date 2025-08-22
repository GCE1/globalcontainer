import residentialCommercialImage from "@assets/residential-commercial-one-time-purchase.jpg";
import { Button } from "@/components/ui/button";

export default function PricingSection() {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#001937] mb-8">
          Residential & Commercial One Time Purchase
        </h2>
        
        <div className="flex flex-col md:flex-row items-stretch gap-8">
          {/* Left side image */}
          <div className="md:w-[34%]">
            <img 
              src={residentialCommercialImage} 
              alt="Global container exchange professional with world map" 
              className="rounded-lg shadow-md w-full h-full object-cover"
            />
          </div>
          
          {/* Right side pricing details */}
          <div className="md:w-[66%] rounded-lg shadow-md p-8" style={{backgroundColor: '#ebf8ff'}}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" style={{color: '#42d1bd'}}>
                $0 <span className="text-gray-500 text-lg font-normal">month</span>
              </h3>
              <div className="h-10 flex items-center">
                <img 
                  className="h-full w-auto border border-gray-300"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <i className="fas fa-globe text-[#001937] mt-1 mr-3"></i>
                <span>66 Depots Across North America Optimize Shipping Rates With Us</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-award text-[#001937] mt-1 mr-3"></i>
                <span>Award Winning Military Relocation Container Rates</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-dollar-sign text-[#001937] mt-1 mr-3"></i>
                <span>Affordable Monthly Rental Rates</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-shield-alt text-[#001937] mt-1 mr-3"></i>
                <span>Storage Insurance</span>
              </div>
              <div className="flex items-start">
                <i className="fas fa-credit-card text-[#001937] mt-1 mr-3"></i>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline"
                className="mt-4 border-2 bg-[#001937] hover:bg-[#33d2b9] text-white hover:text-white border-[#001937] hover:border-[#33d2b9] px-4 py-2 rounded-lg flex items-center transition duration-300 h-auto group w-1/4 mx-auto justify-center"
              >
                <span>Buy Containers</span>
                <i className="fas fa-arrow-right ml-2 text-white group-hover:text-white"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

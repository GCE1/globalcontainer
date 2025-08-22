import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Hero() {
  return (
    <section 
      className="py-16 md:py-24 text-white relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/optimized_assets/container-depot_1749154371445-optimized.webp')`
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-end">
          {/* Empty left space */}
          <div className="md:w-1/2"></div>
          
          {/* Right side content */}
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                The Largest Global<br/>
                <span className="text-secondary">Container Marketplace</span>
              </h1>
              
              <div className="space-y-3 mt-8">
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-secondary mt-1 mr-3"></i>
                  <span>Wholesale in 83 Countries</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-secondary mt-1 mr-3"></i>
                  <span>450 Exports with Containers Readily Available</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-secondary mt-1 mr-3"></i>
                  <span>10000 New Containers Manufactured Monthly</span>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-secondary mt-1 mr-3"></i>
                  <span>24/7 Global Support & Logistics</span>
                </div>
              </div>
              
              <Link href="/membership">
                <Button 
                  variant="outline"
                  className="mt-8 border-2 bg-transparent hover:bg-[#33d2b9] text-[#33d2b9] hover:text-white border-[#33d2b9] px-6 py-3 rounded-lg flex items-center transition duration-300 h-auto group"
                >
                  <span>Get Started</span>
                  <i className="fas fa-arrow-right ml-2 text-[#33d2b9] group-hover:text-white"></i>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

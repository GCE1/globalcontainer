import { Button } from "@/components/ui/button";

export default function GlobalNetwork() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#001937] mb-12">
          Our Global Container Network
        </h2>
        
        <div className="relative rounded-xl overflow-hidden shadow-lg h-96">
          <img 
            src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
            alt="Global container shipping network map" 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-primary bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white p-6 max-w-lg">
              <h3 className="text-2xl font-bold mb-4">83 Countries Connected</h3>
              <p className="mb-6">
                Our extensive network spans across continents, providing seamless container solutions worldwide.
              </p>
              <Button
                className="bg-secondary hover:bg-opacity-80 text-white px-6 py-2 rounded-full inline-flex items-center transition duration-300"
              >
                <span>Explore Network</span>
                <i className="fas fa-globe ml-2"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

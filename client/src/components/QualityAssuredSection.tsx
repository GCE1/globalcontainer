import qualityAssuredImage from "@assets/Quality Assured.png";

export default function QualityAssuredSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Image (Desktop only) */}
          <div className="hidden lg:block lg:w-1/2">
            <img 
              src={qualityAssuredImage} 
              alt="Global Container Exchange quality assurance and expert support" 
              className="w-3/4 h-auto rounded-lg shadow-lg"
            />
          </div>
          
          {/* Right side - Content */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-[#001937] mb-6">
              Quality Assured Containers with Expert Support
            </h2>
            
            <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
              <p>
                At <strong>Global Container Exchange</strong> Inc., we understand that reliable container quality is crucial to your business success. That's why we maintain rigorous IICL inspection standards across our global fleet, ensuring every container meets the highest industry requirements. When you partner with us, you're choosing peace of mind – knowing your containers will arrive ready for immediate deployment, anywhere in the world.
              </p>
              
              {/* Mobile: Image positioned within text content for text wrapping */}
              <div className="lg:hidden float-left mr-4 mb-4 w-1/2">
                <img 
                  src={qualityAssuredImage} 
                  alt="Global Container Exchange quality assurance and expert support" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
              
              <p>
                Our extensive network spans across Asia, Europe, and North America, supported by dedicated experts who understand your unique shipping needs. Whether you're a freight forwarder, customs broker, or shipping carrier, you'll experience responsive support and seamless service that keeps your cargo moving efficiently. Join our growing community of satisfied global partners who trust us as their preferred container solutions provider and discover why customer satisfaction is at the heart of everything we do.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
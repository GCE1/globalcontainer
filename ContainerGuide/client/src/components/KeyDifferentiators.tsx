export default function KeyDifferentiators() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-heading font-bold text-center mb-12">Our Global Advantage</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Global Reach */}
          <div className="bg-[#F5F5F5] rounded-lg p-6 shadow-lg text-center flex flex-col h-full">
            <div className="flex justify-center mb-4">
              <i className="fas fa-globe text-5xl text-[#0054A6]"></i>
            </div>
            <h3 className="text-xl font-heading font-bold mb-3">Global Reach</h3>
            <p className="mb-4 flex-grow">Access to 410 depots across 89 countries, providing unparalleled convenience and competitive pricing.</p>
            <div className="mt-auto">
              <div className="text-4xl font-heading font-bold text-[#0054A6]">89</div>
              <div className="text-[#666666]">Countries</div>
            </div>
          </div>
          
          {/* Buyers Assurance */}
          <div className="bg-[#F5F5F5] rounded-lg p-6 shadow-lg text-center flex flex-col h-full">
            <div className="flex justify-center mb-4">
              <i className="fas fa-shield-alt text-5xl text-[#0054A6]"></i>
            </div>
            <h3 className="text-xl font-heading font-bold mb-3">Buyers Assurance Program</h3>
            <p className="mb-4 flex-grow">Every container undergoes rigorous inspection and certification processes to ensure quality and reliability.</p>
            <div className="mt-auto">
              <div className="text-4xl font-heading font-bold text-[#0054A6]">100%</div>
              <div className="text-[#666666]">Quality Assurance</div>
            </div>
          </div>
          
          {/* IICL Certification */}
          <div className="bg-[#F5F5F5] rounded-lg p-6 shadow-lg text-center flex flex-col h-full">
            <div className="flex justify-center mb-4">
              <i className="fas fa-certificate text-5xl text-[#0054A6]"></i>
            </div>
            <h3 className="text-xl font-heading font-bold mb-3">IICL Certification</h3>
            <p className="mb-4 flex-grow">The pinnacle of shipping container quality and reliability in the global logistics industry.</p>
            <div className="mt-auto">
              <div className="text-4xl font-heading font-bold text-[#0054A6]">1.39M+</div>
              <div className="text-[#666666]">Certified Containers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

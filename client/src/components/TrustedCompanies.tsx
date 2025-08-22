export default function TrustedCompanies() {
  return (
    <section className="header-bg py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0">
            <h2 className="text-white text-xl font-medium">Trusted by</h2>
            <p className="text-secondary text-4xl font-bold">2,500+</p>
            <p className="text-white text-xl font-medium">companies</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {/* Shipping company logos */}
            <div className="flex items-center justify-center">
              <img 
                src="/images/Hapag-Lloyd.png"
                alt="Hapag-Lloyd Logo" 
                className="h-14 w-auto"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/images/MAERSK.png"
                alt="Maersk Logo" 
                className="h-14 w-auto"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/images/CMA-CGM-logo.png"
                alt="CMA CGM Logo" 
                className="h-14 w-auto"
              />
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/images/Uni-Feeder.png"
                alt="Uni Feeder Logo" 
                className="h-14 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import containerDepotImage from '@assets/container-depot.png';

export default function Hero() {
  return (
    <section className="bg-[#0054A6] text-white py-12 md:py-24 relative">
      <div className="container mx-auto px-4">
        {/* Logo positioned at top left */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <img 
            src="/gce-logo.png" 
            alt="Global Container Exchange Logo" 
            className="h-12 md:h-16 w-auto" 
          />
        </div>
        
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 mt-16 md:mt-20">
            <h1 className="text-3xl md:text-5xl font-heading font-bold leading-tight mb-4">Buyer's Guide: Revolutionizing Global Container Solutions</h1>
            <p className="text-lg md:text-xl mb-8">Transform your container trading experience with access to over 1.39 million containers across 410 depots in 89 countries.</p>
            <div className="flex flex-wrap gap-4">
              <a href="#container-types" className="bg-[#00A651] hover:bg-opacity-90 text-white font-heading font-semibold px-6 py-3 rounded-lg transition duration-300">Explore Container Types</a>
              <a href="#faq" className="bg-white hover:bg-opacity-90 text-[#0054A6] font-heading font-semibold px-6 py-3 rounded-lg transition duration-300">View FAQs</a>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src={containerDepotImage} 
              alt="Large container terminal with cargo ship being loaded at a busy port" 
              className="rounded-lg shadow-xl w-full h-auto" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}

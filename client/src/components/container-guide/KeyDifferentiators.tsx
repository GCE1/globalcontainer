import globeIcon from '@assets/Globe_1749156222317.png';
import shieldIcon from '@assets/Shield_1749156222317.png';
import awardIcon from '@assets/award_1749156222317.png';

export default function KeyDifferentiators() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#0054A6]">Our Global Advantage</h2>
        <p className="text-center text-[#666666] max-w-3xl mx-auto mb-12">
          Experience the power of our worldwide network, quality assurance programs, and industry-leading certifications.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Global Reach */}
          <div className="bg-[#F8F9FA] rounded-xl p-8 shadow-lg text-center flex flex-col h-full border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex justify-center mb-6">
              <img src={globeIcon} alt="Globe" className="w-11 h-11" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#0054A6]">Global Reach</h3>
            <p className="mb-6 flex-grow text-[#555555] leading-relaxed">
              Access to 410 depots across 89 countries, providing unparalleled convenience and competitive pricing worldwide.
            </p>
            <div className="mt-auto">
              <div className="text-5xl font-bold text-[#0054A6] mb-1">89</div>
              <div className="text-[#666666] font-medium">Countries Served</div>
            </div>
          </div>
          
          {/* Buyers Assurance */}
          <div className="bg-[#F8F9FA] rounded-xl p-8 shadow-lg text-center flex flex-col h-full border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex justify-center mb-6">
              <img src={shieldIcon} alt="Shield" className="w-11 h-11" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#0054A6]">Buyers Assurance Program</h3>
            <p className="mb-6 flex-grow text-[#555555] leading-relaxed">
              Every container undergoes rigorous inspection and certification processes to ensure quality and reliability.
            </p>
            <div className="mt-auto">
              <div className="text-5xl font-bold text-[#0054A6] mb-1">100%</div>
              <div className="text-[#666666] font-medium">Quality Assurance</div>
            </div>
          </div>
          
          {/* IICL Certification */}
          <div className="bg-[#F8F9FA] rounded-xl p-8 shadow-lg text-center flex flex-col h-full border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex justify-center mb-6">
              <img src={awardIcon} alt="Award" className="w-11 h-11" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#0054A6]">IICL Certification</h3>
            <p className="mb-6 flex-grow text-[#555555] leading-relaxed">
              The pinnacle of shipping container quality and reliability in the global logistics industry.
            </p>
            <div className="mt-auto">
              <div className="text-5xl font-bold text-[#0054A6] mb-1">1.39M+</div>
              <div className="text-[#666666] font-medium">Certified Containers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import containerGuideImage from '@assets/Container-Guide_1752776996742.png';
import OptimizedHeroImage from '../OptimizedHeroImage';

export default function Hero() {
  return (
    <OptimizedHeroImage 
      src={containerGuideImage}
      className="text-white py-20 md:py-32 min-h-[600px] flex items-center"
      fallbackColor="from-[#001937] via-[#001937] to-[#002450]"
    >
      <div className="container mx-auto px-4 w-full">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
            Buyer's Guide: Revolutionizing Global Container Solutions
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-3xl drop-shadow-md">
            Transform your container trading experience with access to over 1.39 million containers across 410 depots in 89 countries.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="#container-types" 
              className="bg-[#00A651] hover:bg-[#008A45] text-white font-semibold px-8 py-4 rounded-lg transition duration-300 shadow-lg text-lg"
            >
              Explore Container Types
            </a>
            <a 
              href="#faq" 
              className="bg-white hover:bg-gray-100 text-[#0054A6] font-semibold px-8 py-4 rounded-lg transition duration-300 shadow-lg text-lg"
            >
              View FAQs
            </a>
          </div>
        </div>
      </div>
    </OptimizedHeroImage>
  );
}
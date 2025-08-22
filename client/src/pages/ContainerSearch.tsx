import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdvancedContainerSearch from '@/components/AdvancedContainerSearch';
import { Container, Search, Filter, MapPin } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import { useTranslation } from 'react-i18next';

export default function ContainerSearch() {
  useSEO({
    title: "Search Containers - Find Available Containers Worldwide | GCE",
    description: "Search and find available shipping containers worldwide by location, type, condition, and price. Advanced filters for precise results.",
    keywords: ["search containers", "find containers", "container availability", "container search engine", "locate containers"]
  });
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Container Search - Global Container Exchange';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Search className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('search.title', 'Find Your Perfect Container')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('search.subtitle', 'Search through over 1.39 million containers across 410 depots worldwide with our intelligent search system')}
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <Container className="h-6 w-6" />
                <span>1.39M+ Containers</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-6 w-6" />
                <span>410 Depot Locations</span>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-6 w-6" />
                <span>Advanced Filtering</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Interface */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdvancedContainerSearch />
        </div>
      </div>

      {/* Search Tips Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('search.tips.title', 'Search Tips & Best Practices')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('search.tips.subtitle', 'Get the most out of your container search with these helpful tips')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Location-Based Search</h3>
              <p className="text-gray-600">
                Use city names, ZIP codes, or state abbreviations to find containers near your location. 
                Our proximity search shows distances from your specified location.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Filter className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Smart Filtering</h3>
              <p className="text-gray-600">
                Combine multiple filters like container type, condition, and features to narrow down 
                results. Use price range sliders for budget-specific searches.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Container className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Container Specifications</h3>
              <p className="text-gray-600">
                Search by specific features like "double door," "high cube," or "refrigerated" 
                to find containers that meet your exact requirements.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
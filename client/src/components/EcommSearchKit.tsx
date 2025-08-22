import { useState } from "react";
import { useLocation } from 'wouter';
import { 
  Accordion,
  AccordionContent,
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search, ChevronDown, ChevronUp, ArrowRight, Navigation } from "lucide-react";
import { LuContainer } from 'react-icons/lu';
import { useGeolocationSearch } from "@/hooks/useGeolocationSearch";
import NearestDepotMap from "@/components/NearestDepotMap";
import ContainerFilters from "@/components/ContainerFilters";
import ContainerCarousel from "@/components/ContainerCarousel";
import BuyContainerButton from "@/components/BuyContainerButton";
import { FeatureGate, FeatureButton } from "@/components/FeatureGate";
import { useSubscription } from "@/hooks/useSubscription";
import AddToCartConfirmModal from "@/components/AddToCartConfirmModal";
import { useSimpleCart } from "@/hooks/useSimpleCart";
import { useToast } from "@/hooks/use-toast";
import visaIcon from "@assets/Visa.png";
import mastercardIcon from "@assets/MasterCard.png";
import amexIcon from "@assets/Amex.png";
import discoverIcon from "@assets/Discover.png";
import applePayIcon from "@assets/ApplePay.png";
import googlePayIcon from "@assets/Google-Pay.png";

// Function to get correct container title based on type, condition, and SKU
const getContainerTitle = (type: string, condition: string, sku?: string) => {
  if (!type || !condition) return 'Container';
  
  const skuLower = sku?.toLowerCase() || '';
  let title = `${type} Container - ${condition}`;
  
  // Add special type descriptions based on SKU
  if (skuLower.includes('sd') || skuLower.includes('sidedoor')) {
    title = `${type} Side Door Container - ${condition}`;
  } else if (skuLower.includes('dd') || skuLower.includes('doubledoor')) {
    title = `${type} Double Door Container - ${condition}`;
  } else if (skuLower.includes('ot') || skuLower.includes('opentop')) {
    title = `${type} Open Top Container - ${condition}`;
  } else if (skuLower.includes('rf') || skuLower.includes('reefer')) {
    title = `${type} Refrigerated Container - ${condition}`;
  }
  
  return title;
};

// Function to get correct container image based on type and condition
const getContainerImage = (type: string, condition: string, sku?: string) => {
  if (!type || !condition) return '/attached_assets/Container.png';
  
  // Normalize condition text for matching
  const normalizedCondition = condition.toLowerCase().replace(/\s+/g, '');
  const containerType = type.toLowerCase();
  const skuLower = sku?.toLowerCase() || '';
  
  console.log('getContainerImage called with:', { type, condition, sku, normalizedCondition, containerType });
  


  // Check for special container types in SKU
  const isDoubleDoor = skuLower.includes('dd') || skuLower.includes('doubledoor');
  const isOpenTop = skuLower.includes('ot') || skuLower.includes('opentop');
  const isRefrigerated = skuLower.includes('rf') || skuLower.includes('reefer');
  const isSideDoor = skuLower.includes('sd') || skuLower.includes('sidedoor');
  
  // 20DC container mappings
  if (containerType === '20dc') {
    // Special types first
    if (isRefrigerated) {
      if (normalizedCondition === 'cargoworthy') return '/attached_assets/20RF-CW/20GP-RF-1.png';
      if (normalizedCondition === 'windandwatertight') return '/attached_assets/20RF-WWT/20RF-WWT.png';
      if (normalizedCondition === 'iicl') return '/attached_assets/20RF-New/20GP-RF.png';
      return '/attached_assets/20RF-New/20GP-RF.png';
    }
    if (isOpenTop) {
      if (normalizedCondition === 'cargoworthy') return '/attached_assets/20OT-CW/20GP-OT-CW.png';
      if (normalizedCondition === 'windandwatertight') return '/attached_assets/20OT-WWT/20OT-WWT.png';
      return '/attached_assets/20OT-IICL/20OT-IICL.png';
    }
    if (isDoubleDoor) return '/attached_assets/20DD-New/20GP-Doubledoor.png';
    if (isSideDoor) return '/attached_assets/20SD-New/20GP-Multi-sidedoor.png';
    
    // Standard 20DC conditions
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/20GP-New/20GP-New.png';
      case 'iicl': return '/attached_assets/20GP-IICL/20GP-IICL.png';
      case 'cargoworthy': return '/attached_assets/20GP-Cw/20GP CW.png';
      case 'windandwatertight': return '/attached_assets/20GP-WWT/20GP-WWT.png';
      case 'asis': return '/attached_assets/40GP-AS-IS/40GPAS-IS.png';
      default: return '/attached_assets/20GP-New/20GP-New.png';
    }
  }
  
  // 20HC container mappings
  if (containerType === '20hc') {
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/20HC-New/20HC-Brandnew.png';
      case 'iicl': return '/attached_assets/20GP-IICL/20GP-IICL.png';
      case 'cargoworthy': return '/attached_assets/20GP-Cw/20GP CW.png';
      case 'windandwatertight': return '/attached_assets/20GP-WWT/20GP-WWT.png';
      default: return '/attached_assets/20HC-New/20HC-Brandnew.png';
    }
  }
  
  // 40DC container mappings
  if (containerType === '40dc') {
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/40GP-New/40GP-Brandnew.png';
      case 'iicl': return '/attached_assets/40GP-New/40GP-Brandnew.png';
      case 'cargoworthy': return '/attached_assets/40GP-CW/40GP-CW-2.png';
      case 'windandwatertight': return '/attached_assets/40GP-WWT/40GP-WWT.png';
      case 'asis': return '/attached_assets/40GP-AS-IS/40GPAS-IS.png';
      default: return '/attached_assets/40GP-New/40GP-Brandnew.png';
    }
  }
  
  // 40HC container mappings
  if (containerType === '40hc') {
    // Special types first
    if (isRefrigerated) {
      if (normalizedCondition === 'cargoworthy') return '/attached_assets/40HC-RF-CW/40HC-RF-CW.png';
      if (normalizedCondition === 'windandwatertight') return '/attached_assets/40HC-RF-WWT/40HC-RF-WWT.png';
      if (normalizedCondition === 'asis') return '/attached_assets/40HC-RF-CW/40HC-RF-CW.png';
      return '/attached_assets/40HC-RF-New/40HC-RF.png';
    }
    if (isOpenTop) {
      if (normalizedCondition === 'cargoworthy') return '/attached_assets/40HC-OT-CW/40HC-OT-CW.png';
      if (normalizedCondition === 'windandwatertight') return '/attached_assets/40HC-OT-WWT/40HC-OT-WWT.png';
      return '/attached_assets/40HC-OT-New/40HC-OT-Brandnew.png';
    }
    if (isDoubleDoor) return '/attached_assets/40HC-DD-New/40GP-Doubledoor.png';
    if (isSideDoor) return '/attached_assets/40HC-SD-New/40HC-Multi-sidedoor.png';
    
    // Standard 40HC conditions
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/40HC-New/40HC New.png';
      case 'iicl': return '/attached_assets/40HC-IICL/40HC-IICL.png';
      case 'cargoworthy': return '/attached_assets/40HC-CW/40HC-CW.png';
      case 'windandwatertight': return '/attached_assets/40HC-WWT/40HC-WWT.png';
      case 'asis': return '/attached_assets/40HC-AS-IS/40HCAS-IS.png';
      default: return '/attached_assets/40HC-New/40HC New.png';
    }
  }
  
  // 45HC container mappings
  if (containerType === '45hc') {
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/45HC-New/45HC.png';
      case 'iicl': return '/attached_assets/45HC-IICL/45HC-IICL.png';
      case 'cargoworthy': return '/attached_assets/45HC-CW/45HC-CW.png';
      case 'windandwatertight': return '/attached_assets/45HC-WWT/45HC-WWT.png';
      default: return '/attached_assets/45HC-New/45HC.png';
    }
  }
  
  // 53HC container mappings
  if (containerType === '53hc') {
    if (isOpenTop) return '/attached_assets/53HC-OT-New/53HC-OT-New.png';
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/53HC-New/53HC-Brandnew.png';
      default: return '/attached_assets/53HC-New/53HC-Brandnew.png';
    }
  }
  
  // Default fallback
  return '/attached_assets/Container.png';
};

// 20GP DoubleDoor carousel images
import doubleDoor1 from "@assets/20DD-New/20GP-Doubledoor.png";
import doubleDoor2 from "@assets/20DD-New/20GP-Doubledoor-2.png";
import doubleDoor3 from "@assets/20DD-New/20GP-Doubledoor-3.png";
import doubleDoor4 from "@assets/20DD-New/20GP-Doubledoor-4.png";
import doubleDoor5 from "@assets/20DD-New/20GP-Doubledoor-5.png";
import doubleDoor6 from "@assets/20DD-New/20GP-Doubledoor-6.png";
import doubleDoor7 from "@assets/20DD-New/20GP-Doubledoor-7.png";
import doubleDoor8 from "@assets/20DD-New/20GP-Doubledoor-8.png";

// DoubleDoor images array for carousel
const doubleDoorImages = [
  doubleDoor1,
  doubleDoor2, 
  doubleDoor3,
  doubleDoor4,
  doubleDoor5,
  doubleDoor6,
  doubleDoor7,
  doubleDoor8
];
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SearchQuery {
  query: string;
  containerSize: string;
  containerType: string;
  containerCondition: string;
  city: string;
  postalCode: string;
  searchWithinRadius: boolean;
  searchRadius: string;
  availability: string;
}

// Authentic container data from CSV file
const containerSizes = [
  { id: "20DC", name: "20' Dry Container" },
  { id: "20HC", name: "20' High Cube" },
  { id: "40DC", name: "40' Dry Container" },
  { id: "40HC", name: "40' High Cube" },
  { id: "45HC", name: "45' High Cube" },
  { id: "53HC", name: "53' High Cube" }
];

const containerTypes = [
  { id: "Standard Container", name: "Standard Container" },
  { id: "Full Open Side", name: "Full Open Side" }
];

const containerConditions = [
  { id: "AS IS", name: "AS IS" },
  { id: "Brand New", name: "Brand New" },
  { id: "Cargo Worthy", name: "Cargo Worthy" },
  { id: "IICL", name: "IICL" },
  { id: "Wind and Water Tight", name: "Wind and Water Tight" }
];



export default function EcommSearchKit() {

  
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    query: "",
    containerSize: "",
    containerType: "",
    containerCondition: "",
    city: "",
    postalCode: "",
    searchWithinRadius: false,
    searchRadius: "50",
    availability: "all"
  });

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [uniqueDepots, setUniqueDepots] = useState<any[]>([]);

  const [nearestDepotResult, setNearestDepotResult] = useState<any>(null);
  
  // Cart functionality state - using hybrid cart system
  const [showAddToCartConfirm, setShowAddToCartConfirm] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<any>(null);
  const { toast } = useToast();
  const { addToCart } = useSimpleCart();

  // Initialize geolocation search functionality
  const {
    isLocationLoading,
    locationError,
    isSearching: isGeoSearching,
    searchResults: geoSearchResults,
    searchNearMe,
    resetSearch
  } = useGeolocationSearch();

  // Add to cart handler using hybrid cart system
  const handleAddToCart = async (containerData: any) => {
    try {
      setPendingCartItem(containerData);
      
      const result = await addToCart(containerData);
      
      if (result && result.success) {
        setShowAddToCartConfirm(true);
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add container to cart. Please try again.",
        variant: "destructive",
      });
      setPendingCartItem(null);
    }
  };

  const [, setLocation] = useLocation();
  
  const handleProceedToCart = () => {
    console.log('Proceeding to cart');
    setShowAddToCartConfirm(false);
    setPendingCartItem(null);
    // Use React navigation instead of window.location for faster transitions
    setLocation('/cart');
  };

  const handleContinueShopping = () => {
    console.log('Continuing shopping');
    setShowAddToCartConfirm(false);
    setPendingCartItem(null);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery({
      ...searchQuery,
      query: value,
      postalCode: value // Also set postalCode for consistency
    });
  };

  const handleContainerTypeChange = (checked: boolean | "indeterminate", type: string) => {
    if (checked) {
      setSearchQuery({
        ...searchQuery,
        containerType: type
      });
    } else {
      setSearchQuery({
        ...searchQuery,
        containerType: ""
      });
    }
  };

  const handleConditionChange = (checked: boolean | "indeterminate", condition: string) => {
    if (checked) {
      setSearchQuery({
        ...searchQuery,
        containerCondition: condition
      });
    } else {
      setSearchQuery({
        ...searchQuery,
        containerCondition: ""
      });
    }
  };

  const handleSearch = async () => {
    // Check if the query looks like a zip code and auto-enable location search
    const zipCodePattern = /^\b(\d{5}(-\d{4})?|[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d)\b$/;
    // Check if the query looks like a city name (letters, spaces, and common city characters)
    const cityPattern = /^[a-zA-Z\s\-'.,]+$/;
    let enhancedQuery = { ...searchQuery };
    
    if (searchQuery.query && zipCodePattern.test(searchQuery.query.trim()) && !searchQuery.postalCode) {
      // Auto-detected zip code in main search - enable location search
      enhancedQuery = {
        ...searchQuery,
        postalCode: searchQuery.query.trim(),
        searchWithinRadius: true,
        searchRadius: "10000", // Search within 10000 miles to find nearest depot
        query: "" // Clear the query since we're using it as location
      };
      console.log('Auto-detected zip code, enabling nearest depot search:', enhancedQuery.postalCode);
    } else if (searchQuery.query && cityPattern.test(searchQuery.query.trim()) && !searchQuery.city && searchQuery.query.length > 2) {
      // Auto-detected city name in main search - enable location search
      enhancedQuery = {
        ...searchQuery,
        city: searchQuery.query.trim(),
        searchWithinRadius: true,
        searchRadius: "10000", // Search within 10000 miles to find nearest depot
        query: "" // Clear the query since we're using it as location
      };
      console.log('Auto-detected city name, enabling nearest depot search:', enhancedQuery.city);
    } else if ((searchQuery.postalCode || searchQuery.city) && searchQuery.searchWithinRadius) {
      // Use expanded search radius for location searches to find nearest depot
      enhancedQuery = {
        ...searchQuery,
        searchRadius: "10000" // Always use 10000 miles for location searches to find nearest
      };
      console.log('Using nearest depot search for location:', enhancedQuery);
    }
    
    console.log('Searching for containers with enhanced location detection:', enhancedQuery);
    
    try {
      setIsLoading(true);
      
      // Build API query parameters - for zip code searches, show all containers from nearest depot
      const params = new URLSearchParams();
      
      if (enhancedQuery.postalCode) {
        // For postal code searches, only pass the postal code to get all containers from nearest depot
        params.append('postalCode', enhancedQuery.postalCode);
        params.append('radius', 'true');
        params.append('radiusMiles', '2000'); // Production-ready 2000-mile radius for North America coverage
        params.append('showAllFromNearestDepot', 'true'); // Flag to show all containers from nearest depot
      } else {
        // For other searches, use regular filtering
        if (enhancedQuery.query) params.append('query', enhancedQuery.query);
        if (enhancedQuery.containerType) params.append('types', enhancedQuery.containerType);
        if (enhancedQuery.containerCondition) params.append('conditions', enhancedQuery.containerCondition);
        // Region filter removed - using basic location filtering only
        if (enhancedQuery.city) params.append('city', enhancedQuery.city);
        // Price filters removed - displaying all available containers
      }
      
      const response = await fetch(`/api/containers?${params.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('Search results:', data);
        const containers = data.containers || [];
        setSearchResults(containers);
        setUniqueDepots([]);
        setHasSearched(true);
      } else {
        console.error('Search failed:', data.message);
        setSearchResults([]);
        setUniqueDepots([]);
        setHasSearched(true);
      }
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNearestDepot = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/containers/nearest-depot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zipCode: searchQuery.query,
          postalCode: searchQuery.postalCode,
          containerSize: searchQuery.containerSize,
          containerType: searchQuery.containerType,
          containerCondition: searchQuery.containerCondition
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setSearchResults(data.containers);
        setHasSearched(true);
        setNearestDepotResult({
          userLocation: data.userLocation,
          nearestDepot: data.nearestDepot
        });
        
        // Store the searched postal code for cart distance calculations
        const actualPostalCode = searchQuery.postalCode || searchQuery.query;
        if (actualPostalCode) {
          try {
            localStorage.setItem('gce_customer_zipcode', actualPostalCode.trim());
            localStorage.setItem('gce_postal_code', actualPostalCode.trim());
            localStorage.setItem('gce_search_zipcode', actualPostalCode.trim());
            console.log('📍 Stored customer postal code for cart calculations:', actualPostalCode.trim());
          } catch (error) {
            console.warn('Failed to store postal code:', error);
          }
        }
        
        console.log(`Found ${data.totalFound} containers at nearest depot: ${data.nearestDepot.name} (${data.nearestDepot.distance} miles)`);
      } else {
        console.error('Nearest depot search failed:', data.error);
        setSearchResults([]);
        setHasSearched(true);
        setNearestDepotResult(null);
      }
    } catch (error) {
      console.error('Error finding nearest depot:', error);
      setSearchResults([]);
      setHasSearched(true);
      setNearestDepotResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    const resetQuery = {
      query: "",
      containerSize: "",
      containerType: "",
      containerCondition: "",
      // region filter removed
      city: "",
      postalCode: "",
      searchWithinRadius: false,
      searchRadius: "50",
      // price filters removed
      availability: "all"
    };
    setSearchQuery(resetQuery);
    setNearestDepotResult(null);
    resetSearch();
  };

  return (
    <section id="search-section" className="py-12 bg-white" style={{marginTop: '30px'}}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-black mb-4">
            Find Your Premium Container
          </h2>
          <p className="text-lg text-gray-600 font-medium">Advanced Container Search</p>
        </div>

        <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#001937] to-[#4a90e2] rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Step 1: Location Input */}
            <div className="mb-6">
              <h3 className="text-lg text-white mb-3"><span className="font-semibold text-[#42d1bd]">Step 1:</span> Enter Your Location</h3>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  id="search-query"
                  value={searchQuery.query}
                  onChange={handleSearchQueryChange}
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#42d1bd] focus:border-[#42d1bd]"
                  placeholder="Enter zip code or postal code (e.g., T8N5Y1, 90210)"
                />
              </div>
            </div>
          
          {/* Step 2: Container Filters */}
          <div className="mb-6">
            <h3 className="text-lg text-white mb-3"><span className="font-semibold text-[#42d1bd]">Step 2:</span> Select Container Specifications</h3>
            <ContainerFilters
              containerSize={searchQuery.containerSize}
              containerType={searchQuery.containerType}
              containerCondition={searchQuery.containerCondition}
              onSizeChange={(value) => setSearchQuery(prev => ({ ...prev, containerSize: value }))}
              onTypeChange={(value) => setSearchQuery(prev => ({ ...prev, containerType: value }))}
              onConditionChange={(value) => setSearchQuery(prev => ({ ...prev, containerCondition: value }))}
            />
          </div>



          {/* Step 3: Search Action */}
          <div className="mb-6">
            <h3 className="text-lg text-white mb-3"><span className="font-semibold text-[#42d1bd]">Step 3:</span> Find Available Containers</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 px-2 sm:px-0">
              <Button
                type="button"
                onClick={handleNearestDepot}
                disabled={isLoading || !searchQuery.query}
                className="flex items-center text-white px-3 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 border border-transparent rounded-md shadow-sm bg-[#001937] hover:bg-[#42d1bd] focus:ring-2 focus:ring-offset-2 focus:ring-[#42d1bd] text-sm sm:text-base md:text-lg font-semibold max-w-[90vw] sm:max-w-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-1 sm:mr-2"></div>
                    <span className="hidden xs:inline">Finding Nearest Depot...</span>
                    <span className="xs:hidden">Finding...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Find Nearest Depot & Available Containers</span>
                    <span className="sm:hidden">Find Nearest Depot</span>
                  </>
                )}
              </Button>
              
              <FeatureButton
                feature="exportData"
                onClick={() => {
                  // Export search results functionality
                  console.log('Exporting search results...');
                }}
                variant="outline"
                className="px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base max-w-[40vw] sm:max-w-none"
              >
                <span className="hidden sm:inline">Export Results</span>
                <span className="sm:hidden">Export</span>
              </FeatureButton>
            </div>
          </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold text-[#42d1bd]">1.4M+</div>
                <div className="text-sm text-white/90">Containers Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold text-[#42d1bd]">410</div>
                <div className="text-sm text-white/90">Global Depots</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl font-bold text-[#42d1bd]">89</div>
                <div className="text-sm text-white/90">Countries Served</div>
              </div>
            </div>
        </div>

        {/* Search Results Section */}
        {(isLoading || hasSearched) && (
          <div className="mt-8 max-w-6xl mx-auto">
            {isLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#42d1bd]"></div>
                <p className="mt-2 text-[#001937]">Searching for containers...</p>
              </div>
            )}

            {!isLoading && hasSearched && (
              <div>
                {/* Mobile Layout: Stack header and buttons */}
                <div className="block sm:hidden mb-6 space-y-4">
                  <h3 className="text-xl font-bold text-[#001937] text-center">
                    {searchResults.length > 0 
                      ? `Found ${searchResults.length} Container${searchResults.length !== 1 ? 's' : ''}`
                      : 'No Containers Found'
                    }
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    <FeatureButton
                      feature="priceAnalytics"
                      onClick={() => {
                        console.log('Showing price analytics...');
                      }}
                      variant="outline"
                      className="w-full text-sm py-2"
                    >
                      View Price Analytics
                    </FeatureButton>
                    <FeatureButton
                      feature="bulkOperations"
                      onClick={() => {
                        console.log('Enabling bulk operations...');
                      }}
                      variant="outline"
                      className="w-full text-sm py-2"
                    >
                      Bulk Select
                    </FeatureButton>
                    {searchResults.length > 0 && (
                      <button
                        onClick={() => {
                          setSearchResults([]);
                          setHasSearched(false);
                        }}
                        className="w-full text-[#42d1bd] hover:text-[#001937] text-sm px-3 py-2 border border-gray-300 rounded"
                      >
                        Clear Results
                      </button>
                    )}
                  </div>
                </div>

                {/* Desktop Layout: Horizontal */}
                <div className="hidden sm:flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-[#001937]">
                    {searchResults.length > 0 
                      ? `Found ${searchResults.length} Container${searchResults.length !== 1 ? 's' : ''}`
                      : 'No Containers Found'
                    }
                  </h3>
                  <div className="flex gap-3">
                    <FeatureButton
                      feature="priceAnalytics"
                      onClick={() => {
                        console.log('Showing price analytics...');
                      }}
                      variant="outline"
                    >
                      View Price Analytics
                    </FeatureButton>
                    <FeatureButton
                      feature="bulkOperations"
                      onClick={() => {
                        console.log('Enabling bulk operations...');
                      }}
                      variant="outline"
                    >
                      Bulk Select
                    </FeatureButton>
                    {searchResults.length > 0 && (
                      <button
                        onClick={() => {
                          setSearchResults([]);
                          setHasSearched(false);
                        }}
                        className="text-[#42d1bd] hover:text-[#001937] text-sm px-3 py-1 border border-gray-300 rounded"
                      >
                        Clear Results
                      </button>
                    )}
                  </div>
                </div>

                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {searchResults.map((container) => (
                      <div
                        key={container.id}
                        className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
                      >
                        {/* Mobile Layout: Stack vertically */}
                        <div className="block sm:hidden">
                          {/* Container Image - Full width on mobile */}
                          <div className="w-full">
                            <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
                              <img 
                                src={getContainerImage(container.type, container.condition, container.sku)}
                                alt={getContainerTitle(container.type, container.condition, container.sku)}
                                className="w-full h-full object-contain rounded-lg shadow-sm"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  console.log('Mobile image failed to load:', target.src, 'for container:', container.sku, 'type:', container.type, 'condition:', container.condition);
                                  target.src = '/attached_assets/Container.png';
                                }}
                                onLoad={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  console.log('Mobile image loaded successfully:', target.src);
                                }}
                              />
                            </div>
                          </div>
                          
                          {/* Container details - Full width on mobile */}
                          <div className="w-full p-4 space-y-4">
                            <div className="space-y-3">
                              <div className="flex flex-col space-y-2">
                                <h4 className="text-lg font-semibold text-[#001937]">{getContainerTitle(container.type, container.condition, container.sku)}</h4>
                                <div className="flex justify-between items-center">
                                  <span className={`px-3 py-1 text-sm rounded-full ${
                                    container.condition === 'Brand New' 
                                      ? 'bg-green-100 text-green-800'
                                      : container.condition === 'IICL' || container.condition === 'Cargo Worthy'
                                      ? 'bg-blue-100 text-blue-800'
                                      : container.condition === 'Wind and Water Tight'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {container.condition}
                                  </span>
                                  <div className="text-right">
                                    <div className="text-sm text-blue-800 mb-1">{container.sku}</div>
                                    <div className="text-xl font-bold text-[#42d1bd]">
                                      ${parseFloat(container.price).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center text-sm text-gray-700">
                                  <span className="w-4 h-4 mr-2">📍</span>
                                  {container.depot_name === container.city ? container.city : `${container.depot_name} - ${container.city}`}
                                </div>
                                <div className="flex items-center text-sm text-gray-700">
                                  <LuContainer className="w-4 h-4 mr-2" />
                                  {getContainerTitle(container.type, container.condition, container.sku)}
                                </div>
                                {container.shipping && (
                                  <div className="flex items-center text-sm text-green-600">
                                    <span className="w-4 h-4 mr-2">🚚</span>
                                    Shipping Available
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Payment info and buttons - Mobile */}
                            <div className="pt-4 border-t border-gray-100 space-y-3">
                              <div className="text-sm">
                                <div className="font-bold text-blue-600 mb-2">We proudly accept the following payment formats:</div>
                                {/* Payment method icons - Mobile friendly grid */}
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                  <img src={visaIcon} alt="Visa" className="h-6 w-auto mx-auto" />
                                  <img src={mastercardIcon} alt="Mastercard" className="h-6 w-auto mx-auto" />
                                  <img src={amexIcon} alt="American Express" className="h-6 w-auto mx-auto" />
                                  <img src={discoverIcon} alt="Discover" className="h-6 w-auto mx-auto" />
                                  <img src={applePayIcon} alt="Apple Pay" className="h-6 w-auto mx-auto" />
                                  <img src={googlePayIcon} alt="Google Pay" className="h-6 w-auto mx-auto" />
                                </div>
                              </div>
                              
                              {/* Add to Cart button - Full width on mobile */}
                              <Button 
                                onClick={() => {
                                  const containerData = {
                                    sku: container.sku,
                                    type: container.type,
                                    condition: container.condition,
                                    price: parseFloat(container.price),
                                    depot_name: container.depot_name,
                                    city: container.city,
                                    state: container.state
                                  };

                                  handleAddToCart(containerData);
                                }}
                                className="w-full bg-[#001937] hover:bg-[#42d1bd] text-white py-3 text-lg font-semibold"
                              >
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout: Horizontal */}
                        <div className="hidden sm:flex flex-row">
                          {/* Left side - Container Image */}
                          <div className="w-1/3 flex-shrink-0">
                            <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
                              <img 
                                src={getContainerImage(container.type, container.condition, container.sku)}
                                alt={getContainerTitle(container.type, container.condition, container.sku)}
                                className="w-full h-full object-contain rounded-lg shadow-sm"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  console.log('Desktop image failed to load:', target.src, 'for container:', container.sku, 'type:', container.type, 'condition:', container.condition);
                                  target.src = '/attached_assets/Container.png';
                                }}
                                onLoad={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  console.log('Desktop image loaded successfully:', target.src);
                                }}
                              />
                            </div>
                          </div>
                          
                          {/* Right side - Container details */}
                          <div className="w-2/3 flex flex-col justify-between p-6">
                            <div>
                              <div className="mb-3">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="text-xl font-semibold text-[#001937] mb-2">{getContainerTitle(container.type, container.condition, container.sku)}</h4>
                                    <span className={`px-3 py-1 text-sm rounded-full ${
                                      container.condition === 'Brand New' 
                                        ? 'bg-green-100 text-green-800'
                                        : container.condition === 'IICL' || container.condition === 'Cargo Worthy'
                                        ? 'bg-blue-100 text-blue-800'
                                        : container.condition === 'Wind and Water Tight'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {container.condition}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-blue-800 mb-1">
                                      {container.sku}
                                    </div>
                                    <div className="text-2xl font-bold text-[#42d1bd]">
                                      ${parseFloat(container.price).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-700">
                                  <span className="w-4 h-4 mr-2">📍</span>
                                  {container.depot_name === container.city ? container.city : `${container.depot_name} - ${container.city}`}
                                </div>
                                <div className="flex items-center text-sm text-gray-700">
                                  <LuContainer className="w-4 h-4 mr-2" />
                                  {getContainerTitle(container.type, container.condition, container.sku)}
                                </div>
                                {container.shipping && (
                                  <div className="flex items-center text-sm text-green-600">
                                    <span className="w-4 h-4 mr-2">🚚</span>
                                    Shipping Available
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Bottom section - Payment info and buttons */}
                            <div className="pt-4 border-t border-gray-100">
                              <div className="text-sm mb-3">
                                <div className="font-bold text-blue-600">We proudly accept the following payment formats:</div>
                              </div>
                              <div className="flex justify-between items-center">
                                {/* Payment method icons */}
                                <div className="flex items-center gap-2">
                                  <img src={visaIcon} alt="Visa" className="h-6 w-auto" />
                                  <img src={mastercardIcon} alt="Mastercard" className="h-6 w-auto" />
                                  <img src={amexIcon} alt="American Express" className="h-6 w-auto" />
                                  <img src={discoverIcon} alt="Discover" className="h-6 w-auto" />
                                  <img src={applePayIcon} alt="Apple Pay" className="h-6 w-auto" />
                                  <img src={googlePayIcon} alt="Google Pay" className="h-6 w-auto" />
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <img 
                                    className="h-10 w-auto border border-gray-300"
                                  />
                                  <Button 
                                    onClick={() => {
                                      console.log('🖱️ Add to Cart button clicked!');
                                      const containerData = {
                                        sku: container.sku,
                                        type: container.type,
                                        condition: container.condition,
                                        price: parseFloat(container.price),
                                        depot_name: container.depot_name,
                                        city: container.city,
                                        state: container.state
                                      };
                                      console.log('📦 Container data prepared:', containerData);
                                      handleAddToCart(containerData);
                                    }}
                                    className="bg-[#001937] hover:bg-[#42d1bd] text-white px-6 py-2"
                                  >
                                    Add to Cart
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">No containers found matching your search criteria.</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters or search location.</p>
                  </div>
                )}
              </div>
            )}

            {/* Google Maps display for nearest depot when searching by postal code */}
            {nearestDepotResult && (
              <NearestDepotMap
                userLocation={nearestDepotResult.userLocation}
                depotLocation={{
                  latitude: nearestDepotResult.nearestDepot.latitude,
                  longitude: nearestDepotResult.nearestDepot.longitude,
                  name: nearestDepotResult.nearestDepot.name,
                  city: nearestDepotResult.nearestDepot.city
                }}
                distance={nearestDepotResult.nearestDepot.distance}
              />
            )}
          </div>
        )}
      </div>

      {/* Add to Cart Confirmation Modal */}
      <AddToCartConfirmModal
        isOpen={showAddToCartConfirm}
        onClose={handleContinueShopping}
        onProceedToCart={handleProceedToCart}
        onContinueShopping={handleContinueShopping}
        item={pendingCartItem}
      />
    </section>
  );
}
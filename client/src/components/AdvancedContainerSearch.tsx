import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, MapPin, Container, Truck, Star, ShoppingCart, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSimpleCart } from '@/hooks/useSimpleCart';
import { useToast } from '@/hooks/use-toast';
import AddToCartConfirmModal from '@/components/AddToCartConfirmModal';

interface SearchFilters {
  containerType: string;
  condition: string;
  location: string;
  priceRange: [number, number];
  size: string;
  features: string[];
  sortBy: string;
  proximity: number;
}

interface SearchResult {
  id: number;
  sku: string;
  type: string;
  condition: string;
  price: number;
  depot_name: string;
  city: string;
  state: string;
  image: string;
  latitude: number;
  longitude: number;
}

// Container image mapping function - restored from EcommSearchKit
const getContainerImage = (type: string, condition: string, sku?: string) => {
  if (!type || !condition) return '/attached_assets/Container.png';
  
  const normalizedCondition = condition.toLowerCase().replace(/\s+/g, '');
  const containerType = type.toLowerCase();
  const skuLower = sku?.toLowerCase() || '';
  
  // Check for special container types in SKU
  const isRefrigerated = skuLower.includes('rf') || skuLower.includes('reefer');
  const isOpenTop = skuLower.includes('ot') || skuLower.includes('opentop');
  const isDoubleDoor = skuLower.includes('dd') || skuLower.includes('doubledoor');
  const isSideDoor = skuLower.includes('sd') || skuLower.includes('sidedoor');
  
  // 20DC container mappings - using correct folder names
  if (containerType === '20dc') {
    if (isDoubleDoor) return '/attached_assets/20DD-New/20GP-Doubledoor.png';
    
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/20GP-New/20GP-New.png';
      case 'iicl': return '/attached_assets/20GP-IICL/20GP-IICL.png';
      case 'cargoworthy': return '/attached_assets/20GP-Cw/20GP CW.png';
      case 'windandwatertight': return '/attached_assets/20GP-WWT/20GP-WWT.png';
      default: return '/attached_assets/Container.png'; // Fallback to generic image
    }
  }
  
  // 40HC container mappings - using correct folder names  
  if (containerType === '40hc') {
    if (isRefrigerated) {
      if (normalizedCondition === 'cargoworthy') return '/attached_assets/40HC-RF-CW/40HC-RF-CW.png';
      return '/attached_assets/40HC-RF-New/40HC-RF-New.png';
    }
    if (isOpenTop) {
      if (normalizedCondition === 'cargoworthy') return '/attached_assets/40HC-OT-CW/40HC-OT-CW.png';
      return '/attached_assets/40HC-OT-New/40HC-OT-New.png';
    }
    if (isDoubleDoor) return '/attached_assets/40HC-DD-New/40HC-DD-New.png';
    if (isSideDoor) return '/attached_assets/40HC-SD-New/40HC-SD-New.png';
    
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/40HC-New/40HC New.png';
      case 'iicl': return '/attached_assets/40HC-IICL/40HC-IICL.png'; 
      case 'cargoworthy': return '/attached_assets/40HC-CW/e1884a70-8b5a-44fb-bbb4-98a2a5ef1a7b.JPG.png';
      case 'windandwatertight': return '/attached_assets/40HC-WWT/40HC-WWT.png';
      case 'asis': return '/attached_assets/40HC-AS-IS/40HCAS-IS.png';
      default: return '/attached_assets/Container.png'; // Fallback to generic image
    }
  }
  
  // 40DC container mappings - using correct folder names
  if (containerType === '40dc') {
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/40GP-New/40GP-Brandnew.png';
      case 'cargoworthy': return '/attached_assets/40GP-CW/40GP-CW-2.png';
      case 'windandwatertight': return '/attached_assets/40GP-WWT/40GP-WWT.png';
      case 'asis': return '/attached_assets/40GP-AS-IS/40GPAS-IS.png';
      default: return '/attached_assets/40GP-New/40GP-Brandnew.png';
    }
  }
  
  // 20HC container mappings
  if (containerType === '20hc') {
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/20HC-New/20HC-Brandnew.png';
      default: return '/attached_assets/20HC-New/20HC-Brandnew.png';
    }
  }
  
  // 45HC container mappings
  if (containerType === '45hc') {
    switch (normalizedCondition) {
      case 'brandnew': return '/attached_assets/45HC-New/45HC.png';
      case 'cargoworthy': return '/attached_assets/45HC-CW/45HC-CW.png';
      case 'iicl': return '/attached_assets/45HC-IICL/45HC-IICL.png';
      case 'windandwatertight': return '/attached_assets/45HC-WWT/45HC-WWT.png';
      default: return '/attached_assets/45HC-New/45HC.png';
    }
  }
  
  // 53HC container mappings
  if (containerType === '53hc') {
    if (isOpenTop) return '/attached_assets/53HC-OT-New/53HC-OT-New.png';
    return '/attached_assets/53HC-New/53HC-Brandnew.png';
  }
  
  return '/attached_assets/Container.png';
};

export default function AdvancedContainerSearch() {
  const { t } = useTranslation();
  const { addToCart } = useSimpleCart();
  const { toast } = useToast();
  
  console.log('🔍 AdvancedContainerSearch component rendered');
  
  const [filters, setFilters] = useState<SearchFilters>({
    containerType: '',
    condition: '',
    location: '',
    priceRange: [1000, 10000],
    size: '',
    features: [],
    sortBy: 'price',
    proximity: 50
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showAddToCartConfirm, setShowAddToCartConfirm] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<any>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Debug effect to track modal state changes
  useEffect(() => {
    console.log('Modal state changed:', { showAddToCartConfirm, pendingCartItem });
    if (showAddToCartConfirm && pendingCartItem) {
      console.log('Modal should be visible now!');
    }
  }, [showAddToCartConfirm, pendingCartItem]);

  // Extract and save zip code from search queries
  const extractAndSaveZipCode = (query: string, location: string) => {
    // Enhanced patterns for both US ZIP codes and Canadian postal codes
    const usZipPattern = /\b(\d{5}(-\d{4})?)\b/;
    const canadianPostalPattern = /\b([A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d)\b/;
    
    // Check both query and location fields for zip codes
    const queryUSMatch = query.match(usZipPattern);
    const queryCanadianMatch = query.match(canadianPostalPattern);
    const locationUSMatch = location.match(usZipPattern);
    const locationCanadianMatch = location.match(canadianPostalPattern);
    
    const extractedZip = queryUSMatch?.[0] || queryCanadianMatch?.[0] || 
                        locationUSMatch?.[0] || locationCanadianMatch?.[0];
    
    if (extractedZip) {
      console.log('✅ Extracted customer zip/postal code:', extractedZip);
      localStorage.setItem('gce_customer_zipcode', extractedZip);
      localStorage.setItem('gce_postal_code', extractedZip); // Backup key
    } else {
      console.log('⚠️ No zip/postal code found in search:', { query, location });
    }
  };

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/containers/search', filters, searchQuery],
    enabled: !!searchQuery || Object.values(filters).some(v => v && v !== '' && v !== 0),
  });

  // Save zip code when search is executed
  useEffect(() => {
    if (searchQuery || filters.location) {
      extractAndSaveZipCode(searchQuery, filters.location);
    }
  }, [searchQuery, filters.location]);

  const containerTypes = [
    { value: '20DC', label: "20' Dry Container" },
    { value: '40DC', label: "40' Dry Container" },
    { value: '20HC', label: "20' High Cube" },
    { value: '40HC', label: "40' High Cube" },
    { value: '45HC', label: "45' High Cube" },
    { value: '53HC', label: "53' High Cube" },
    { value: '20RF', label: "20' Refrigerated" },
    { value: '40RF', label: "40' Refrigerated" },
    { value: '20OT', label: "20' Open Top" },
    { value: '40OT', label: "40' Open Top" }
  ];

  const conditions = [
    { value: 'new', label: 'Brand New' },
    { value: 'one-trip', label: 'One Trip' },
    { value: 'cargo-worthy', label: 'Cargo Worthy' },
    { value: 'wind-water-tight', label: 'Wind & Water Tight' },
    { value: 'as-is', label: 'As-Is' }
  ];

  const features = [
    'Double Door',
    'Side Door',
    'Open Top',
    'Refrigerated',
    'High Cube',
    'Wind & Water Tight',
    'Cargo Worthy',
    'IICL Certified',
    'Custom Paint',
    'Lock Box'
  ];

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const resetFilters = () => {
    setFilters({
      containerType: '',
      condition: '',
      location: '',
      priceRange: [1000, 10000],
      size: '',
      features: [],
      sortBy: 'price',
      proximity: 50
    });
    setSearchQuery('');
  };

  // Cart handlers
  const handleAddToCart = async (container: SearchResult) => {
    console.log('🔥 handleAddToCart called for container:', container.sku);
    setAddingToCart(container.sku);
    
    try {
      const cartItem = {
        sku: container.sku,
        type: container.type,
        condition: container.condition,
        price: container.price,
        depot_name: container.depot_name,
        city: container.city,
        state: container.state,
        image: getContainerImage(container.type, container.condition, container.sku), // Use proper image mapping
        quantity: 1
      };

      console.log('🛒 Adding container to cart:', cartItem);
      
      // Set pending item first
      setPendingCartItem(cartItem);
      
      // Add to cart
      addToCart(cartItem);
      
      // Use flushSync to force immediate state update without batching
      flushSync(() => {
        console.log('Setting modal to open with flushSync:', cartItem);
        setShowAddToCartConfirm(true);
      });
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add container to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(null);
    }
  };

  const [, setLocation] = useLocation();
  
  const handleProceedToCart = () => {
    setShowAddToCartConfirm(false);
    setPendingCartItem(null);
    // Use React navigation instead of window.location for faster transitions
    setLocation('/cart');
  };

  const handleContinueShopping = () => {
    setShowAddToCartConfirm(false);
    setPendingCartItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('search.placeholder', 'Search containers by type, location, or specifications...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {t('search.advancedFilters', 'Advanced Filters')}
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Select value={filters.containerType} onValueChange={(value) => setFilters(prev => ({ ...prev, containerType: value }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Container Type" />
              </SelectTrigger>
              <SelectContent>
                {containerTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.condition} onValueChange={(value) => setFilters(prev => ({ ...prev, condition: value }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition.value} value={condition.value}>
                    {condition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Location (City, State, ZIP)"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-64"
            />

            <Button variant="ghost" onClick={resetFilters} size="sm">
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Search Filters
            </CardTitle>
            <CardDescription>
              Refine your search with detailed specifications and requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Price Range */}
              <div className="space-y-3">
                <Label>Price Range: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}</Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                  max={15000}
                  min={500}
                  step={250}
                  className="w-full"
                />
              </div>

              {/* Proximity Search */}
              <div className="space-y-3">
                <Label>Search Radius: {filters.proximity} miles</Label>
                <Slider
                  value={[filters.proximity]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, proximity: value[0] }))}
                  max={500}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Sort Options */}
              <div className="space-y-3">
                <Label>Sort By</Label>
                <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="condition">Condition</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Container Features */}
            <div className="space-y-3">
              <Label>Container Features & Specifications</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={filters.features.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <Label htmlFor={feature} className="text-sm font-normal">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Searching containers...</p>
          </div>
        )}

        {searchResults && Array.isArray(searchResults) && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {Array.isArray(searchResults) ? searchResults.length : 0} containers found
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                Showing results within {filters.proximity} miles
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((container: SearchResult) => (
                <Card key={container.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{container.type}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {container.city}, {container.state}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{container.condition}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={getContainerImage(container.type, container.condition, container.sku)}
                          alt={`${container.type} ${container.condition} Container`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/attached_assets/Container.png';
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-blue-600">
                          ${container.price.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>4.8</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Container className="h-3 w-3" />
                          SKU: {container.sku}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Truck className="h-3 w-3" />
                          {container.depot_name}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={(e) => {
                            console.log('🖱️ Button clicked for container:', container.sku);
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(container);
                          }}
                          disabled={addingToCart === container.sku}
                        >
                          {addingToCart === container.sku ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add to Cart Confirmation Modal */}
      {console.log('Rendering modal with state:', { showAddToCartConfirm, pendingCartItem })}
      <AddToCartConfirmModal
        isOpen={showAddToCartConfirm}
        onClose={() => setShowAddToCartConfirm(false)}
        onProceedToCart={handleProceedToCart}
        onContinueShopping={handleContinueShopping}
        item={pendingCartItem}
      />
    </div>
  );
}
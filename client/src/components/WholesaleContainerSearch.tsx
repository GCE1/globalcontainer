import React, { useState, useEffect } from "react";
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, DollarSign, Search, Container } from "lucide-react";
import { LuContainer } from 'react-icons/lu';
import AddToCartConfirmModal from "@/components/AddToCartConfirmModal";
import { useSimpleCart } from "@/hooks/useSimpleCart";

interface WholesaleContainer {
  Country: string;
  City: string;
  'Container Type': string;
  Price: string;
}

interface SearchParams {
  origin: string;
  destination: string;
}

interface WholesaleContainerSearchProps {
  onOpenCart?: () => void;
}

export default function WholesaleContainerSearch({ onOpenCart }: WholesaleContainerSearchProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: '',
    destination: ''
  });
  const [searchResults, setSearchResults] = useState<WholesaleContainer[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAddToCartConfirm, setShowAddToCartConfirm] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { addToCart } = useSimpleCart();
  const [, setLocation] = useLocation();
  
  const handleProceedToCart = () => {
    setShowAddToCartConfirm(false);
    setPendingCartItem(null);
    // Use onOpenCart prop if provided, otherwise navigate to cart page
    if (onOpenCart) {
      onOpenCart();
    } else {
      // Use React navigation instead of window.location for faster transitions
      setLocation('/cart');
    }
  };

  const handleContinueShopping = () => {
    setShowAddToCartConfirm(false);
    setPendingCartItem(null);
  };

  const getContainerThumbnail = (containerType: string) => {
    if (!containerType) return '/attached_assets/40GP-BrandNew/40GP-Brandnew.png';
    
    const type = containerType.toLowerCase();
    
    // Special handling for common abbreviations
    if (type.includes('dd') || type.includes('double door')) {
      if (type.includes('20')) {
        return '/attached_assets/20GP-DoubleDoor/20GP-Doubledoor.png';
      }
      if (type.includes('40hc')) {
        return '/attached_assets/40HC-Multi-sidedoor/40HC-Multi-sidedoor.png';
      }
      return '/attached_assets/40GP-DoubleDoor/40GP-Doubledoor.png';
    }
    
    if (type.includes('rf') || type.includes('reefer')) {
      if (type.includes('20')) {
        return '/attached_assets/20GP-RF/20GP-RF.png';
      }
      if (type.includes('40hc')) {
        return '/attached_assets/40HC-RF/40HC-RF.png';
      }
      return '/attached_assets/40GP-RF/40GP-RF.png';
    }
    
    if (type.includes('sd') || type.includes('side door')) {
      if (type.includes('20')) {
        return '/attached_assets/20GP-Full-Open-Sidedoor/20GP-Full-Open-Sidedoor.png';
      }
      if (type.includes('40hc')) {
        return '/attached_assets/40HC-Full-open-Sidedoor/40HC-Full-Open-Sidedoor.png';
      }
      return '/attached_assets/20GP-Full-Open-Sidedoor/20GP-Full-Open-Sidedoor.png';
    }
    
    if (type.includes('ot') || type.includes('open top')) {
      if (type.includes('20')) {
        return '/attached_assets/20GP-OT-CW/20GP-OT-CW.png';
      }
      if (type.includes('40hc')) {
        return '/attached_assets/40HC-OT-CW/40HC-OT-CW.png';
      }
      return '/attached_assets/40GP-OT-BrandNew/40GP-OT-Brandnew.png';
    }
    
    // 20ft containers
    if (type.includes('20') && (type.includes('gp') || type.includes('20gp'))) {
      if (type.includes('new') || type.includes('brand')) {
        return '/attached_assets/20GP-New/20GP-New.png';
      }
      if (type.includes('cw') || type.includes('cargo')) {
        return '/attached_assets/20GP-Cw/20GP CW.png';
      }
      if (type.includes('wwt') || type.includes('wind')) {
        return '/attached_assets/20GP-WWT/20GP-WWT.png';
      }
      if (type.includes('iicl')) {
        return '/attached_assets/20GP-IICL/20GP-IICL.png';
      }
      return '/attached_assets/20GP-New/20GP-New.png';
    }
    
    if (type.includes('20') && type.includes('hc')) {
      return '/attached_assets/20HC-New/20HC-Brandnew.png';
    }
    
    // 40ft containers (40DC/40GP)
    if (type.includes('40') && (type.includes('gp') || type.includes('dc') || type.includes('40gp') || type.includes('40dc'))) {
      if (type.includes('new') || type.includes('brand')) {
        return '/attached_assets/40GP-New/40GP-Brandnew.png';
      }
      if (type.includes('cw') || type.includes('cargo')) {
        return '/attached_assets/40GP-CW/40GP-CW-2.png';
      }
      if (type.includes('wwt') || type.includes('wind')) {
        return '/attached_assets/40GP-WWT/40GP-WWT.png';
      }
      if (type.includes('iicl')) {
        return '/attached_assets/40GP-New/40GP-Brandnew.png';
      }
      if (type.includes('as is') || type.includes('as-is')) {
        return '/attached_assets/40GP-AS-IS/40GPAS-IS.png';
      }
      return '/attached_assets/40GP-New/40GP-Brandnew.png';
    }
    
    if (type.includes('40') && type.includes('hc')) {
      if (type.includes('new') || type.includes('brand')) {
        return '/attached_assets/40HC-New/40HC New.png';
      }
      if (type.includes('cw') || type.includes('cargo')) {
        return '/attached_assets/40HC-CW/40HC-CW.png';
      }
      if (type.includes('wwt') || type.includes('wind')) {
        return '/attached_assets/40HC-WWT/40HC-WWT.png';
      }
      if (type.includes('iicl')) {
        return '/attached_assets/40HC-IICL/40HC-IICL.png';
      }
      if (type.includes('as is') || type.includes('as-is')) {
        return '/attached_assets/40HC-AS-IS/40HCAS-IS.png';
      }
      return '/attached_assets/40HC-New/40HC New.png';
    }
    
    // 45ft containers
    if (type.includes('45')) {
      if (type.includes('new') || type.includes('brand')) {
        return '/attached_assets/45HC-New/45HC.png';
      }
      if (type.includes('cw') || type.includes('cargo')) {
        return '/attached_assets/45HC-CW/45HC-CW.png';
      }
      if (type.includes('wwt') || type.includes('wind')) {
        return '/attached_assets/45HC-WWT/45HC-WWT.png';
      }
      if (type.includes('iicl')) {
        return '/attached_assets/45HC-IICL/45HC-IICL.png';
      }
      return '/attached_assets/45HC-New/45HC.png';
    }
    
    // 53ft containers
    if (type.includes('53')) {
      if (type.includes('ot') || type.includes('open top')) {
        return '/attached_assets/53HC-OT-New/53HC-OT-New.png';
      }
      return '/attached_assets/53HC-New/53HC-Brandnew.png';
    }
    
    // Default fallback
    return '/attached_assets/40GP-New/40GP-Brandnew.png';
  };

  // Fetch origins (countries)
  const { data: origins = [] } = useQuery({
    queryKey: ['/api/wholesale/origins'],
    retry: 1,
  });

  // Fetch destinations (cities) filtered by selected country
  const { data: destinations = [] } = useQuery({
    queryKey: ['/api/wholesale/destinations', searchParams.origin],
    queryFn: async () => {
      const url = searchParams.origin 
        ? `/api/wholesale/destinations?country=${encodeURIComponent(searchParams.origin)}`
        : '/api/wholesale/destinations';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    retry: 1,
    enabled: true, // Always enabled, but will filter by country if selected
  });

  // Search mutation
  const searchMutation = useMutation({
    mutationFn: async (params: SearchParams) => {
      const response = await fetch(`/api/wholesale/search?origin=${encodeURIComponent(params.origin)}&destination=${encodeURIComponent(params.destination)}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (data: WholesaleContainer[]) => {
      setSearchResults(data);
      setHasSearched(true);
      toast({
        title: "Search Complete",
        description: `Found ${data.length} containers matching your criteria`,
      });
    },
    onError: (error: any) => {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Unable to search containers. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
      setHasSearched(true);
    }
  });

  const handleSearch = () => {
    if (!searchParams.origin.trim() || !searchParams.destination.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both country and city to search.",
        variant: "destructive",
      });
      return;
    }
    
    searchMutation.mutate(searchParams);
  };

  const formatPrice = (price: string) => {
    if (!price) return 'N/A';
    
    // Remove any currency symbols and clean the string
    const cleanPrice = price.replace(/[^0-9.,]/g, '');
    
    if (cleanPrice.includes(',')) {
      return `$${cleanPrice}`;
    }
    
    const numPrice = parseFloat(cleanPrice);
    if (isNaN(numPrice)) return price;
    
    return `$${numPrice.toLocaleString()}`;
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-[#001937] to-[#4a90e2] text-white">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Container className="h-6 w-6" />
          Wholesale Container Search
        </CardTitle>
        <CardDescription className="text-blue-100">
          Find available wholesale containers by specifying origin and destination locations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <Label htmlFor="origin" className="text-[#33d2b9] font-medium text-sm">Country</Label>
            <Select
              value={searchParams.origin}
              onValueChange={(value) => setSearchParams(prev => ({ ...prev, origin: value, destination: '' }))}
            >
              <SelectTrigger className="bg-white text-black text-sm">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(origins) && origins.map((origin: string, index: number) => (
                  <SelectItem key={index} value={origin}>
                    {origin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="destination" className="text-[#33d2b9] font-medium text-sm">City</Label>
            <Select
              value={searchParams.destination}
              onValueChange={(value) => setSearchParams(prev => ({ ...prev, destination: value }))}
              disabled={!searchParams.origin}
            >
              <SelectTrigger className="bg-white text-black text-sm">
                <SelectValue placeholder={searchParams.origin ? "Select city" : "Select country first"} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(destinations) && destinations.map((destination: string, index: number) => (
                  <SelectItem key={index} value={destination}>
                    {destination}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 flex items-end">
            <Button 
              onClick={handleSearch}
              disabled={searchMutation.isPending}
              className="bg-[#33d2b9] hover:bg-[#2bc4a8] text-white w-full"
              size="sm"
            >
              {searchMutation.isPending ? (
                <>
                  <Search className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Wholesale Containers
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Search Results - Encapsulated within the search component */}
        {hasSearched && (
          <div className="bg-white rounded-xl p-6 shadow-md mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#001937]">
                Search Results
              </h3>
              {searchResults.length > 0 && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {searchResults.length} containers found
                </span>
              )}
            </div>
            
            {searchResults.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {searchResults.map((container, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img 
                            src={getContainerThumbnail(container['Container Type'])}
                            alt={container['Container Type']}
                            className="w-12 h-12 object-cover rounded-lg border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/attached_assets/40GP-BrandNew/40GP-Brandnew.png';
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#001937]">
                            {container['Container Type']}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {container.Country} → {container.City}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {formatPrice(container.Price)}
                        </p>
                        <Button 
                          size="sm"
                          className="mt-1 bg-[#4a90e2] hover:bg-[#3a7bc8] text-white text-xs px-3 py-1"

                          onClick={() => {
                            const cartItem = {
                              id: `wholesale_${container.Country}_${container.City}_${container['Container Type']}_${Date.now()}`,
                              sku: `WS-${container['Container Type']}-${container.City}`,
                              type: container['Container Type'],
                              condition: 'Wholesale',
                              price: container.Price,
                              quantity: 1,
                              depot_name: `${container.City} Wholesale Depot`,
                              city: container.City,
                              state: container.Country,
                              location: `${container.City}, ${container.Country}`
                            };
                            setPendingCartItem(cartItem);
                            addToCart(cartItem);
                            setShowAddToCartConfirm(true);
                          }}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <LuContainer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No wholesale containers found for your search criteria.</p>
                <p className="text-sm">Try adjusting your search parameters.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
    
    <AddToCartConfirmModal
      isOpen={showAddToCartConfirm}
      onClose={() => setShowAddToCartConfirm(false)}
      onProceedToCart={() => {
        setShowAddToCartConfirm(false);
        setLocation('/cart');
      }}
      onContinueShopping={() => setShowAddToCartConfirm(false)}
      item={pendingCartItem}
    />
    </>
  );
}
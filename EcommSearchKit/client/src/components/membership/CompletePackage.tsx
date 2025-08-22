import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Search, 
  Navigation, 
  Globe, 
  CheckCircle, 
  Star, 
  Truck, 
  Package, 
  Clock,
  Users,
  Shield,
  Zap
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface NearestDepotResult {
  depot: {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    distance: number;
  };
  containers: Array<{
    id: number;
    name: string;
    type: string;
    condition: string;
    price: string;
    sku: string;
  }>;
}

const CompletePackage = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Find nearest depot functionality
  const findNearestDepotMutation = useMutation({
    mutationFn: async (postalCode: string) => {
      const response = await fetch(`/api/containers?postalCode=${encodeURIComponent(postalCode)}&radius=true&radiusMiles=100&sortBy=distance`);
      if (!response.ok) {
        throw new Error('Failed to find nearest depot');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setIsSearching(false);
      if (data.containers && data.containers.length > 0) {
        toast({
          title: "Nearest Depot Found!",
          description: `Found ${data.containers.length} containers within 100 miles of ${searchLocation}`,
        });
      } else {
        toast({
          title: "No containers found",
          description: "Try expanding your search radius or contact us for assistance.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      setIsSearching(false);
      toast({
        title: "Search Error",
        description: "Unable to find nearest depot. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleFindNearestDepot = () => {
    if (!searchLocation.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter a ZIP code or postal code to find your nearest depot.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    findNearestDepotMutation.mutate(searchLocation.trim());
  };

  const packageFeatures = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Intelligent Location Search",
      description: "Advanced ZIP/postal code detection with 5000-mile radius coverage"
    },
    {
      icon: <Navigation className="h-8 w-8 text-green-600" />,
      title: "Nearest Depot Priority",
      description: "Automatically finds and prioritizes your closest container depot"
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-600" />,
      title: "Global Coverage",
      description: "Support for US ZIP codes and international postal codes"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Real-time Distance Calculation",
      description: "Precise mileage calculations using Haversine formula"
    },
    {
      icon: <Search className="h-8 w-8 text-red-600" />,
      title: "Advanced Search Engine",
      description: "Comprehensive inventory search with multiple filter criteria"
    },
    {
      icon: <Truck className="h-8 w-8 text-indigo-600" />,
      title: "Logistics Integration",
      description: "Seamless connection to shipping and delivery services"
    }
  ];

  const searchCapabilities = [
    "Automatic ZIP code detection in search queries",
    "100-mile default radius with 5000-mile fallback",
    "Two-tier search system for comprehensive coverage",
    "Closest depot inventory prioritization",
    "International postal code support",
    "Real-time geolocation processing"
  ];

  const membershipBenefits = [
    "Priority access to container inventory",
    "Advanced location-based search tools",
    "Dedicated customer support team",
    "Volume pricing discounts",
    "Custom shipping arrangements",
    "Real-time inventory notifications"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          Complete Package
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Advanced Container Procurement Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience our most comprehensive container search and procurement solution with 
          intelligent geolocation, nearest depot optimization, and global coverage.
        </p>
      </div>

      {/* Interactive Search Demo */}
      <Card className="mb-12 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6 text-blue-600" />
            Find Your Nearest Container Depot
          </CardTitle>
          <CardDescription>
            Try our advanced location search to find containers near you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="location-search" className="sr-only">
                ZIP or Postal Code
              </Label>
              <Input
                id="location-search"
                type="text"
                placeholder="Enter ZIP code or postal code (e.g., 75141, 80221)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="text-lg"
              />
            </div>
            <Button 
              onClick={handleFindNearestDepot}
              disabled={isSearching}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Nearest Depot
                </>
              )}
            </Button>
          </div>
          
          {findNearestDepotMutation.data && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">Search Results</span>
              </div>
              <p className="text-green-700">
                Found {findNearestDepotMutation.data.containers?.length || 0} containers 
                within 100 miles of {searchLocation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="features" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Advanced Features</TabsTrigger>
          <TabsTrigger value="search">Search Capabilities</TabsTrigger>
          <TabsTrigger value="benefits">Membership Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packageFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-6 w-6 text-blue-600" />
                Advanced Search Engine
              </CardTitle>
              <CardDescription>
                Comprehensive geolocation-powered container discovery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    Search Capabilities
                  </h4>
                  <ul className="space-y-2">
                    {searchCapabilities.map((capability, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 text-blue-800">How It Works</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                      <p className="text-sm text-blue-700">Enter ZIP/postal code in search field</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                      <p className="text-sm text-blue-700">System detects location and geocodes coordinates</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                      <p className="text-sm text-blue-700">Search within 100-mile radius for inventory</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                      <p className="text-sm text-blue-700">Fallback to 5000-mile search if needed</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</div>
                      <p className="text-sm text-blue-700">Display results prioritized by distance</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-600" />
                  Premium Membership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {membershipBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-purple-600" />
                  Enterprise Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">Dedicated account manager</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">24/7 priority support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">Custom procurement solutions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">Logistics coordination</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Technical Implementation Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-600" />
            Technical Implementation
          </CardTitle>
          <CardDescription>
            Powered by advanced geolocation technology and comprehensive data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Geocoding Service</h4>
              <p className="text-sm text-gray-600">
                Converts postal codes to precise coordinates using comprehensive mapping APIs
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Database Optimization</h4>
              <p className="text-sm text-gray-600">
                Advanced SQL queries with Haversine distance calculations for precise results
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Intelligent Fallback</h4>
              <p className="text-sm text-gray-600">
                Two-tier search system ensures inventory availability across all regions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-6">
          Join thousands of satisfied customers using our Complete Package solution
        </p>
        <Button 
          size="lg" 
          variant="secondary"
          className="bg-white text-blue-600 hover:bg-gray-100"
        >
          Contact Sales Team
        </Button>
      </div>
    </div>
  );
};

export default CompletePackage;
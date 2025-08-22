import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContainerInventoryDashboard from '@/components/ContainerInventoryDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, TrendingUp, Shield, Truck, Clock, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ContainerMarketplace() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Container Marketplace - Global Container Exchange';
  }, []);

  const marketFeatures = [
    {
      icon: Store,
      title: "Global Inventory",
      description: "Access to 1.39M+ containers across 410 depot locations worldwide"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Pricing",
      description: "Dynamic pricing based on market conditions and availability"
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "All containers inspected and certified to international standards"
    },
    {
      icon: Truck,
      title: "Logistics Support",
      description: "End-to-end delivery and placement services available"
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Streamlined purchasing with expedited delivery options"
    },
    {
      icon: Star,
      title: "Premium Service",
      description: "Dedicated support team and membership benefits"
    }
  ];

  const popularCategories = [
    { name: "20' Dry Containers", count: "125,340", trend: "+5.2%" },
    { name: "40' High Cube", count: "98,750", trend: "+3.8%" },
    { name: "40' Dry Containers", count: "87,220", trend: "+2.1%" },
    { name: "Refrigerated Units", count: "23,110", trend: "+8.9%" },
    { name: "Open Top Containers", count: "15,680", trend: "+1.5%" },
    { name: "Specialty Units", count: "12,340", trend: "+12.3%" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Store className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('marketplace.title', 'Global Container Marketplace')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('marketplace.subtitle', 'Buy, sell, and lease containers with confidence. Access the world\'s largest container inventory with real-time pricing and instant availability.')}
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <Store className="h-6 w-6" />
                <span>1.39M+ Containers</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>Real-Time Pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                <span>Quality Assured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our most in-demand container types with live inventory counts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      {category.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{category.count}</p>
                      <p className="text-sm text-gray-600">Available units</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Browse
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Market Features */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Marketplace
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced features and comprehensive services for all your container needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {marketFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Marketplace Interface */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="browse" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Container Inventory
                </h2>
                <p className="text-lg text-gray-600">
                  Browse, filter, and purchase from our extensive container inventory
                </p>
              </div>
              <TabsList>
                <TabsTrigger value="browse">Browse Inventory</TabsTrigger>
                <TabsTrigger value="analytics">Market Analytics</TabsTrigger>
                <TabsTrigger value="favorites">Saved Items</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="browse" className="space-y-6">
              <ContainerInventoryDashboard />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Trends</CardTitle>
                    <CardDescription>
                      Price and availability trends over the last 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium">Average Price Trend</p>
                          <p className="text-sm text-gray-600">30-day average</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">+2.3%</p>
                          <p className="text-sm text-gray-600">$3,245 avg</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium">Inventory Levels</p>
                          <p className="text-sm text-gray-600">Available units</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">+5.7%</p>
                          <p className="text-sm text-gray-600">1.39M units</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                        <div>
                          <p className="font-medium">Demand Index</p>
                          <p className="text-sm text-gray-600">Market activity</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-yellow-600">High</p>
                          <p className="text-sm text-gray-600">8.4/10</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Regional Insights</CardTitle>
                    <CardDescription>
                      Container availability by major regions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { region: "North America", availability: 85, change: "+3.2%" },
                        { region: "Europe", availability: 78, change: "+1.8%" },
                        { region: "Asia Pacific", availability: 92, change: "+5.1%" },
                        { region: "Latin America", availability: 71, change: "-0.5%" },
                        { region: "Middle East", availability: 89, change: "+4.3%" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-medium">{item.region}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${item.availability}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-12 text-right">{item.availability}%</span>
                            <Badge variant="secondary" className="w-16 justify-center">
                              {item.change}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Containers</CardTitle>
                  <CardDescription>
                    Containers you've saved for later consideration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No saved containers yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start browsing to save containers you're interested in
                    </p>
                    <Button onClick={() => {
                      const browseBtns = document.querySelectorAll('[data-state="inactive"]');
                      if (browseBtns[0]) (browseBtns[0] as HTMLElement).click();
                    }}>
                      Browse Inventory
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
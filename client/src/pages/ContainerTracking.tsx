import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimizedHeroImage from '@/components/OptimizedHeroImage';
import Terminal49TrackingForm from '@/components/Terminal49TrackingForm';
import { EnhancedTrackingForm, LiveTrackingResults, AlertSetupModal } from '@/components/TrackingComponents';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, Search, MapPin, Clock, Truck, Ship, AlertCircle, ArrowRight, Satellite, Bell, FileText, Package } from 'lucide-react';

export default function ContainerTracking() {
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [showAlertSetup, setShowAlertSetup] = useState(false);

  useEffect(() => {
    document.title = 'Container Tracking - Global Container Exchange';
  }, []);



  const trackingFeatures = [
    {
      icon: Satellite,
      title: "Real-Time GPS Tracking",
      description: "Live location updates with precise GPS coordinates and movement tracking"
    },
    {
      icon: Bell,
      title: "Automated Notifications",
      description: "Email and SMS alerts for status changes, arrivals, and important updates"
    },
    {
      icon: MapPin,
      title: "Route Visualization",
      description: "Interactive maps showing current location, route history, and planned path"
    },
    {
      icon: Clock,
      title: "ETA Predictions",
      description: "Accurate estimated arrival times based on real-time conditions"
    },
    {
      icon: FileText,
      title: "Documentation Access",
      description: "Digital access to shipping documents, customs forms, and certificates"
    },
    {
      icon: AlertCircle,
      title: "Exception Alerts",
      description: "Immediate notifications for delays, route changes, or security incidents"
    }
  ];







  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
        <main className="flex-grow">
        {/* Hero Section */}
        <OptimizedHeroImage 
          src="/optimized_assets/Container-Tracking-optimized.webp"
          className="text-white py-20 md:py-32 min-h-[500px] flex items-center"
          fallbackColor="from-teal-900 via-teal-800 to-slate-900"
        >
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-4xl">
              <Badge className="bg-teal-500 text-white px-4 py-2 text-sm mb-6">
                Real-Time Tracking System
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
                Container Tracking & Monitoring
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-3xl drop-shadow-md">
                Track your containers in real-time with GPS monitoring, automated alerts, and comprehensive status updates across global shipping routes.
              </p>
              
              {/* Professional Container Tracking in Hero */}
              <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-8 mb-8 shadow-2xl">
                <Terminal49TrackingForm heroStyle={true} />
              </div>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg text-lg"
                  onClick={() => document.getElementById('tracking-features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Satellite className="mr-2 h-5 w-5" />
                  View Features
                </Button>
              </div>
            </div>
          </div>
        </OptimizedHeroImage>



        {/* Track-Trace Connect Enhanced Results */}
        {trackingResult && (
          <section className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
              <LiveTrackingResults trackingResult={trackingResult} />
            </div>
          </section>
        )}

        {/* Alert Setup Modal */}
        {showAlertSetup && trackingResult && (
          <section className="py-8 bg-white">
            <div className="container mx-auto px-4">
              <AlertSetupModal 
                containerNumber={trackingResult.containerNumber}
                onSetupComplete={(success) => {
                  setShowAlertSetup(false);
                  if (success) {
                    console.log('Alerts setup successfully');
                  }
                }}
              />
            </div>
          </section>
        )}



        {/* Terminal49 Integration Section */}
        <section className="py-16 bg-gradient-to-br from-teal-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Powered by Terminal49 API
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real-time container tracking with 99%+ data milestone completion across 160+ shipping lines
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-teal-600 mb-2">160+</div>
                  <p className="text-sm font-medium text-gray-800">Shipping Lines</p>
                  <p className="text-xs text-gray-600">Global coverage</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">99%+</div>
                  <p className="text-sm font-medium text-gray-800">Data Accuracy</p>
                  <p className="text-xs text-gray-600">Milestone completion</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">&lt;1hr</div>
                  <p className="text-sm font-medium text-gray-800">Update Frequency</p>
                  <p className="text-xs text-gray-600">Critical milestones</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                  <p className="text-sm font-medium text-gray-800">Real-time Tracking</p>
                  <p className="text-xs text-gray-600">Always available</p>
                </CardContent>
              </Card>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  Supported Tracking Methods
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-teal-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Container Numbers</h4>
                    <p className="text-sm text-gray-600">Track using 11-digit container identification numbers</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Bill of Lading</h4>
                    <p className="text-sm text-gray-600">Track using shipping document reference numbers</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Booking Numbers</h4>
                    <p className="text-sm text-gray-600">Track using carrier booking references</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tracking Features Section */}
        <section id="tracking-features" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Advanced Tracking Features</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive container monitoring with real-time updates and intelligent notifications
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trackingFeatures.map((feature, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <feature.icon className="h-10 w-10 text-teal-600 mr-3" />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tracking Methods Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Tracking Methods</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Multiple ways to track your containers using various reference numbers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Static tracking method cards */}
              <Card className="h-full text-center">
                <CardHeader>
                  <Search className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                  <CardTitle className="text-lg font-bold">Container Number</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Track using unique container identification number</p>
                  <div className="space-y-2 text-sm">
                    <div><strong>Format:</strong> XXXX-123456-7</div>
                    <div><strong>Example:</strong> <code className="bg-gray-100 px-1 rounded">MSCU-1234567</code></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="h-full text-center">
                <CardHeader>
                  <Search className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                  <CardTitle className="text-lg font-bold">Bill of Lading</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Track using shipping document reference number</p>
                  <div className="space-y-2 text-sm">
                    <div><strong>Format:</strong> BOL-XXXXXXXXX</div>
                    <div><strong>Example:</strong> <code className="bg-gray-100 px-1 rounded">BOL-987654321</code></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="h-full text-center">
                <CardHeader>
                  <Search className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                  <CardTitle className="text-lg font-bold">Booking Number</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Track using carrier booking reference</p>
                  <div className="space-y-2 text-sm">
                    <div><strong>Format:</strong> BKG-XXXXXXXXX</div>
                    <div><strong>Example:</strong> <code className="bg-gray-100 px-1 rounded">BKG-456789123</code></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="h-full text-center">
                <CardHeader>
                  <Search className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                  <CardTitle className="text-lg font-bold">Seal Number</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Track using container seal identification</p>
                  <div className="space-y-2 text-sm">
                    <div><strong>Format:</strong> SEAL-XXXXXXX</div>
                    <div><strong>Example:</strong> <code className="bg-gray-100 px-1 rounded">SEAL-7891234</code></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Status Types Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Container Status Types</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding different container statuses throughout the shipping journey
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-blue-100 text-blue-800">Booked</Badge>
                  <p className="text-sm text-gray-600">Container booking confirmed</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-yellow-100 text-yellow-800">Empty Pickup</Badge>
                  <p className="text-sm text-gray-600">Empty container collected</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-green-100 text-green-800">Loaded</Badge>
                  <p className="text-sm text-gray-600">Container loaded with cargo</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-purple-100 text-purple-800">In Transit</Badge>
                  <p className="text-sm text-gray-600">Container in transport</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-indigo-100 text-indigo-800">Port Arrival</Badge>
                  <p className="text-sm text-gray-600">Arrived at destination port</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-orange-100 text-orange-800">Customs Clearance</Badge>
                  <p className="text-sm text-gray-600">Undergoing customs processing</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-emerald-100 text-emerald-800">Delivered</Badge>
                  <p className="text-sm text-gray-600">Container delivered to destination</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-gray-100 text-gray-800">Empty Return</Badge>
                  <p className="text-sm text-gray-600">Empty container returned</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Tracking Timeline Example */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Sample Tracking Timeline</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Detailed tracking history with timestamps and location updates
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                <Card className="relative">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Badge className="bg-teal-100 text-teal-800 mr-3">Departed Port</Badge>
                          <span className="text-sm text-gray-500">2025-06-08 14:30</span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">Port of Los Angeles, CA</h4>
                        <p className="text-gray-600">Container loaded on vessel MSC MARIA</p>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <Badge variant="outline" className="text-xs">
                          <Ship className="h-3 w-3 mr-1" />
                          Ocean Vessel
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Badge className="bg-teal-100 text-teal-800 mr-3">Port Operations</Badge>
                          <span className="text-sm text-gray-500">2025-06-07 16:45</span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">Los Angeles Terminal, CA</h4>
                        <p className="text-gray-600">Container inspection completed</p>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          Terminal
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Badge className="bg-teal-100 text-teal-800 mr-3">Loaded</Badge>
                          <span className="text-sm text-gray-500">2025-06-07 09:20</span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">Los Angeles Depot, CA</h4>
                        <p className="text-gray-600">Container loaded with automotive parts</p>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <Badge variant="outline" className="text-xs">
                          <Truck className="h-3 w-3 mr-1" />
                          Truck
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Badge className="bg-teal-100 text-teal-800 mr-3">Empty Pickup</Badge>
                          <span className="text-sm text-gray-500">2025-06-06 11:15</span>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1">Los Angeles Depot, CA</h4>
                        <p className="text-gray-600">Empty container collected for loading</p>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6">
                        <Badge variant="outline" className="text-xs">
                          <Truck className="h-3 w-3 mr-1" />
                          Truck
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Alert Setup & CTA Section */}
        <section id="alert-setup-section" className="py-16 bg-teal-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Tracking Your Containers</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get real-time visibility into your container shipments with automated notifications and detailed tracking
            </p>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
import { useEffect } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimizedHeroImage from '@/components/OptimizedHeroImage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Truck, MapPin, Shield, Clock, Star, ArrowRight, Globe, Route, Container, Phone, Zap } from 'lucide-react';

export default function ContainerTransport() {
  useEffect(() => {
    document.title = 'Container Transport - Global Container Exchange';
  }, []);

  const transportServices = [
    {
      title: "Door-to-Door Delivery",
      price: "From $350",
      features: ["Complete logistics management", "Origin pickup included", "Final destination delivery", "Real-time tracking"],
      description: "Full-service transport from depot to your location",
      popular: true
    },
    {
      title: "Port-to-Port Shipping", 
      price: "From $180",
      features: ["Ocean freight coordination", "Port handling included", "Documentation support", "Customs clearance"],
      description: "International shipping between major ports",
      popular: false
    },
    {
      title: "Domestic Transport",
      price: "From $200",
      features: ["Cross-country delivery", "Highway transport", "Express options available", "Flexible scheduling"],
      description: "Reliable transport within country borders",
      popular: false
    },
    {
      title: "Expedited Delivery",
      price: "From $500",
      features: ["Priority scheduling", "24/48 hour delivery", "Dedicated transport", "Emergency response"],
      description: "Rush delivery for urgent requirements",
      popular: false
    }
  ];

  const transportMethods = [
    {
      method: "Truck Transport",
      description: "Road transport for local and regional delivery",
      capacity: "1-4 containers",
      timeframe: "1-5 days",
      coverage: "Nationwide"
    },
    {
      method: "Rail Transport",
      description: "Cost-effective long-distance container transport",
      capacity: "50+ containers",
      timeframe: "3-10 days", 
      coverage: "Major rail networks"
    },
    {
      method: "Ocean Freight",
      description: "International shipping via container vessels",
      capacity: "1000+ containers",
      timeframe: "7-30 days",
      coverage: "Global ports"
    },
    {
      method: "Intermodal",
      description: "Combined transport using multiple methods",
      capacity: "Variable",
      timeframe: "2-15 days",
      coverage: "Flexible routing"
    }
  ];

  const features = [
    {
      icon: MapPin,
      title: "Global Network",
      description: "Transport services covering 410 strategically positioned depots across 89 countries worldwide"
    },
    {
      icon: Shield,
      title: "Cargo Insurance",
      description: "Comprehensive insurance coverage for containers during transport"
    },
    {
      icon: Route,
      title: "Real-Time Tracking",
      description: "GPS tracking and status updates throughout the transport journey"
    },
    {
      icon: Clock,
      title: "On-Time Delivery",
      description: "Reliable scheduling with 98% on-time delivery performance"
    },
    {
      icon: Zap,
      title: "Express Options",
      description: "Expedited transport services for urgent container deliveries"
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Round-the-clock customer support and transport coordination"
    }
  ];

  const routes = [
    { from: "Los Angeles", to: "New York", distance: "2,800 miles", time: "5-7 days", price: "$850" },
    { from: "Houston", to: "Chicago", distance: "1,100 miles", time: "3-4 days", price: "$450" },
    { from: "Miami", to: "Atlanta", distance: "650 miles", time: "2-3 days", price: "$320" },
    { from: "Seattle", to: "San Francisco", distance: "800 miles", time: "2-3 days", price: "$380" },
    { from: "Boston", to: "Washington DC", distance: "450 miles", time: "1-2 days", price: "$280" },
    { from: "Denver", to: "Phoenix", distance: "900 miles", time: "3-4 days", price: "$420" }
  ];

  const documentation = [
    "Bill of Lading",
    "Container Inspection Report", 
    "Transport Insurance Certificate",
    "Delivery Receipt",
    "Customs Documentation",
    "Route Optimization Report"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <OptimizedHeroImage 
          src="/optimized_assets/Container-Transport_1749330467948-optimized.webp"
          className="text-white py-20 md:py-32 min-h-[500px] flex items-center"
          fallbackColor="from-blue-900 via-blue-800 to-slate-900"
        >
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-4xl">
              <Badge className="bg-[#3f84ee] text-white px-4 py-2 text-sm mb-6">
                Reliable Transport Solutions
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
                Global Container Transport
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-3xl drop-shadow-md">
                Professional container transportation services across 89 countries with 410 depots worldwide, featuring real-time tracking and competitive pricing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  className="bg-[#55d2cb] hover:bg-[#41c6b4] text-white font-semibold px-8 py-4 rounded-lg text-lg"
                  onClick={() => document.getElementById('transport-services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Truck className="mr-2 h-5 w-5" />
                  View Services
                </Button>
                <Link href="/request-quote">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-2 bg-transparent hover:bg-[#33d2b9] text-[#33d2b9] hover:text-white border-[#33d2b9] px-8 py-4 rounded-lg text-lg transition duration-300 group"
                  >
                    Request Consultation
                    <i className="fas fa-arrow-right ml-2 text-[#33d2b9] group-hover:text-white"></i>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </OptimizedHeroImage>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Our Transport</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience reliable, secure, and efficient container transport with comprehensive tracking and support
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <feature.icon className="h-10 w-10 text-blue-600 mr-3" />
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

        {/* Transport Services Section */}
        <section id="transport-services" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Transport Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive transport solutions tailored to your container delivery needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {transportServices.map((service, index) => (
                <Card key={index} className={`h-full relative ${service.popular ? 'border-2 border-orange-500 shadow-lg' : 'border-2 hover:border-orange-300'} transition-colors`}>
                  {service.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-blue-600">{service.title}</CardTitle>
                    <div className="text-2xl font-bold text-green-600">{service.price}</div>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${service.popular ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-600 hover:bg-gray-700'}`}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Transport Methods Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Transport Methods</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Multiple transport options to optimize cost, speed, and efficiency
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {transportMethods.map((method, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <Truck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle className="text-lg font-bold text-center">{method.method}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    <div className="space-y-2 text-sm">
                      <div><strong>Capacity:</strong> {method.capacity}</div>
                      <div><strong>Timeframe:</strong> {method.timeframe}</div>
                      <div><strong>Coverage:</strong> {method.coverage}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Routes Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Popular Routes & Pricing</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Sample pricing for common domestic transport routes
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                      {route.from} → {route.to}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span className="font-medium">{route.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transit Time:</span>
                        <span className="font-medium">{route.time}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span>Starting Price:</span>
                        <span className="font-bold text-green-600">{route.price}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Get Detailed Quote
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Complete Documentation</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                All necessary paperwork and certifications provided with every transport
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {documentation.map((doc, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
                    <h3 className="font-medium">{doc}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Ship Your Container?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get instant quotes and schedule reliable container transport through our network of 410 depots across 89 countries
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/request-quote">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 bg-transparent hover:bg-[#33d2b9] text-[#33d2b9] hover:text-white border-[#33d2b9] px-8 py-4 text-lg transition duration-300 group"
                >
                  Request Quote
                  <i className="fas fa-arrow-right ml-2 text-[#33d2b9] group-hover:text-white"></i>
                </Button>
              </Link>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-[#55d2cb] text-[#55d2cb] hover:bg-[#55d2cb] hover:text-white px-8 py-4 text-lg transition duration-300"
              >
                Track Shipment
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
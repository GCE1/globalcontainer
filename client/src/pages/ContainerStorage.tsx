import { useEffect } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimizedHeroImage from '@/components/OptimizedHeroImage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Warehouse, Shield, MapPin, Clock, Camera, ArrowRight, Lock, Thermometer, FileText, Users, Zap } from 'lucide-react';

export default function ContainerStorage() {
  useEffect(() => {
    document.title = 'Container Storage - Global Container Exchange';
  }, []);

  const storageOptions = [
    {
      title: "Short-Term Storage",
      duration: "1-30 days",
      price: "From $8/day",
      features: ["Immediate access", "24/7 security", "Climate monitoring", "Daily rate billing"],
      description: "Perfect for temporary container holding needs",
      popular: false
    },
    {
      title: "Medium-Term Storage", 
      duration: "1-12 months",
      price: "From $180/month",
      features: ["Reduced monthly rates", "Container maintenance", "Priority access", "Flexible terms"],
      description: "Cost-effective solution for extended storage",
      popular: true
    },
    {
      title: "Long-Term Storage",
      duration: "1+ years",
      price: "From $120/month",
      features: ["Lowest monthly rates", "Annual billing discounts", "Dedicated space", "Maintenance included"],
      description: "Maximum savings for long-term storage needs",
      popular: false
    },
    {
      title: "Climate-Controlled",
      duration: "Any duration",
      price: "From $280/month",
      features: ["Temperature control", "Humidity regulation", "Air filtration", "Specialized monitoring"],
      description: "Protected environment for sensitive cargo",
      popular: false
    }
  ];

  const storageFeatures = [
    {
      icon: Shield,
      title: "24/7 Security",
      description: "Round-the-clock surveillance, access control, and security patrols at all facilities"
    },
    {
      icon: Camera,
      title: "CCTV Monitoring",
      description: "Advanced camera systems with remote monitoring and recorded footage backup"
    },
    {
      icon: Lock,
      title: "Secure Access",
      description: "Restricted access with digital keycard systems and visitor management protocols"
    },
    {
      icon: Thermometer,
      title: "Climate Control",
      description: "Temperature and humidity controlled environments for sensitive container contents"
    },
    {
      icon: MapPin,
      title: "Prime Locations",
      description: "Strategic facility locations near major ports, railways, and transportation hubs"
    },
    {
      icon: Users,
      title: "On-Site Staff",
      description: "Professional facility management teams available during business hours"
    }
  ];

  const facilitySpecs = [
    {
      location: "Port Terminal Facility",
      capacity: "2,500 containers",
      security: "Level 5 Security",
      features: ["Direct port access", "Rail connectivity", "24/7 operations"]
    },
    {
      location: "Inland Storage Depot",
      capacity: "1,800 containers",
      security: "Level 4 Security", 
      features: ["Highway access", "Truck loading bays", "Container maintenance"]
    },
    {
      location: "Climate-Controlled Facility",
      capacity: "800 containers",
      security: "Level 5 Security",
      features: ["Temperature control", "Humidity regulation", "Air filtration"]
    },
    {
      location: "Distribution Center",
      capacity: "1,200 containers",
      security: "Level 4 Security",
      features: ["Cross-docking", "Inventory management", "Order fulfillment"]
    }
  ];

  const services = [
    "Container inspection and maintenance",
    "Inventory tracking and reporting",
    "Loading and unloading services",
    "Container cleaning and sanitization",
    "Documentation and record keeping",
    "Insurance and liability coverage",
    "Container pickup and delivery",
    "Emergency access 24/7"
  ];

  const industries = [
    { name: "Import/Export", description: "Temporary storage during customs clearance" },
    { name: "Manufacturing", description: "Raw materials and component storage" },
    { name: "Retail", description: "Seasonal inventory and overflow storage" },
    { name: "Construction", description: "Equipment and material storage on-site" },
    { name: "Agriculture", description: "Harvest storage and equipment housing" },
    { name: "Logistics", description: "Distribution hub and cross-docking operations" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <OptimizedHeroImage 
          src="/optimized_assets/Container-Storage_1749493321153-optimized.webp"
          className="text-white py-20 md:py-32 min-h-[500px] flex items-center"
          fallbackColor="from-blue-900 via-blue-800 to-slate-900"
        >
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-4xl">
              <Badge className="bg-[#3f84ee] text-white px-4 py-2 text-sm mb-6">
                Secure Storage Solutions
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
                Container Storage Facilities
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-3xl drop-shadow-md">
                Secure, monitored container storage with 24/7 access, climate control options, and flexible rental terms across 410 strategic depot locations worldwide.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  className="bg-[#55d2cb] hover:bg-[#41c6b4] text-white font-semibold px-8 py-4 rounded-lg text-lg"
                  onClick={() => document.getElementById('storage-options')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Warehouse className="mr-2 h-5 w-5" />
                  View Options
                </Button>
                <Link href="/request-quote">
                  <Button 
                    variant="outline"
                    className="border-2 bg-transparent hover:bg-[#33d2b9] text-[#33d2b9] hover:text-white border-[#33d2b9] px-6 py-3 rounded-lg flex items-center transition duration-300 h-auto group"
                  >
                    <span>Request Quote</span>
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Storage Features & Security</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced security systems and facility features ensure your containers are protected and accessible
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {storageFeatures.map((feature, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <feature.icon className="h-10 w-10 text-[#3f84ee] mr-3" />
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

        {/* Storage Options Section */}
        <section id="storage-options" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Storage Options</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Flexible storage solutions for short-term holding to long-term warehousing needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {storageOptions.map((option, index) => (
                <Card key={index} className={`h-full relative ${option.popular ? 'border-2 border-[#3f84ee] shadow-lg' : 'border-2 hover:border-[#3f84ee]'} transition-colors`}>
                  {option.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#3f84ee] text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-[#3f84ee]">{option.title}</CardTitle>
                    <div className="text-sm text-gray-500">{option.duration}</div>
                    <div className="text-2xl font-bold text-green-600">{option.price}</div>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {option.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${option.popular ? 'bg-[#3f84ee] hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}>
                      Reserve Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Facility Specifications Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Storage Facilities</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Modern storage facilities strategically located for optimal accessibility
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {facilitySpecs.map((facility, index) => (
                <Card key={index} className="h-full text-center">
                  <CardHeader>
                    <Warehouse className="h-12 w-12 text-[#3f84ee] mx-auto mb-4" />
                    <CardTitle className="text-lg font-bold">{facility.location}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="text-sm"><strong>Capacity:</strong> {facility.capacity}</div>
                      <div className="text-sm"><strong>Security:</strong> {facility.security}</div>
                    </div>
                    <div className="space-y-1">
                      {facility.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="text-xs text-gray-600 flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Additional Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive support services included with your container storage
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {services.map((service, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">{service}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Industries We Serve</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Container storage solutions tailored for various industry requirements
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((industry, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-[#3f84ee]">{industry.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {industry.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-16 bg-[#3f84ee] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Container Storage?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reserve secure storage space at any of our 410 depot locations with flexible terms and comprehensive facility features
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/request-quote">
                <Button 
                  variant="outline"
                  className="border-2 bg-transparent hover:bg-[#33d2b9] text-[#33d2b9] hover:text-white border-[#33d2b9] px-6 py-3 rounded-lg flex items-center transition duration-300 h-auto group"
                >
                  <span>Request Quote</span>
                  <i className="fas fa-arrow-right ml-2 text-[#33d2b9] group-hover:text-white"></i>
                </Button>
              </Link>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-[#55d2cb] text-[#55d2cb] hover:bg-[#55d2cb] hover:text-white px-8 py-4 text-lg transition duration-300"
              >
                Tour Facilities
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
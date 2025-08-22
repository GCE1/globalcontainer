import { useEffect } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimizedHeroImage from '@/components/OptimizedHeroImage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Container, Calendar, Shield, Clock, Star, ArrowRight, Truck, DollarSign, Wrench, FileText } from 'lucide-react';
import { ServiceSEO } from '@/components/SEOWrapper';

export default function ContainerLeasing() {
  const leasingOptions = [
    {
      title: "Route-Based Leasing",
      duration: "60-75 free days",
      price: "From $100/route",
      features: ["Global coverage", "83 countries available", "Port-to-port delivery", "Standard per diem $5-10"],
      description: "One-way container leasing between global ports",
      popular: false
    },
    {
      title: "Standard Lease Program", 
      duration: "3-12 months",
      price: "From $400/month",
      features: ["60 free days included", "$10 per diem after", "40HC & 20GP available", "Global port network"],
      description: "Flexible leasing for regular shipping operations",
      popular: true
    },
    {
      title: "Regional Lease",
      duration: "6-24 months",
      price: "From $200/month",
      features: ["75 free days included", "Reduced per diem rates", "Asia-Europe corridors", "Volume discounts available"],
      description: "Cost-effective for established trade routes",
      popular: false
    },
    {
      title: "Enterprise Fleet",
      duration: "12+ months",
      price: "Custom pricing",
      features: ["Dedicated account manager", "Bulk rate pricing", "Custom free day terms", "Priority equipment allocation"],
      description: "Comprehensive leasing for high-volume operations",
      popular: false
    }
  ];

  const containerSizes = [
    {
      size: "20ft General Purpose",
      capacity: "1,170 cu ft",
      weight: "28,320 kg",
      monthlyRate: "From $320/route"
    },
    {
      size: "40ft General Purpose",
      capacity: "2,385 cu ft", 
      weight: "30,480 kg",
      monthlyRate: "From $825/route"
    },
    {
      size: "40ft High Cube",
      capacity: "2,694 cu ft",
      weight: "30,480 kg", 
      monthlyRate: "From $900/route"
    },
    {
      size: "Specialized Units",
      capacity: "Custom sizing",
      weight: "Varies by type",
      monthlyRate: "Custom pricing"
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Cost Effective",
      description: "Lower upfront costs compared to purchasing, with predictable monthly payments"
    },
    {
      icon: Calendar,
      title: "Flexible Terms", 
      description: "Choose from short-term to long-term leases based on your specific needs"
    },
    {
      icon: Wrench,
      title: "Maintenance Included",
      description: "Comprehensive maintenance and repair services included in lease agreements"
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "All leased containers meet international standards and certifications"
    },
    {
      icon: Truck,
      title: "Global Delivery",
      description: "Worldwide delivery and pickup services for maximum convenience"
    },
    {
      icon: FileText,
      title: "Simple Process",
      description: "Streamlined application and approval process with minimal documentation"
    }
  ];

  const industries = [
    { name: "Construction", description: "On-site storage and office solutions" },
    { name: "Retail", description: "Seasonal inventory and pop-up stores" },
    { name: "Manufacturing", description: "Raw materials and finished goods storage" },
    { name: "Agriculture", description: "Equipment storage and grain handling" },
    { name: "Events", description: "Mobile facilities and equipment storage" },
    { name: "Logistics", description: "Distribution centers and freight operations" }
  ];

  return (
    <ServiceSEO
      name="Container Leasing Services"
      description="Flexible container leasing and rental solutions for short-term and long-term needs. Cost-effective alternative to purchasing with global availability."
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
        {/* Hero Section */}
        <OptimizedHeroImage 
          src="/optimized_assets/Container-Leasing_1749330394138-optimized.webp"
          className="text-white py-20 md:py-32 min-h-[500px] flex items-center"
          fallbackColor="from-blue-900 via-blue-800 to-slate-900"
        >
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-4xl">
              <Badge className="bg-blue-500 text-white px-4 py-2 text-sm mb-6">
                Flexible Container Solutions
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
                Container Leasing Solutions
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-3xl drop-shadow-md">
                Flexible short and long-term container leasing with maintenance support, global delivery, and competitive rates.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  className="bg-[#41c6b4] hover:bg-[#369e8e] text-white font-semibold px-8 py-4 rounded-lg text-lg"
                  onClick={() => document.getElementById('leasing-options')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  View Plans
                </Button>
                <Link href="/request-quote">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-2 bg-transparent hover:bg-[#33d2b9] text-[#33d2b9] hover:text-white border-[#33d2b9] px-8 py-4 rounded-lg text-lg transition duration-300 group"
                  >
                    Request Quote
                    <i className="fas fa-arrow-right ml-2 text-[#33d2b9] group-hover:text-white"></i>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </OptimizedHeroImage>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Container Leasing</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the flexibility and cost savings of our comprehensive container leasing solutions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <benefit.icon className="h-10 w-10 text-blue-600 mr-3" />
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Leasing Options Section */}
        <section id="leasing-options" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Leasing Plans</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the leasing option that best fits your business needs and timeline
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {leasingOptions.map((option, index) => (
                <Card key={index} className={`h-full relative ${option.popular ? 'border-2 border-blue-500 shadow-lg' : 'border-2 hover:border-blue-300'} transition-colors`}>
                  {option.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-blue-600">{option.title}</CardTitle>
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
                    <Button className={`w-full ${option.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Container Sizes & Rates Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Container Sizes & Monthly Rates</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Competitive monthly rates for all standard container sizes
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {containerSizes.map((container, index) => (
                <Card key={index} className="h-full text-center">
                  <CardHeader>
                    <Container className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle className="text-lg font-bold">{container.size}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-gray-600">Capacity: {container.capacity}</div>
                      <div className="text-sm text-gray-600">Max Weight: {container.weight}</div>
                    </div>
                    <div className="text-xl font-bold text-green-600 mb-4">{container.monthlyRate}</div>
                    <Button variant="outline" className="w-full">
                      Get Quote
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Industries We Serve</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Container leasing solutions tailored for various industry needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((industry, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-blue-600">{industry.name}</CardTitle>
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
        <section id="contact" className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Leasing?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get personalized leasing quotes and flexible terms tailored to your business needs
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
                size="lg"
                className="bg-[#41c6b4] hover:bg-[#369e8e] text-white font-semibold px-8 py-4 rounded-lg text-lg"
              >
                <i className="fas fa-user-tie mr-2"></i>
                Talk to Specialist
              </Button>
            </div>
          </div>
        </section>
        </main>
        <Footer />
      </div>
    </ServiceSEO>
  );
}
import { useEffect } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimizedHeroImage from '@/components/OptimizedHeroImage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Container, Globe, Shield, Clock, Star, ArrowRight, Truck, MapPin } from 'lucide-react';
import { ServiceSEO } from '@/components/SEOWrapper';

export default function ContainerSales() {

  const containerTypes = [
    {
      title: "20ft Standard Containers",
      price: "From $2,500",
      features: ["Cargo Worthy", "Wind & Water Tight", "IICL Certified", "As-Is Available"],
      description: "Perfect for storage and shipping applications"
    },
    {
      title: "40ft Standard Containers", 
      price: "From $3,200",
      features: ["High Cube Available", "Double Door Options", "Premium Grade", "Custom Modifications"],
      description: "Ideal for large cargo and extended storage needs"
    },
    {
      title: "40ft High Cube Containers",
      price: "From $3,500", 
      features: ["Extra Height", "Refrigerated Options", "Open Top Available", "Side Door Variants"],
      description: "Maximum capacity for oversized cargo"
    },
    {
      title: "Specialty Containers",
      price: "From $4,000",
      features: ["Flat Rack", "Open Top", "Tank Containers", "Custom Solutions"],
      description: "Specialized containers for unique requirements"
    }
  ];

  const qualityGrades = [
    {
      grade: "One Trip",
      description: "Brand new containers used only once for cargo",
      price: "Premium pricing",
      warranty: "5 years structural"
    },
    {
      grade: "Cargo Worthy (CW)",
      description: "Certified for international shipping",
      price: "Mid-range pricing", 
      warranty: "2 years structural"
    },
    {
      grade: "Wind & Water Tight (WWT)",
      description: "Secure storage, not certified for shipping",
      price: "Value pricing",
      warranty: "1 year structural"
    },
    {
      grade: "As-Is",
      description: "Budget option requiring potential repairs",
      price: "Lowest pricing",
      warranty: "No warranty"
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Global Inventory",
      description: "Access to over 1.39 million containers across 410 depots in 89 countries"
    },
    {
      icon: Shield,
      title: "Quality Guaranteed", 
      description: "All containers inspected and certified according to international standards"
    },
    {
      icon: Truck,
      title: "Delivery Included",
      description: "Professional delivery and placement service available worldwide"
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Quick purchase process with financing options available"
    },
    {
      icon: Star,
      title: "Expert Support",
      description: "Dedicated sales team to help you find the perfect container solution"
    },
    {
      icon: MapPin,
      title: "Local Availability",
      description: "Containers available from depots near your location for reduced costs"
    }
  ];

  return (
    <ServiceSEO
      name="Container Sales"
      description="Buy high-quality new and used shipping containers from verified suppliers worldwide. 20ft, 40ft containers available with competitive pricing and global delivery."
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
        {/* Hero Section */}
        <OptimizedHeroImage 
          src="/optimized_assets/Container-Sales_1749330300707-optimized.webp"
          className="text-white py-20 md:py-32 min-h-[500px] flex items-center"
          fallbackColor="from-blue-900 via-blue-800 to-slate-900"
        >
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-4xl">
              <Badge className="bg-[#3f84ee] text-white px-4 py-2 text-sm mb-6">
                Premium Container Sales
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
                Buy Quality Shipping Containers
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-3xl drop-shadow-md">
                Purchase certified shipping containers direct from our global network. All grades available with delivery worldwide.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  className="bg-[#41c6b4] hover:bg-[#369e8e] text-white font-semibold px-8 py-4 rounded-lg text-lg"
                  onClick={() => document.getElementById('container-types')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Container className="mr-2 h-5 w-5" />
                  Browse Containers
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Buy From Us</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the advantages of purchasing containers from the world's largest container marketplace
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

        {/* Container Types Section */}
        <section id="container-types" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Container Types & Pricing</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose from our extensive inventory of shipping containers in various sizes and conditions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {containerTypes.map((container, index) => (
                <Card key={index} className="h-full border-2 hover:border-blue-500 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-blue-600">{container.title}</CardTitle>
                    <div className="text-2xl font-bold text-green-600">{container.price}</div>
                    <CardDescription>{container.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {container.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quality Grades Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Container Quality Grades</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding container conditions to make the right choice for your needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {qualityGrades.map((grade, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-blue-600">{grade.grade}</CardTitle>
                    <div className="text-lg font-semibold text-green-600">{grade.price}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{grade.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Shield className="h-4 w-4 mr-2" />
                      {grade.warranty}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Purchase?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get personalized quotes and expert guidance for your container purchase
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
                <i className="fas fa-phone mr-2"></i>
                Call Sales Team
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
import { useEffect } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimizedHeroImage from '@/components/OptimizedHeroImage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Wrench, Zap, Shield, Home, Wind, ArrowRight, Palette, Building, Snowflake, Flame, Lock } from 'lucide-react';

export default function ContainerModifications() {
  useEffect(() => {
    document.title = 'Container Modifications - Global Container Exchange';
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  const modificationTypes = [
    {
      title: "Office Conversions",
      price: "From $8,500",
      features: ["Insulation installation", "Electrical systems", "HVAC integration", "Interior finishing"],
      description: "Transform containers into functional office spaces",
      popular: true,
      icon: Building
    },
    {
      title: "Residential Units", 
      price: "From $15,000",
      features: ["Plumbing systems", "Kitchen installations", "Bathroom facilities", "Living space design"],
      description: "Convert containers into livable housing units",
      popular: false,
      icon: Home
    },
    {
      title: "Retail Spaces",
      price: "From $12,000",
      features: ["Storefront design", "Display installations", "Security systems", "Custom branding"],
      description: "Create unique retail and commercial spaces",
      popular: false,
      icon: Building
    },
    {
      title: "Specialized Storage",
      price: "From $6,500",
      features: ["Climate control", "Ventilation systems", "Security upgrades", "Custom shelving"],
      description: "Enhanced storage for specialized requirements",
      popular: false,
      icon: Shield
    }
  ];

  const customFeatures = [
    {
      icon: Zap,
      title: "Electrical Systems",
      description: "Complete electrical installation with outlets, lighting, and power distribution panels"
    },
    {
      icon: Wind,
      title: "HVAC Installation",
      description: "Heating, ventilation, and air conditioning systems for climate control"
    },
    {
      icon: Shield,
      title: "Security Features",
      description: "Advanced locking systems, alarm integration, and surveillance equipment"
    },
    {
      icon: Palette,
      title: "Custom Finishes",
      description: "Interior and exterior finishing with paint, flooring, and wall treatments"
    },
    {
      icon: Snowflake,
      title: "Insulation",
      description: "Thermal insulation for temperature control and energy efficiency"
    },
    {
      icon: Flame,
      title: "Fire Safety",
      description: "Fire suppression systems, emergency exits, and safety compliance"
    }
  ];

  const modificationOptions = [
    {
      category: "Structural Modifications",
      options: [
        "Door and window installations",
        "Wall removals and additions",
        "Roof modifications",
        "Foundation preparation",
        "Multiple container joining"
      ]
    },
    {
      category: "Utility Installations",
      options: [
        "Electrical wiring and panels",
        "Plumbing and water systems",
        "HVAC and ventilation",
        "Internet and communication",
        "Solar panel integration"
      ]
    },
    {
      category: "Interior Features",
      options: [
        "Flooring installation",
        "Wall finishes and drywall",
        "Ceiling treatments",
        "Built-in furniture",
        "Kitchen and bathroom fixtures"
      ]
    },
    {
      category: "Exterior Enhancements",
      options: [
        "Custom paint and graphics",
        "Siding and cladding",
        "Roofing upgrades",
        "Outdoor decking",
        "Landscaping integration"
      ]
    }
  ];

  const projectGallery = [
    {
      title: "Modern Office Complex",
      description: "Multi-container office building with conference rooms",
      features: ["20 containers", "Climate control", "Open floor plan"],
      timeline: "8-12 weeks"
    },
    {
      title: "Retail Pop-Up Store",
      description: "Portable retail space with storefront design",
      features: ["Single 40ft container", "Glass frontage", "LED lighting"],
      timeline: "4-6 weeks"
    },
    {
      title: "Residential Tiny Home",
      description: "Fully equipped living space with modern amenities",
      features: ["Kitchen & bathroom", "Loft bedroom", "Energy efficient"],
      timeline: "6-10 weeks"
    },
    {
      title: "Mobile Restaurant",
      description: "Commercial kitchen with serving window",
      features: ["Commercial equipment", "Ventilation system", "POS integration"],
      timeline: "10-14 weeks"
    }
  ];

  const certifications = [
    "Building Code Compliance",
    "Electrical Safety Standards",
    "Plumbing Code Certification",
    "Fire Safety Compliance",
    "ADA Accessibility Standards",
    "Environmental Regulations"
  ];

  const process = [
    {
      step: "1",
      title: "Consultation",
      description: "Discuss your requirements and vision with our design team"
    },
    {
      step: "2", 
      title: "Design",
      description: "Create detailed plans and 3D renderings of your modified container"
    },
    {
      step: "3",
      title: "Permits",
      description: "Handle all necessary permits and regulatory approvals"
    },
    {
      step: "4",
      title: "Modification",
      description: "Professional installation and modification in our facilities"
    },
    {
      step: "5",
      title: "Delivery",
      description: "Transport and setup at your designated location"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <OptimizedHeroImage 
          src="/optimized_assets/Container-Modifications_1749498610110-optimized.webp"
          className="text-white py-20 md:py-32 min-h-[500px] flex items-center"
          fallbackColor="from-amber-900 via-amber-800 to-slate-900"
        >
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-4xl">
              <Badge className="bg-[#3f84ee] text-white px-4 py-2 text-sm mb-6">
                Custom Container Solutions
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
                Container Modifications & Custom Builds
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-3xl drop-shadow-md">
                Transform shipping containers into offices, homes, retail spaces, and specialized facilities with professional modifications and custom features.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 bg-[#001937] hover:bg-[#42d1bd] text-white hover:text-white border-[#001937] hover:border-[#42d1bd] px-8 py-4 text-lg"
                  onClick={() => document.getElementById('modification-types')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Wrench className="mr-2 h-5 w-5" />
                  View Options
                </Button>
                <Link href="/request-quote">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-2 bg-[#001937] hover:bg-[#42d1bd] text-white hover:text-white border-[#001937] hover:border-[#42d1bd] px-8 py-4 text-lg"
                  >
                    <span>Request Quote</span>
                    <i className="fas fa-arrow-right ml-2 text-white group-hover:text-white"></i>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </OptimizedHeroImage>

        {/* Custom Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Custom Features & Systems</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Professional installation of utilities, systems, and custom features for any application
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {customFeatures.map((feature, index) => (
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

        {/* Modification Types Section */}
        <section id="modification-types" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Modification Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Complete container transformation services for residential, commercial, and industrial applications
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modificationTypes.map((type, index) => (
                <Card key={index} className={`h-full relative ${type.popular ? 'border-2 border-[#3f84ee] shadow-lg' : 'border-2 hover:border-[#3f84ee]'} transition-colors`}>
                  {type.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#3f84ee] text-white">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <type.icon className="h-12 w-12 text-[#3f84ee] mx-auto mb-4" />
                    <CardTitle className="text-lg font-bold text-[#3f84ee] text-center">{type.title}</CardTitle>
                    <div className="text-2xl font-bold text-green-600 text-center">{type.price}</div>
                    <CardDescription className="text-center">{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {type.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${type.popular ? 'bg-[#3f84ee] hover:bg-[#2d6fd4]' : 'bg-gray-600 hover:bg-gray-700'}`}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Modification Options Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Modification Options</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive modification services across all aspects of container transformation
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modificationOptions.map((category, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-[#3f84ee]">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.options.map((option, optionIndex) => (
                        <li key={optionIndex} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{option}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Project Gallery Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Featured Projects</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Sample container modification projects showcasing our capabilities
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projectGallery.map((project, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {project.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm font-medium text-[#3f84ee]">
                      Timeline: {project.timeline}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Modification Process</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our streamlined process ensures quality results from concept to completion
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {process.map((step, index) => (
                <Card key={index} className="text-center relative">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-[#3f84ee] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </CardContent>
                  {index < process.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 h-6 w-6 text-[#3f84ee]" />
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Certifications & Compliance</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                All modifications meet industry standards and regulatory requirements
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {certifications.map((cert, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">{cert}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-16 bg-[#3f84ee] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Container?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get professional container modification services with complete design and installation support
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/request-quote">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 bg-[#001937] hover:bg-[#42d1bd] text-white hover:text-white border-[#001937] hover:border-[#42d1bd] px-8 py-4 text-lg"
                >
                  <span>Request Quote</span>
                  <i className="fas fa-arrow-right ml-2 text-white group-hover:text-white"></i>
                </Button>
              </Link>
              <Link href="/container-portfolio">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-[#55d2cb] text-[#55d2cb] hover:bg-[#55d2cb] hover:text-white bg-transparent px-8 py-4 text-lg"
                >
                  View Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
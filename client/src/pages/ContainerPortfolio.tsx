import { useEffect } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowLeft, Building2, Home, Store, Warehouse, Utensils, Wrench, Clock, DollarSign } from 'lucide-react';
import OptimizedHeroImage from '@/components/OptimizedHeroImage';
import containerModificationsHero from '@assets/Container-Modifications_1749498610110.png';
import modernOfficeImage from '@assets/Modern Office_1749500871182.png';
import luxuryTinyHomeImage from '@assets/Luxury Tiny Home_1749500989237.png';
import retailPopUpImage from '@assets/Retail Pop-Up Store_1749501094812.png';
import mobileRestaurantImage from '@assets/Mobile Restaurant_1749501198529.png';
import workshopGarageImage from '@assets/Workshop & Garage_1749501321626.png';
import medicalClinicImage from '@assets/Medical Clinic_1749501448937.png';

export default function ContainerPortfolio() {
  useEffect(() => {
    document.title = 'Container Modification Portfolio - Global Container Exchange';
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  const portfolioProjects = [
    {
      id: 1,
      title: "Modern Office Complex",
      category: "Office Conversion",
      description: "40ft container transformed into a fully functional modern office space with premium finishes",
      features: [
        "Climate-controlled environment",
        "Full electrical and data wiring",
        "Insulated walls and flooring",
        "Large windows and glass doors",
        "Modern interior design",
        "Energy-efficient LED lighting"
      ],
      specs: {
        size: "40ft High Cube",
        timeline: "8 weeks",
        investment: "$24,500",
        location: "Austin, Texas"
      },
      icon: Building2,
      image: modernOfficeImage,
      popular: true
    },
    {
      id: 2,
      title: "Luxury Tiny Home",
      category: "Residential Unit",
      description: "20ft container converted into a luxury micro-living space with full amenities",
      features: [
        "Full kitchen with appliances",
        "Bathroom with shower",
        "Murphy bed and storage",
        "Hardwood flooring",
        "Smart home technology",
        "Solar panel integration"
      ],
      specs: {
        size: "20ft High Cube",
        timeline: "10 weeks",
        investment: "$32,000",
        location: "Portland, Oregon"
      },
      icon: Home,
      image: luxuryTinyHomeImage,
      popular: false
    },
    {
      id: 3,
      title: "Retail Pop-Up Store",
      category: "Commercial Space",
      description: "Stylish retail space with custom branding and modern display systems",
      features: [
        "Custom storefront design",
        "Professional lighting system",
        "Security and POS integration",
        "Climate control",
        "Custom branding elements",
        "Flexible display fixtures"
      ],
      specs: {
        size: "40ft Standard",
        timeline: "6 weeks",
        investment: "$18,800",
        location: "Los Angeles, California"
      },
      icon: Store,
      image: retailPopUpImage,
      popular: false
    },
    {
      id: 4,
      title: "Mobile Restaurant",
      category: "Food Service",
      description: "Complete commercial kitchen setup with health department compliance",
      features: [
        "Commercial-grade kitchen equipment",
        "Health department approved design",
        "Ventilation and fire suppression",
        "Stainless steel surfaces",
        "Point-of-sale integration",
        "Exterior serving window"
      ],
      specs: {
        size: "40ft High Cube",
        timeline: "12 weeks",
        investment: "$45,000",
        location: "Miami, Florida"
      },
      icon: Utensils,
      image: mobileRestaurantImage,
      popular: true
    },
    {
      id: 5,
      title: "Workshop & Garage",
      category: "Industrial Space",
      description: "Multi-purpose workshop with heavy-duty electrical and equipment mounting",
      features: [
        "220V electrical systems",
        "Heavy-duty flooring",
        "Tool storage systems",
        "Overhead crane mounting",
        "Ventilation system",
        "Security features"
      ],
      specs: {
        size: "40ft High Cube",
        timeline: "7 weeks",
        investment: "$21,200",
        location: "Houston, Texas"
      },
      icon: Wrench,
      image: workshopGarageImage,
      popular: false
    },
    {
      id: 6,
      title: "Medical Clinic",
      category: "Healthcare Facility",
      description: "Fully equipped medical facility meeting all healthcare regulations",
      features: [
        "Medical-grade finishes",
        "Specialized ventilation",
        "ADA compliant design",
        "Medical equipment integration",
        "Patient privacy features",
        "Emergency systems"
      ],
      specs: {
        size: "40ft High Cube",
        timeline: "14 weeks",
        investment: "$38,500",
        location: "Denver, Colorado"
      },
      icon: Building2,
      image: medicalClinicImage,
      popular: false
    }
  ];

  const categories = [
    { name: "All Projects", count: portfolioProjects.length },
    { name: "Office Conversion", count: portfolioProjects.filter(p => p.category === "Office Conversion").length },
    { name: "Residential Unit", count: portfolioProjects.filter(p => p.category === "Residential Unit").length },
    { name: "Commercial Space", count: portfolioProjects.filter(p => p.category === "Commercial Space").length },
    { name: "Food Service", count: portfolioProjects.filter(p => p.category === "Food Service").length },
    { name: "Industrial Space", count: portfolioProjects.filter(p => p.category === "Industrial Space").length },
    { name: "Healthcare Facility", count: portfolioProjects.filter(p => p.category === "Healthcare Facility").length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        {/* Header Section */}
        <OptimizedHeroImage 
          src={containerModificationsHero}
          className="relative"
          overlayOpacity={30}
        >

          <div className="relative z-10 py-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center mb-6">
                <Link href="/container-modifications">
                  <Button 
                    variant="outline"
                    className="border-2 bg-transparent hover:bg-[#33d2b9] text-[#33d2b9] hover:text-white border-[#33d2b9] px-6 py-3 rounded-lg flex items-center transition duration-300 h-auto group mr-4"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span>Back to Modifications</span>
                  </Button>
                </Link>
              </div>
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                  Container Modification Portfolio
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                  Explore our completed container transformation projects showcasing innovative design and professional craftsmanship
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-lg">
                  <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <Building2 className="mr-2 h-6 w-6" />
                    <span>50+ Completed Projects</span>
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <Clock className="mr-2 h-6 w-6" />
                    <span>2-16 Week Timelines</span>
                  </div>
                  <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <DollarSign className="mr-2 h-6 w-6" />
                    <span>$15K - $50K Investment Range</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </OptimizedHeroImage>

        {/* Categories Filter */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="px-4 py-2 text-sm border-[#3f84ee] text-[#3f84ee] hover:bg-[#3f84ee] hover:text-white cursor-pointer transition-colors"
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioProjects.map((project) => (
                <Card key={project.id} className={`h-full hover:shadow-xl transition-shadow flex flex-col ${project.popular ? 'border-2 border-[#3f84ee] shadow-lg' : ''}`}>
                  {project.popular && (
                    <Badge className="absolute -top-3 left-4 bg-[#3f84ee] text-white z-10">
                      Featured Project
                    </Badge>
                  )}
                  
                  {/* Project Image */}
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    {(project.image === modernOfficeImage || project.image === luxuryTinyHomeImage || project.image === retailPopUpImage || project.image === mobileRestaurantImage || project.image === workshopGarageImage || project.image === medicalClinicImage) ? (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <project.icon className="h-16 w-16 text-[#3f84ee] opacity-50" />
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-[#3f84ee] mb-2">
                          {project.title}
                        </CardTitle>
                        <Badge variant="outline" className="mb-3 text-xs">
                          {project.category}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-grow flex flex-col">
                    {/* Project Specifications */}
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">SIZE</p>
                        <p className="text-sm font-semibold">{project.specs.size}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">TIMELINE</p>
                        <p className="text-sm font-semibold">{project.specs.timeline}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">INVESTMENT</p>
                        <p className="text-sm font-semibold text-green-600">{project.specs.investment}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">LOCATION</p>
                        <p className="text-sm font-semibold">{project.specs.location}</p>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-sm mb-3 text-[#3f84ee]">Key Features</h4>
                      <div className="space-y-2">
                        {project.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-xs text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      <Link href="/request-quote">
                        <Button className="w-full bg-[#001937] hover:bg-[#42d1bd] text-white">
                          Request Similar Project
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#3f84ee] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Container Transformation?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Our experienced team can bring your vision to life with professional container modifications tailored to your specific needs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/request-quote">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 bg-transparent hover:bg-white text-white hover:text-[#3f84ee] border-white px-8 py-4 rounded-lg text-lg transition duration-300"
                >
                  Get Custom Quote
                </Button>
              </Link>
              <Link href="/container-modifications">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 bg-transparent hover:bg-[#55d2cb] text-white hover:text-white border-[#55d2cb] px-8 py-4 rounded-lg text-lg transition duration-300"
                >
                  View Services
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
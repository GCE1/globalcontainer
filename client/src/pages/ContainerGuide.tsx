import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Download, Shield, CheckCircle, AlertTriangle, Home, Building2, Truck, Thermometer } from "lucide-react";
const asIsImage = "/attached_assets/AS-Is.png";
const cargoWorthyImage = "/attached_assets/Cargo-Worthy.png";
const windWaterTightImage = "/attached_assets/Wind&Water-Tight.png";
const iclImage = "/attached_assets/IICL.png";
const wwtImage = "/attached_assets/WWT.png";
const businessImage = "/attached_assets/Business.png";
const reeferImage = "/attached_assets/reefer.png";
const containerDepotImage = "/attached_assets/container-depot.png";
const garageImage = "/attached_assets/garage-shed.png";
const homeImage = "/attached_assets/home.png";
const modernOfficeImage = "/attached_assets/Modern-Office.png";
const containerEvolutionImage = "/attached_assets/The Evolution of Shipping Container.png";
const labeledContainerImage = "/attached_assets/LabeledContainer.png";
const doubleDoorsImage = "/attached_assets/Double-door containners.png";
const flatRackImage = "/attached_assets/Flat-rack containers.png";
const halfHeightImage = "/attached_assets/Half-height containers.png";
const openSideImage = "/attached_assets/Open-side containers.png";
const openTopImage = "/attached_assets/Open-top containers.png";
const sideDoorImage = "/attached_assets/Side-door containers.png";
const reeferMultiImage = "/attached_assets/Reefer-multi-images.png";
const emergencyUnitsImage = "/attached_assets/Emergency Response Units.png";

const containerGrades = [
  {
    title: "AS-IS Condition",
    icon: AlertTriangle,
    color: "orange",
    image: asIsImage,
    description: "Containers sold in their current condition without repairs or refurbishment.",
    features: [
      "Most economical option",
      "May have cosmetic wear",
      "Suitable for storage applications",
      "Basic structural integrity maintained"
    ]
  },
  {
    title: "Cargo Worthy (CW)",
    icon: CheckCircle,
    color: "green",
    image: cargoWorthyImage,
    description: "Containers certified for international shipping and cargo transport.",
    features: [
      "Passes rigorous structural inspections",
      "Suitable for ocean freight",
      "Meets international shipping standards",
      "Wind and water tight guarantee"
    ]
  },
  {
    title: "Wind & Water Tight (WWT)",
    icon: Shield,
    color: "blue",
    image: windWaterTightImage,
    description: "Containers that provide complete protection from weather elements.",
    features: [
      "Weatherproof seal integrity",
      "No structural damage",
      "Suitable for secure storage",
      "Protection from moisture and wind"
    ]
  },
  {
    title: "IICL Standard",
    icon: Shield,
    color: "purple",
    image: iclImage,
    description: "Containers meeting Institute of International Container Lessors standards.",
    features: [
      "Highest quality grade",
      "Like-new condition",
      "Suitable for leasing operations",
      "Premium structural integrity"
    ]
  }
];

const containerTypes = [
  {
    title: "Standard Dry Container",
    image: labeledContainerImage,
    description: "Most common container type for general cargo",
    sizes: ["20ft", "40ft", "40ft High Cube"],
    applications: ["General cargo", "Dry goods", "Storage", "Shipping"]
  },
  {
    title: "Refrigerated Container (Reefer)",
    image: reeferMultiImage,
    description: "Temperature-controlled containers for perishable goods",
    sizes: ["20ft", "40ft", "40ft High Cube"],
    applications: ["Food products", "Pharmaceuticals", "Chemicals", "Temperature-sensitive cargo"]
  },
  {
    title: "Open Top Container",
    image: openTopImage,
    description: "Containers with removable top for oversized cargo",
    sizes: ["20ft", "40ft"],
    applications: ["Heavy machinery", "Oversized cargo", "Top-loading items", "Construction materials"]
  },
  {
    title: "Flat Rack Container",
    image: flatRackImage,
    description: "Collapsible sides for oversized or heavy cargo",
    sizes: ["20ft", "40ft"],
    applications: ["Heavy machinery", "Vehicles", "Construction equipment", "Oversized items"]
  },
  {
    title: "Open Side Container",
    image: openSideImage,
    description: "Side-opening access for easy loading",
    sizes: ["20ft", "40ft"],
    applications: ["Side-loading cargo", "Easy access storage", "Retail conversions", "Workshops"]
  },
  {
    title: "Double Door Container",
    image: doubleDoorsImage,
    description: "Doors on both ends for improved accessibility",
    sizes: ["20ft", "40ft"],
    applications: ["Through-loading", "Easy access", "Conversion projects", "Storage facilities"]
  }
];

const applications = [
  {
    title: "Residential Storage",
    icon: Home,
    image: homeImage,
    description: "Perfect for home storage solutions and personal use",
    benefits: ["Secure storage", "Weather protection", "Cost-effective", "Portable"]
  },
  {
    title: "Business Storage",
    icon: Building2,
    image: businessImage,
    description: "Commercial storage and business applications",
    benefits: ["Inventory storage", "Document archiving", "Equipment storage", "Temporary office space"]
  },
  {
    title: "Construction Sites",
    icon: Truck,
    image: containerDepotImage,
    description: "Mobile storage for construction and industrial projects",
    benefits: ["Tool storage", "Material protection", "Site offices", "Security storage"]
  },
  {
    title: "Workshop & Garage",
    icon: Thermometer,
    image: garageImage,
    description: "Convert containers into workshops and garage spaces",
    benefits: ["Custom workshops", "Vehicle storage", "Equipment housing", "Hobby spaces"]
  }
];

export default function ContainerGuide() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-bg text-white py-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">
                Container Guide
              </h1>
            </div>
            <p className="text-xl mb-8 opacity-90">
              Your comprehensive guide to shipping container grades, types, and applications
            </p>
            <Badge className="bg-green-500 text-white px-6 py-2 text-lg">
              Expert Knowledge Base
            </Badge>
          </div>
        </section>

        {/* Container Evolution */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">The Evolution of Shipping Containers</h2>
                <p className="text-xl text-gray-600">
                  Understanding the history and development of modern container logistics
                </p>
              </div>
              <div className="flex justify-center">
                <img 
                  src={containerEvolutionImage} 
                  alt="The Evolution of Shipping Container"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Container Grades */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Container Condition Grades</h2>
                <p className="text-xl text-gray-600">
                  Understanding different container grades to choose the right option for your needs
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {containerGrades.map((grade, index) => {
                  const IconComponent = grade.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={grade.image} 
                          alt={grade.title}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge 
                            className={`${
                              grade.color === 'orange' ? 'bg-orange-500' :
                              grade.color === 'green' ? 'bg-green-500' :
                              grade.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
                            } text-white`}
                          >
                            {grade.title.split(' ')[0]}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <IconComponent className={`h-5 w-5 mr-2 ${
                            grade.color === 'orange' ? 'text-orange-500' :
                            grade.color === 'green' ? 'text-green-500' :
                            grade.color === 'blue' ? 'text-blue-500' : 'text-purple-500'
                          }`} />
                          {grade.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 text-sm">{grade.description}</p>
                        <ul className="space-y-1">
                          {grade.features.map((feature, idx) => (
                            <li key={idx} className="text-xs text-gray-500 flex items-start">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Container Types */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Container Types & Specifications</h2>
                <p className="text-xl text-gray-600">
                  Explore our comprehensive range of container types for every application
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {containerTypes.map((type, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={type.image} 
                        alt={type.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{type.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm text-gray-800 mb-2">Available Sizes:</h4>
                        <div className="flex flex-wrap gap-1">
                          {type.sizes.map((size, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-gray-800 mb-2">Applications:</h4>
                        <ul className="space-y-1">
                          {type.applications.slice(0, 3).map((app, idx) => (
                            <li key={idx} className="text-xs text-gray-500 flex items-start">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                              {app}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Container Applications</h2>
                <p className="text-xl text-gray-600">
                  Discover the versatile uses of shipping containers across industries
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {applications.map((app, index) => {
                  const IconComponent = app.icon;
                  return (
                    <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <img 
                          src={app.image} 
                          alt={app.title}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3">{app.title}</h3>
                        <p className="text-gray-600 mb-4 text-sm">{app.description}</p>
                        <ul className="space-y-1">
                          {app.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-xs text-gray-500 flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Container Specifications</h2>
                <p className="text-gray-600">
                  Detailed technical specifications for standard container sizes
                </p>
              </div>

              <Tabs defaultValue="20ft" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="20ft">20ft Standard</TabsTrigger>
                  <TabsTrigger value="40ft">40ft Standard</TabsTrigger>
                  <TabsTrigger value="40hc">40ft High Cube</TabsTrigger>
                </TabsList>
                
                <TabsContent value="20ft" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>20ft Standard Container</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">External Dimensions</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>Length: 20ft (6.06m)</li>
                            <li>Width: 8ft (2.44m)</li>
                            <li>Height: 8ft 6in (2.59m)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Internal Dimensions</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>Length: 19ft 4in (5.90m)</li>
                            <li>Width: 7ft 8in (2.35m)</li>
                            <li>Height: 7ft 10in (2.39m)</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="40ft" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>40ft Standard Container</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">External Dimensions</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>Length: 40ft (12.19m)</li>
                            <li>Width: 8ft (2.44m)</li>
                            <li>Height: 8ft 6in (2.59m)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Internal Dimensions</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>Length: 39ft 6in (12.03m)</li>
                            <li>Width: 7ft 8in (2.35m)</li>
                            <li>Height: 7ft 10in (2.39m)</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="40hc" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>40ft High Cube Container</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">External Dimensions</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>Length: 40ft (12.19m)</li>
                            <li>Width: 8ft (2.44m)</li>
                            <li>Height: 9ft 6in (2.90m)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Internal Dimensions</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>Length: 39ft 6in (12.03m)</li>
                            <li>Width: 7ft 8in (2.35m)</li>
                            <li>Height: 8ft 10in (2.70m)</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Additional Resources</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <Download className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Buyer's Guide</h3>
                    <p className="text-gray-600 mb-4">
                      Comprehensive guide to purchasing shipping containers
                    </p>
                    <Button className="w-full">Download PDF</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-3">FAQ Document</h3>
                    <p className="text-gray-600 mb-4">
                      Frequently asked questions about container logistics
                    </p>
                    <Button className="w-full">Download FAQ</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
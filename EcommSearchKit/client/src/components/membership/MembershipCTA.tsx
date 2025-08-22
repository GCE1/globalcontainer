import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  MapPin, 
  Search, 
  Globe, 
  CheckCircle, 
  ArrowRight,
  Star,
  Users,
  Package
} from "lucide-react";

const MembershipCTA = () => {
  const membershipTiers = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "Basic container search",
        "Standard listing access",
        "Email support"
      ],
      icon: <Package className="h-6 w-6 text-blue-600" />,
      buttonText: "Get Started",
      buttonVariant: "outline" as const
    },
    {
      name: "Professional",
      price: "$49/month",
      features: [
        "Advanced search filters",
        "Priority customer support",
        "Volume pricing access",
        "Shipping coordination"
      ],
      icon: <Users className="h-6 w-6 text-purple-600" />,
      buttonText: "Upgrade Now",
      buttonVariant: "default" as const
    },
    {
      name: "Complete Package",
      price: "$149/month",
      features: [
        "Intelligent location search",
        "Nearest depot optimization",
        "Global postal code support",
        "Real-time distance calculation",
        "Enterprise support",
        "Custom logistics solutions"
      ],
      icon: <Crown className="h-6 w-6 text-yellow-600" />,
      buttonText: "View Complete Package",
      buttonVariant: "default" as const,
      highlighted: true
    }
  ];

  const completePackageFeatures = [
    {
      icon: <MapPin className="h-5 w-5 text-blue-600" />,
      title: "Smart Location Detection",
      description: "Automatic ZIP code recognition with 5000-mile coverage"
    },
    {
      icon: <Search className="h-5 w-5 text-green-600" />,
      title: "Advanced Search Engine",
      description: "Two-tier search system for comprehensive inventory access"
    },
    {
      icon: <Globe className="h-5 w-5 text-purple-600" />,
      title: "Global Support",
      description: "Works with US ZIP codes and international postal codes"
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Complete Package Highlight */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            New Release
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Introducing the Complete Package
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our most advanced container procurement solution with intelligent geolocation, 
            nearest depot optimization, and comprehensive global coverage.
          </p>
        </div>

        {/* Complete Package Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {completePackageFeatures.map((feature, index) => (
            <Card key={index} className="text-center border-2 border-blue-100 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="flex justify-center mb-2">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Membership Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {membershipTiers.map((tier, index) => (
            <Card 
              key={index} 
              className={`relative ${
                tier.highlighted 
                  ? 'border-2 border-blue-500 shadow-lg scale-105' 
                  : 'border border-gray-200'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {tier.icon}
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-3xl font-bold text-gray-900">
                  {tier.price}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {tier.name === "Complete Package" ? (
                  <Link href="/complete-package">
                    <Button 
                      className={`w-full ${
                        tier.highlighted 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                          : ''
                      }`}
                      variant={tier.buttonVariant}
                    >
                      {tier.buttonText}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    className="w-full"
                    variant={tier.buttonVariant}
                  >
                    {tier.buttonText}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Experience Advanced Container Search?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers who use our intelligent location-based 
            search to find containers faster and more efficiently than ever before.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/complete-package">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Star className="h-5 w-5 mr-2" />
                Explore Complete Package
              </Button>
            </Link>
            
            <Button 
              size="lg"
              variant="outline"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipCTA;
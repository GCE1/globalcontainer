import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown, Star, Shield, Users, BarChart3 } from "lucide-react";
// PayPal components removed

const SUBSCRIPTION_TIERS = {
  insights: {
    name: "Insights Tier",
    price: "$49",
    description: "Analytics & Tracking",
    features: [
      "Track All Container Purchases by Location",
      "Track All Container Leases by Location", 
      "Analytics Dashboard with Performance Metrics",
      "Monthly Insights Reports & Cost Analysis"
    ],
    icon: Star,
    color: "text-blue-600"
  },
  expert: {
    name: "Expert Tier",
    price: "$149", 
    description: "Leasing",
    features: [
      "Everything in Insights", 
      "Leasing Throughout 89 Countries",
      "Utilize SOC Rates",
      "Foreign Trade Depots",
      "Don't pay VAT & Duty Fees before products are sold or relocated"
    ],
    icon: Crown,
    color: "text-purple-600"
  },
  pro: {
    name: "Professional Tier", 
    price: "$199",
    description: "Wholesale",
    features: [
      "Everything in Expert",
      "Wholesale Rates Throughout 89 Countries",
      "CRM Dashboard Optimize Sales & Margins",
      "Depot Directory",
      "Buy Now Pay Later Options Allowing for customer Reassurances"
    ],
    icon: Zap,
    color: "text-green-600"
  }
};

export default function Subscribe() {
  const [selectedTier, setSelectedTier] = useState<'insights' | 'expert' | 'pro' | null>(null);
  const { data: userRoles, isLoading: rolesLoading } = useUserRoles();

  const handleSubscriptionSuccess = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#3f84ee] mb-4">
              Choose Your Membership Tier
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock powerful container management platforms with our subscription tiers. 
              Each tier builds upon the previous to give you comprehensive access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Object.entries(SUBSCRIPTION_TIERS).map(([tier, info]) => {
            const Icon = info.icon;
            // Map tier names to role types - direct mapping since they match now
            const roleType = tier; // insights, expert, pro (only paid tiers)
            const hasCurrentRole = !rolesLoading && userRoles && typeof userRoles === 'object' && userRoles !== null && 'roles' in userRoles && Array.isArray(userRoles.roles) && userRoles.roles.some((role: any) => 
              role.role_type === roleType && role.subscription_status === 'active'
            ) || false;
            
            return (
              <Card 
                key={tier}
                className={`relative overflow-visible transition-all duration-300 hover:shadow-lg flex flex-col h-full ${
                  selectedTier === tier ? 'ring-2 ring-[#3f84ee] shadow-lg' : ''
                } ${hasCurrentRole ? 'border-green-500 bg-green-50' : ''}`}
              >
                {hasCurrentRole && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Active Membership
                    </span>
                  </div>
                )}
                
                {/* PayPal Buy Now Pay Later Logo */}
                <div className="absolute top-6 right-6 z-10">
                  <img 
                    src="/attached_assets/PayPal-Buynow-pay-later.png"
                    alt="PayPal Buy Now Pay Later"
                    className="h-9 w-auto border border-white/30 rounded"
                    style={{ 
                      filter: 'contrast(1.15) brightness(1.08) saturate(1.05)',
                      imageRendering: '-webkit-optimize-contrast'
                    }}
                  />
                </div>

                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    tier === 'insights' ? 'bg-blue-100' : 
                    tier === 'expert' ? 'bg-purple-100' : 'bg-green-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold text-[#3f84ee]">
                    {info.name}
                  </CardTitle>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {info.price}
                    <span className="text-lg font-normal text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600">{info.description}</p>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  <ul className="space-y-3 flex-1">
                    {info.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6 mt-auto">
                    {hasCurrentRole ? (
                      <Button 
                        onClick={() => {
                          // Navigate to the appropriate dashboard based on role
                          if (roleType === 'insights') {
                            window.location.href = '/insights-analytics';
                          } else if (roleType === 'expert') {
                            window.location.href = '/leasing-manager';
                          } else if (roleType === 'pro') {
                            window.location.href = '/wholesale-manager';
                          }
                        }}
                        className="w-full bg-green-500 hover:bg-green-600"
                      >
                        Dashboard
                      </Button>
                    ) : selectedTier === tier ? (
                      <div className="space-y-4">
                        <Button 
                          onClick={() => {
                            // Navigate to payment page with tier information
                            window.location.href = `/payment?tier=${roleType}&price=${info.price.replace('$', '')}&name=${encodeURIComponent(info.name)}`;
                          }}
                          className="w-full bg-[#3f84ee] hover:bg-[#2e6bc7]"
                        >
                          Continue to Payment
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedTier(null)}
                          className="w-full"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => setSelectedTier(tier as 'insights' | 'expert' | 'pro')}
                        className="w-full bg-[#3f84ee] hover:bg-[#2e6bc7]"
                      >
                        Subscribe Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Active subscription section removed - no auth required */}
        </div>
      </div>
      <Footer />
    </div>
  );
}
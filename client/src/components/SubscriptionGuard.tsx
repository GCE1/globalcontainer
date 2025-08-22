import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Zap, Crown, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface SubscriptionGuardProps {
  requiredTier: 'insights' | 'professional' | 'expert';
  platformName: string;
  children: React.ReactNode;
}

const TIER_INFO = {
  insights: {
    name: "Insights Tier",
    price: "$49",
    icon: Star,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  professional: {
    name: "Professional Tier", 
    price: "$199",
    icon: Zap,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  expert: {
    name: "Expert Tier",
    price: "$149",
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  }
};

export default function SubscriptionGuard({ requiredTier, platformName, children }: SubscriptionGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  // Development bypass - remove in production
  const isDevelopment = import.meta.env.DEV;
  
  const hasSubscription = (tier: 'insights' | 'professional' | 'expert') => {
    if (!user) return false;
    
    // Check for active roles in the user object (populated during login)
    if (user.roles && Array.isArray(user.roles)) {
      const hasActiveRole = user.roles.some(role => 
        role.role_type === tier && role.subscription_status === 'active'
      );
      if (hasActiveRole) return true;
    }
    
    // Fallback to legacy subscription check
    const tierLevels = { 'insights': 1, 'professional': 2, 'expert': 3 };
    const userLevel = tierLevels[user.subscriptionTier as keyof typeof tierLevels] || 0;
    const requiredLevel = tierLevels[tier];
    
    return user.subscriptionStatus === 'active' && userLevel >= requiredLevel;
  };

  // Development bypass - allow access when in development mode
  if (isDevelopment && isAuthenticated) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-gray-400" />
              </div>
              <CardTitle className="text-2xl text-[#3f84ee]">Authentication Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Please log in to access the {platformName} platform.
              </p>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="w-full bg-[#3f84ee] hover:bg-[#2e6bc7]"
              >
                Log In with Replit
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hasSubscription(requiredTier)) {
    const tierInfo = TIER_INFO[requiredTier];
    const Icon = tierInfo.icon;

    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <Card className={`w-full max-w-lg ${tierInfo.borderColor}`}>
            <CardHeader className="text-center">
              <div className={`mx-auto w-16 h-16 ${tierInfo.bgColor} rounded-full flex items-center justify-center mb-4`}>
                <Icon className={`w-8 h-8 ${tierInfo.color}`} />
              </div>
              <CardTitle className="text-2xl text-[#3f84ee]">Subscription Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div>
                <p className="text-gray-600 mb-4">
                  Access to the {platformName} platform requires the{" "}
                  <span className="font-semibold">{tierInfo.name}</span> subscription.
                </p>
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="text-2xl font-bold text-gray-900">{tierInfo.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>

              {user?.subscriptionStatus === 'active' ? (
                <div className="space-y-4">
                  <p className="text-orange-600 font-medium">
                    Your current subscription tier doesn't include access to this platform.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/subscribe'}
                    className="w-full bg-[#3f84ee] hover:bg-[#2e6bc7]"
                  >
                    Upgrade Subscription
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => window.location.href = '/subscribe'}
                  className="w-full bg-[#3f84ee] hover:bg-[#2e6bc7]"
                >
                  Subscribe Now
                </Button>
              )}

              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
}
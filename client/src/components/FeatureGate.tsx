import { ReactNode } from "react";
import { useSubscription, SubscriptionFeatures } from "@/hooks/useSubscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Star } from "lucide-react";
import { Link } from "wouter";

interface FeatureGateProps {
  feature: keyof SubscriptionFeatures;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

export function FeatureGate({ 
  feature, 
  children, 
  fallback, 
  showUpgrade = true 
}: FeatureGateProps) {
  const { canAccess, getUpgradeMessage, currentTier } = useSubscription();

  if (canAccess(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  const getTierIcon = () => {
    switch (currentTier) {
      case "insights":
        return <Star className="h-5 w-5 text-blue-500" />;
      case "professional":
        return <Crown className="h-5 w-5 text-purple-500" />;
      case "expert":
        return <Crown className="h-5 w-5 text-gold-500" />;
      default:
        return <Lock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          {getTierIcon()}
        </div>
        <CardTitle className="text-lg">Premium Feature</CardTitle>
        <CardDescription>
          {getUpgradeMessage(feature)}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Link href="/memberships">
          <Button 
            variant="outline"
            className="w-full border-2 bg-[#001937] hover:bg-[#33d2b9] text-white hover:text-white border-[#001937] hover:border-[#33d2b9] px-4 py-2 rounded-lg flex items-center transition duration-300 h-auto group justify-center"
          >
            View Subscription Plans
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Simplified wrapper for disabling buttons/actions
interface FeatureButtonProps {
  feature: keyof SubscriptionFeatures;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function FeatureButton({ 
  feature, 
  children, 
  onClick, 
  className,
  variant = "default"
}: FeatureButtonProps) {
  const { canAccess, getUpgradeMessage } = useSubscription();

  if (!canAccess(feature)) {
    return (
      <Button 
        variant="outline" 
        className={`${className} opacity-50 cursor-not-allowed`}
        disabled
        title={getUpgradeMessage(feature)}
      >
        <Lock className="h-4 w-4 mr-2" />
        {children}
      </Button>
    );
  }

  return (
    <Button 
      variant={variant}
      className={className}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

// Wrapper for hiding content behind subscription
interface SubscriptionWrapperProps {
  tier: "insights" | "professional" | "expert";
  children: ReactNode;
}

export function SubscriptionWrapper({ tier, children }: SubscriptionWrapperProps) {
  const { currentTier, isActive } = useSubscription();
  
  const tierOrder = { free: 0, insights: 1, professional: 2, expert: 3 };
  const currentTierLevel = currentTier ? tierOrder[currentTier] : 0;
  const requiredTierLevel = tierOrder[tier];
  
  if (!isActive || currentTierLevel < requiredTierLevel) {
    const tierNames = {
      insights: "Insights",
      professional: "Professional", 
      expert: "Expert"
    };
    
    return (
      <div className="relative">
        <div className="blur-sm opacity-50 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="max-w-sm">
            <CardHeader className="text-center">
              <Lock className="h-8 w-8 mx-auto mb-2 text-gray-500" />
              <CardTitle>
                {tierNames[tier]} Feature
              </CardTitle>
              <CardDescription>
                Upgrade to access this feature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/memberships">
                <Button 
                  variant="outline"
                  className="w-full border-2 bg-[#001937] hover:bg-[#33d2b9] text-white hover:text-white border-[#001937] hover:border-[#33d2b9] px-4 py-2 rounded-lg flex items-center transition duration-300 h-auto group justify-center"
                >
                  Upgrade Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
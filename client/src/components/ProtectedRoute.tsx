import React from "react";
import { useRequireMembership } from "@/hooks/useMembership";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Lock, Crown, TrendingUp, Building2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPlan?: 'insights' | 'expert' | 'pro';
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPlan,
  fallback 
}) => {
  const [, setLocation] = useLocation();
  const { isAllowed, isLoading } = useRequireMembership(requiredPlan);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying membership...</p>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    if (fallback) {
      return <>{fallback}</>;
    }

    const planInfo = {
      insights: { name: "Insights", icon: TrendingUp, color: "bg-blue-500" },
      expert: { name: "Expert", icon: Building2, color: "bg-green-500" },
      pro: { name: "Pro", icon: Crown, color: "bg-purple-500" }
    };

    const plan = requiredPlan ? planInfo[requiredPlan] : null;
    const PlanIcon = plan?.icon || Lock;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 ${plan?.color || 'bg-gray-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <PlanIcon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-blue-700">
              {requiredPlan ? `${plan?.name} Membership Required` : 'Membership Required'}
            </CardTitle>
            <CardDescription>
              {requiredPlan 
                ? `You need an active ${plan?.name} membership or higher to access this feature.`
                : 'You need an active membership to access this feature.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setLocation('/membership-required')}
            >
              View Membership Plans
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setLocation('/')}
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
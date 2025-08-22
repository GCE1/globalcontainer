import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Container, TrendingUp, Activity, Globe, BarChart3, Ship } from "lucide-react";

export default function WholesaleAnalyticsCards() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/wholesale/analytics"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const analyticsData = analytics as any || {
    totalContainers: 0,
    totalValue: 0,
    averagePrice: 0,
    activeRoutes: 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Containers */}
      <Card className="bg-orange-50 border-orange-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Container className="w-5 h-5 text-orange-600" />
            <h3 className="text-orange-600 font-normal">Total Containers</h3>
          </div>
          <p className="text-2xl text-orange-600 mt-2">
            {analyticsData.totalContainers.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Total Value */}
      <Card className="bg-green-50 border-green-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-green-600 font-normal">Revenue</h3>
          </div>
          <p className="text-2xl text-green-600 mt-2">
            ${analyticsData.totalValue.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Active Routes */}
      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="text-blue-600 font-normal">Active Routes</h3>
          </div>
          <p className="text-2xl text-blue-600 mt-2">
            {analyticsData.activeRoutes.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
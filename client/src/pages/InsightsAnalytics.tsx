import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { BarChart3, TrendingUp, Globe, Activity, Users, DollarSign, ShoppingCart, AlertTriangle, CheckCircle, Clock, Zap, MapPin, Signal, Database, Eye, Award, MessageSquare, Network, FileText, Calendar, Download, Filter, Search, RefreshCw, Bell, Truck, Ship, Plane } from "lucide-react";
import { LuContainer } from 'react-icons/lu';
import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export default function InsightsAnalytics() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [reportDateFrom, setReportDateFrom] = useState("");
  const [reportDateTo, setReportDateTo] = useState("");
  const [reportType, setReportType] = useState("container-performance");
  
  // Fetch user analytics data
  const { data: userAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/user/analytics"],
    retry: 2,
  });

  // Fetch container tracking data
  const { data: containerData, isLoading: containerLoading } = useQuery({
    queryKey: ["/api/containers/tracking"],
    retry: 2,
  });



  // Clean chart data - will populate from real customer transactions
  const shippingTrendsData = [];
  const containerTypesData = [];
  const routePerformanceData = [];
  const predictiveAnalyticsData = [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-64 bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage: `url('/attached_assets/Insights member image_1749682230675.png')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#001937]/60 to-[#004d7a]/40"></div>
          
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center text-center">
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-400/30 px-4 py-2 mx-auto w-fit">
              <Zap className="w-4 h-4 mr-2" />
              Advanced Analytics Platform
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Insights - Analytics & Tracking
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Comprehensive business intelligence platform with real-time container tracking, predictive analytics, and GCE network connectivity
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="bg-gradient-to-r from-[#001937] to-[#004d7a] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {analyticsLoading ? "..." : userAnalytics?.totalContainers || 0}
                    </p>
                    <p className="text-sm text-blue-200">
                      Total containers
                    </p>
                  </div>
                  <LuContainer className="w-8 h-8 text-blue-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      ${analyticsLoading ? "..." : userAnalytics?.totalValue ? (userAnalytics.totalValue / 1000000).toFixed(1) + "M" : "0"}
                    </p>
                    <p className="text-sm text-blue-200">
                      Total portfolio value
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {analyticsLoading ? "..." : userAnalytics?.monthlyGrowth || "0%"}
                    </p>
                    <p className="text-sm text-blue-200">
                      Monthly growth
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {analyticsLoading ? "..." : userAnalytics?.activeContracts || 0}
                    </p>
                    <p className="text-sm text-blue-200">
                      Active contracts
                    </p>
                  </div>
                  <Globe className="w-8 h-8 text-purple-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {analyticsLoading ? "..." : userAnalytics?.accountActivity || 0}%
                    </p>
                    <p className="text-sm text-blue-200">
                      Account activity
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-yellow-300" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-gray-100 p-1 rounded-lg gap-1">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md text-xs sm:text-sm px-1 sm:px-3 py-2 min-h-[44px] flex items-center justify-center"
            >
              <span className="hidden sm:inline">Real-Time </span>Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md text-xs sm:text-sm px-1 sm:px-3 py-2 min-h-[44px] flex items-center justify-center"
            >
              <span className="hidden sm:inline">Predictive </span>Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md text-xs sm:text-sm px-1 sm:px-3 py-2 min-h-[44px] flex items-center justify-center"
            >
              <span className="hidden sm:inline">Custom </span>Reports
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md text-xs sm:text-sm px-1 sm:px-3 py-2 min-h-[44px] flex items-center justify-center"
            >
              <span className="hidden sm:inline">Performance </span>Metrics
            </TabsTrigger>
            <TabsTrigger 
              value="visualizations" 
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md text-xs sm:text-sm px-1 sm:px-3 py-2 min-h-[44px] flex items-center justify-center"
            >
              <span className="hidden sm:inline">Interactive </span>Charts
            </TabsTrigger>
          </TabsList>

          {/* Real-Time Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Control Panel */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-4">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last Hour</SelectItem>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-400/30 w-fit">
                <Signal className="w-3 h-3 mr-1" />
                Live Data
              </Badge>
            </div>

            {/* Live Container Tracking Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-red-500" />
                    Live Container Locations
                  </CardTitle>
                  <CardDescription>Real-time GPS tracking of active containers</CardDescription>
                </CardHeader>
                <CardContent>
                  {containerLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                      <p className="text-sm text-gray-600">Loading container locations...</p>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium">No tracked containers</p>
                      <p className="text-sm">GPS tracking data will appear when you have active container shipments</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-500" />
                    System Health Monitor
                  </CardTitle>
                  <CardDescription>Real-time system performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No system metrics available</p>
                    <p className="text-sm">Performance data will be tracked when you have active container operations</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-orange-500" />
                    Live Alerts
                  </CardTitle>
                  <CardDescription>Critical notifications and system alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                    <p className="font-medium">No active alerts</p>
                    <p className="text-sm">Notifications will appear here when you have active container shipments</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-Time Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Container Movement Trends</CardTitle>
                  <CardDescription>Live tracking of container movements across regions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-20 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No movement data available</p>
                    <p className="text-sm">Charts will populate with your container transaction history</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Route Performance</CardTitle>
                  <CardDescription>Real-time delivery performance by shipping route</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-20 text-gray-500">
                    <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No route data available</p>
                    <p className="text-sm">Performance metrics will show when you have active shipping routes</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Predictive Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    AI-Powered Demand Forecasting
                  </CardTitle>
                  <CardDescription>Machine learning predictions for container demand</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-20 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No forecasting data available</p>
                    <p className="text-sm">AI predictions will appear after you establish transaction patterns</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2 text-purple-600" />
                    Market Intelligence
                  </CardTitle>
                  <CardDescription>Advanced market analysis and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No market intelligence available</p>
                    <p className="text-sm">Insights will be generated from your trading activity and market participation</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Insights Dashboard</CardTitle>
                <CardDescription>AI-driven predictions and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">No predictive insights available</p>
                  <p className="text-sm">AI-driven predictions will be generated from your portfolio activity</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Reports */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Custom Report Generator
                </CardTitle>
                <CardDescription>Generate tailored reports based on your specific criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="container-performance">Container Performance</SelectItem>
                        <SelectItem value="route-analysis">Route Analysis</SelectItem>
                        <SelectItem value="cost-optimization">Cost Optimization</SelectItem>
                        <SelectItem value="compliance">Compliance Report</SelectItem>
                        <SelectItem value="financial">Financial Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-from">Date From</Label>
                    <Input
                      type="date"
                      value={reportDateFrom}
                      onChange={(e) => setReportDateFrom(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-to">Date To</Label>
                    <Input
                      type="date"
                      value={reportDateTo}
                      onChange={(e) => setReportDateTo(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="asia-pacific">Asia-Pacific</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="americas">Americas</SelectItem>
                        <SelectItem value="middle-east">Middle East</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Search className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Reports</CardTitle>
                  <CardDescription>Pre-configured report templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium">Monthly Performance</div>
                      <div className="text-sm text-gray-600">Container utilization and efficiency metrics</div>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium">Route Optimization</div>
                      <div className="text-sm text-gray-600">Cost and time savings analysis</div>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="font-medium">Compliance Dashboard</div>
                      <div className="text-sm text-gray-600">Regulatory compliance tracking</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Your recently generated reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Q2 Performance</div>
                        <div className="text-sm text-gray-600">Generated 2 days ago</div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Cost Analysis</div>
                        <div className="text-sm text-gray-600">Generated 1 week ago</div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Reports</CardTitle>
                  <CardDescription>Automated report delivery</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Weekly Summary</div>
                      <div className="text-sm text-gray-600">Every Monday at 9:00 AM</div>
                      <Badge variant="outline" className="mt-1 text-green-600 border-green-200">Active</Badge>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Monthly Analytics</div>
                      <div className="text-sm text-gray-600">First of each month</div>
                      <Badge variant="outline" className="mt-1 text-green-600 border-green-200">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Metrics */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    Operational Efficiency
                  </CardTitle>
                  <CardDescription>Key performance indicators and efficiency metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No efficiency metrics available</p>
                    <p className="text-sm">Performance data will be calculated from your container operations and transactions</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Financial Performance
                  </CardTitle>
                  <CardDescription>Revenue and cost analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No financial data available</p>
                    <p className="text-sm">Revenue and cost metrics will appear when you have completed transactions</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Benchmarks</CardTitle>
                <CardDescription>Industry comparison and benchmarking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">No benchmark data available</p>
                  <p className="text-sm">Industry comparisons will be generated from your performance history</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interactive Visualizations */}
          <TabsContent value="visualizations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Container Types Distribution</CardTitle>
                  <CardDescription>Breakdown of container types in your fleet</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={containerTypesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {containerTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                  <CardDescription>Monthly revenue and efficiency correlation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={shippingTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue ($)" />
                      <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#3B82F6" name="Efficiency %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics Dashboard</CardTitle>
                <CardDescription>Interactive charts and data visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={shippingTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="containers" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                    <Area type="monotone" dataKey="efficiency" stackId="2" stroke="#10B981" fill="#10B981" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>
      </div>
    </div>
  );
}
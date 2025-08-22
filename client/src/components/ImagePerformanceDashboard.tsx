import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { imagePerformanceMonitor } from '@/lib/imagePerformanceMonitor';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Zap, AlertTriangle, CheckCircle, TrendingUp, Monitor } from 'lucide-react';

export default function ImagePerformanceDashboard() {
  const [stats, setStats] = useState(imagePerformanceMonitor.getPerformanceStats());
  const [pageStats, setPageStats] = useState(imagePerformanceMonitor.getContainerServicePagesReport());
  const [suggestions, setSuggestions] = useState(imagePerformanceMonitor.getOptimizationSuggestions());

  useEffect(() => {
    const updateStats = () => {
      setStats(imagePerformanceMonitor.getPerformanceStats());
      setPageStats(imagePerformanceMonitor.getContainerServicePagesReport());
      setSuggestions(imagePerformanceMonitor.getOptimizationSuggestions());
    };

    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const getPerformanceColor = (value: number, type: 'time' | 'rate') => {
    if (type === 'time') {
      if (value < 500) return 'text-green-600';
      if (value < 1500) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (value > 80) return 'text-green-600';
      if (value > 50) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const pageChartData = Object.entries(pageStats).map(([page, data]) => ({
    page: page.replace('container-', ''),
    avgTime: Math.round(data.averageLoadTime),
    cacheRate: Math.round(data.cacheHitRate),
    totalLoads: data.totalLoads
  }));

  const performanceDistribution = [
    { name: 'Fast (<500ms)', value: 0, color: '#10B981' },
    { name: 'Good (500-1500ms)', value: 0, color: '#F59E0B' },
    { name: 'Slow (>1500ms)', value: 0, color: '#EF4444' }
  ];

  // Calculate distribution based on current stats
  const metrics = imagePerformanceMonitor.exportMetrics();
  const fastLoads = metrics.filter(m => m.success && m.loadTime < 500).length;
  const goodLoads = metrics.filter(m => m.success && m.loadTime >= 500 && m.loadTime < 1500).length;
  const slowLoads = metrics.filter(m => m.success && m.loadTime >= 1500).length;

  performanceDistribution[0].value = fastLoads;
  performanceDistribution[1].value = goodLoads;
  performanceDistribution[2].value = slowLoads;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Image Performance Dashboard</h2>
          <p className="text-gray-600 mt-1">Monitor and optimize image loading across container service pages</p>
        </div>
        <Button 
          onClick={() => imagePerformanceMonitor.clearMetrics()}
          variant="outline"
          className="text-blue-600 border-blue-300 hover:bg-blue-50"
        >
          <Monitor className="h-4 w-4 mr-2" />
          Clear Metrics
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Load Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(stats.averageLoadTime, 'time')}`}>
              {Math.round(stats.averageLoadTime)}ms
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Fastest: {Math.round(stats.fastestLoad)}ms | Slowest: {Math.round(stats.slowestLoad)}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(stats.cacheHitRate, 'rate')}`}>
              {Math.round(stats.cacheHitRate)}%
            </div>
            <Progress value={stats.cacheHitRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Images Loaded</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalLoads}</div>
            <p className="text-xs text-gray-500 mt-1">
              Success Rate: {Math.round(100 - stats.errorRate)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.errorRate > 5 ? 'text-red-600' : 'text-green-600'}`}>
              {Math.round(stats.errorRate)}%
            </div>
            <Progress value={stats.errorRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">Page Performance</TabsTrigger>
          <TabsTrigger value="distribution">Load Time Distribution</TabsTrigger>
          <TabsTrigger value="suggestions">Optimization Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Container Service Pages Performance</CardTitle>
              <CardDescription>Average load times and cache hit rates by page</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pageChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="page" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="avgTime" fill="#3B82F6" name="Avg Load Time (ms)" />
                  <Bar yAxisId="right" dataKey="cacheRate" fill="#10B981" name="Cache Hit Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Load Time Distribution</CardTitle>
              <CardDescription>Breakdown of image loading performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Optimization Suggestions</CardTitle>
              <CardDescription>Recommendations to improve image loading performance</CardDescription>
            </CardHeader>
            <CardContent>
              {suggestions.length > 0 ? (
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-900">{suggestion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-900">
                    Great job! Your image loading performance is optimized. No suggestions at this time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Performance Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700">✓</Badge>
                  <p className="text-sm">Image caching system active</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700">✓</Badge>
                  <p className="text-sm">Priority loading for critical images</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700">✓</Badge>
                  <p className="text-sm">Performance monitoring enabled</p>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700">✓</Badge>
                  <p className="text-sm">Automatic preloading for container service pages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import OptimizedHeroImage from '@/components/OptimizedHeroImage';
import ImagePerformanceDashboard from '@/components/ImagePerformanceDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { imageCache } from '@/lib/imageCache';
import { imagePerformanceMonitor } from '@/lib/imagePerformanceMonitor';
import { PlayCircle, BarChart3, Settings, Zap } from 'lucide-react';

export default function ImagePerformanceTest() {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const testImages = [
    '/attached_assets/hero%20image.png',
    '/attached_assets/container-depot_1749154371445.png',
    '/attached_assets/Container-route-tracking_1749584960797.png',
    '/attached_assets/Membership-hero-image_1749589356481.png',
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  ];

  const runPerformanceTest = async () => {
    setIsTestRunning(true);
    const startTime = performance.now();
    
    try {
      // Clear cache to test fresh loads
      imageCache.clearCache();
      
      // Load all test images
      const loadPromises = testImages.map(src => 
        imageCache.loadImage(src, false, 'performance-test')
      );
      
      await Promise.allSettled(loadPromises);
      
      // Wait a moment for metrics to be recorded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Get performance stats
      const stats = imagePerformanceMonitor.getPerformanceStats();
      const suggestions = imagePerformanceMonitor.getOptimizationSuggestions();
      
      setTestResults({
        totalTime: Math.round(totalTime),
        stats,
        suggestions,
        testImages: testImages.length
      });
      
    } catch (error) {
      console.error('Performance test failed:', error);
    } finally {
      setIsTestRunning(false);
    }
  };

  const runCacheTest = async () => {
    setIsTestRunning(true);
    
    try {
      // Preload images first
      await Promise.allSettled(
        testImages.map(src => imageCache.loadImage(src, false, 'cache-test'))
      );
      
      // Now test cached performance
      const startTime = performance.now();
      
      await Promise.allSettled(
        testImages.map(src => imageCache.loadImage(src, false, 'cache-test'))
      );
      
      const endTime = performance.now();
      const cacheTime = endTime - startTime;
      
      const stats = imagePerformanceMonitor.getPerformanceStats();
      
      setTestResults({
        totalTime: Math.round(cacheTime),
        stats,
        suggestions: [],
        testImages: testImages.length,
        cacheTest: true
      });
      
    } catch (error) {
      console.error('Cache test failed:', error);
    } finally {
      setIsTestRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Image Performance Testing Center</h1>
          <p className="text-gray-600">
            Test and monitor the advanced image optimization system for container service pages
          </p>
        </div>

        <Tabs defaultValue="testing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="testing" className="flex items-center space-x-2">
              <PlayCircle className="h-4 w-4" />
              <span>Performance Testing</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Live Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Optimization Demo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="testing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Performance Tests</span>
                  </CardTitle>
                  <CardDescription>
                    Run comprehensive tests to measure image loading performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col space-y-3">
                    <Button 
                      onClick={runPerformanceTest}
                      disabled={isTestRunning}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isTestRunning ? 'Running Network Load Test...' : 'Run Network Load Test'}
                    </Button>
                    
                    <Button 
                      onClick={runCacheTest}
                      disabled={isTestRunning}
                      variant="outline"
                      className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      {isTestRunning ? 'Running Cache Performance Test...' : 'Run Cache Performance Test'}
                    </Button>
                  </div>
                  
                  {isTestRunning && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Testing {testImages.length} images...</span>
                        <span>Please wait</span>
                      </div>
                      <Progress value={undefined} className="animate-pulse" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">Test Results</CardTitle>
                  <CardDescription>
                    Latest performance test results and metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {testResults ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-900">
                            {testResults.totalTime}ms
                          </div>
                          <div className="text-sm text-blue-600">
                            {testResults.cacheTest ? 'Cache Load Time' : 'Total Load Time'}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-900">
                            {testResults.testImages}
                          </div>
                          <div className="text-sm text-green-600">Images Tested</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Average Load Time:</span>
                          <Badge variant="outline">
                            {Math.round(testResults.stats.averageLoadTime)}ms
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Cache Hit Rate:</span>
                          <Badge variant="outline">
                            {Math.round(testResults.stats.cacheHitRate)}%
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Error Rate:</span>
                          <Badge variant="outline">
                            {Math.round(testResults.stats.errorRate)}%
                          </Badge>
                        </div>
                      </div>
                      
                      {testResults.suggestions.length > 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                          <h4 className="font-medium text-yellow-900 mb-2">Optimization Suggestions:</h4>
                          <ul className="text-sm text-yellow-800 space-y-1">
                            {testResults.suggestions.map((suggestion: string, index: number) => (
                              <li key={index}>• {suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Run a performance test to see results
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <ImagePerformanceDashboard />
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-900">Optimization Features Demo</CardTitle>
                <CardDescription>
                  See the advanced image optimization system in action
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-3">Optimized Hero Image</h3>
                    <OptimizedHeroImage
                      src="/attached_assets/Container-route-tracking_1749584960797.png"
                      className="h-48 rounded-lg"
                      priority={true}
                      fallbackColor="from-blue-400 to-blue-600"
                    >
                      <div className="relative z-10 p-6">
                        <h2 className="text-white text-xl font-bold">
                          Advanced Image Optimization
                        </h2>
                        <p className="text-blue-100 mt-2">
                          Automatic caching, priority loading, and performance monitoring
                        </p>
                      </div>
                    </OptimizedHeroImage>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-blue-900">Active Features</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-green-100 text-green-800">✓ Active</Badge>
                        <span className="text-sm">Intelligent image caching system</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-green-100 text-green-800">✓ Active</Badge>
                        <span className="text-sm">Priority loading for critical images</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-green-100 text-green-800">✓ Active</Badge>
                        <span className="text-sm">Real-time performance monitoring</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-green-100 text-green-800">✓ Active</Badge>
                        <span className="text-sm">Automatic container service page preloading</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-green-100 text-green-800">✓ Active</Badge>
                        <span className="text-sm">Progressive loading with fallbacks</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-blue-100 text-blue-800">📊 Analytics</Badge>
                        <span className="text-sm">Performance metrics and optimization suggestions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
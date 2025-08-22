// Image performance monitoring and analytics for container service pages
interface ImageLoadMetrics {
  src: string;
  loadTime: number;
  timestamp: number;
  fromCache: boolean;
  page: string;
  success: boolean;
  error?: string;
}

interface PerformanceStats {
  totalLoads: number;
  averageLoadTime: number;
  cacheHitRate: number;
  errorRate: number;
  fastestLoad: number;
  slowestLoad: number;
}

class ImagePerformanceMonitor {
  private metrics: ImageLoadMetrics[] = [];
  private maxMetrics = 1000; // Limit stored metrics

  recordImageLoad(src: string, loadTime: number, fromCache: boolean, page: string, success: boolean, error?: string) {
    const metric: ImageLoadMetrics = {
      src,
      loadTime,
      timestamp: Date.now(),
      fromCache,
      page,
      success,
      error
    };

    this.metrics.push(metric);

    // Maintain maximum metrics limit
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log performance insights in development
    if (import.meta.env.DEV) {
      console.log(`Image Performance: ${src} loaded in ${loadTime}ms (${fromCache ? 'from cache' : 'network'}) on ${page}`);
    }
  }

  getPerformanceStats(): PerformanceStats {
    if (this.metrics.length === 0) {
      return {
        totalLoads: 0,
        averageLoadTime: 0,
        cacheHitRate: 0,
        errorRate: 0,
        fastestLoad: 0,
        slowestLoad: 0
      };
    }

    const successfulLoads = this.metrics.filter(m => m.success);
    const loadTimes = successfulLoads.map(m => m.loadTime);
    const cacheHits = this.metrics.filter(m => m.fromCache).length;
    const errors = this.metrics.filter(m => !m.success).length;

    return {
      totalLoads: this.metrics.length,
      averageLoadTime: loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length || 0,
      cacheHitRate: (cacheHits / this.metrics.length) * 100,
      errorRate: (errors / this.metrics.length) * 100,
      fastestLoad: Math.min(...loadTimes) || 0,
      slowestLoad: Math.max(...loadTimes) || 0
    };
  }

  getPagePerformance(page: string): PerformanceStats {
    const pageMetrics = this.metrics.filter(m => m.page === page);
    
    if (pageMetrics.length === 0) {
      return {
        totalLoads: 0,
        averageLoadTime: 0,
        cacheHitRate: 0,
        errorRate: 0,
        fastestLoad: 0,
        slowestLoad: 0
      };
    }

    const successfulLoads = pageMetrics.filter(m => m.success);
    const loadTimes = successfulLoads.map(m => m.loadTime);
    const cacheHits = pageMetrics.filter(m => m.fromCache).length;
    const errors = pageMetrics.filter(m => !m.success).length;

    return {
      totalLoads: pageMetrics.length,
      averageLoadTime: loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length || 0,
      cacheHitRate: (cacheHits / pageMetrics.length) * 100,
      errorRate: (errors / pageMetrics.length) * 100,
      fastestLoad: Math.min(...loadTimes) || 0,
      slowestLoad: Math.max(...loadTimes) || 0
    };
  }

  // Get optimization suggestions based on performance data
  getOptimizationSuggestions(): string[] {
    const stats = this.getPerformanceStats();
    const suggestions: string[] = [];

    if (stats.averageLoadTime > 2000) {
      suggestions.push("Consider using smaller image sizes or WebP format for faster loading");
    }

    if (stats.cacheHitRate < 50) {
      suggestions.push("Increase image preloading for frequently accessed pages");
    }

    if (stats.errorRate > 5) {
      suggestions.push("Review image URLs and add better error handling");
    }

    if (stats.slowestLoad > 5000) {
      suggestions.push("Implement lazy loading for non-critical images");
    }

    return suggestions;
  }

  // Get container service pages performance summary
  getContainerServicePagesReport(): Record<string, PerformanceStats> {
    const containerPages = [
      'container-sales',
      'container-leasing', 
      'container-transport',
      'container-storage',
      'container-tracking',
      'container-modifications'
    ];

    const report: Record<string, PerformanceStats> = {};
    
    containerPages.forEach(page => {
      report[page] = this.getPagePerformance(page);
    });

    return report;
  }

  clearMetrics() {
    this.metrics = [];
  }

  exportMetrics(): ImageLoadMetrics[] {
    return [...this.metrics];
  }
}

export const imagePerformanceMonitor = new ImagePerformanceMonitor();
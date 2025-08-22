import { Request, Response, NextFunction } from 'express';

interface ImageMetrics {
  path: string;
  size: number;
  format: string;
  loadTime: number;
  userAgent: string;
  timestamp: Date;
}

class ImagePerformanceMonitor {
  private metrics: ImageMetrics[] = [];
  private readonly maxMetrics = 1000; // Keep last 1000 metrics

  addMetric(metric: ImageMetrics) {
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift(); // Remove oldest metric
    }
  }

  getAverageLoadTime(path?: string): number {
    const filteredMetrics = path 
      ? this.metrics.filter(m => m.path === path)
      : this.metrics;
    
    if (filteredMetrics.length === 0) return 0;
    
    return filteredMetrics.reduce((sum, m) => sum + m.loadTime, 0) / filteredMetrics.length;
  }

  getTopSlowImages(count = 10): Array<{path: string, avgLoadTime: number}> {
    const pathMetrics = new Map<string, number[]>();
    
    this.metrics.forEach(m => {
      if (!pathMetrics.has(m.path)) {
        pathMetrics.set(m.path, []);
      }
      pathMetrics.get(m.path)!.push(m.loadTime);
    });

    return Array.from(pathMetrics.entries())
      .map(([path, times]) => ({
        path,
        avgLoadTime: times.reduce((a, b) => a + b, 0) / times.length
      }))
      .sort((a, b) => b.avgLoadTime - a.avgLoadTime)
      .slice(0, count);
  }

  getSummary() {
    const totalImages = this.metrics.length;
    const avgLoadTime = this.getAverageLoadTime();
    const formatDistribution = this.metrics.reduce((acc, m) => {
      acc[m.format] = (acc[m.format] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalImages,
      avgLoadTime: Math.round(avgLoadTime),
      formatDistribution,
      topSlowImages: this.getTopSlowImages(5)
    };
  }
}

export const imagePerformanceMonitor = new ImagePerformanceMonitor();

export const imagePerformanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.path.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i)) {
    return next();
  }

  const startTime = Date.now();
  
  res.on('finish', () => {
    const loadTime = Date.now() - startTime;
    const format = req.path.split('.').pop()?.toLowerCase() || 'unknown';
    
    imagePerformanceMonitor.addMetric({
      path: req.path,
      size: parseInt(res.get('Content-Length') || '0'),
      format,
      loadTime,
      userAgent: req.get('User-Agent') || 'unknown',
      timestamp: new Date()
    });
  });

  next();
};
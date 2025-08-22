import { performance } from 'perf_hooks';

// Performance monitoring for scalability tracking
export class PerformanceMonitor {
  private static metrics: Map<string, { calls: number; totalTime: number; avgTime: number }> = new Map();

  static async measureOperation<T>(operationName: string, operation: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.recordMetric(operationName, duration);
      
      // Log performance for operations taking longer than 1 second
      if (duration > 1000) {
        console.warn(`Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.recordMetric(`${operationName}_error`, duration);
      throw error;
    }
  }

  private static recordMetric(operationName: string, duration: number) {
    const existing = this.metrics.get(operationName);
    
    if (existing) {
      existing.calls += 1;
      existing.totalTime += duration;
      existing.avgTime = existing.totalTime / existing.calls;
    } else {
      this.metrics.set(operationName, {
        calls: 1,
        totalTime: duration,
        avgTime: duration
      });
    }
  }

  static getMetrics() {
    const metricsArray = Array.from(this.metrics.entries()).map(([name, data]) => ({
      operation: name,
      ...data,
      avgTimeFormatted: `${data.avgTime.toFixed(2)}ms`
    }));

    return {
      metrics: metricsArray,
      summary: {
        totalOperations: metricsArray.reduce((sum, m) => sum + m.calls, 0),
        slowestOperation: metricsArray.reduce((prev, curr) => 
          prev.avgTime > curr.avgTime ? prev : curr, metricsArray[0]
        ),
        fastestOperation: metricsArray.reduce((prev, curr) => 
          prev.avgTime < curr.avgTime ? prev : curr, metricsArray[0]
        )
      }
    };
  }

  static resetMetrics() {
    this.metrics.clear();
  }
}

// Database connection pool monitoring
export class DatabaseMonitor {
  static async checkConnectionHealth() {
    const startTime = performance.now();
    
    try {
      // Simple health check query
      const result = await PerformanceMonitor.measureOperation('db_health_check', async () => {
        const { db } = await import('./db');
        return await db.execute('SELECT 1 as health');
      });
      
      const endTime = performance.now();
      
      return {
        healthy: true,
        responseTime: `${(endTime - startTime).toFixed(2)}ms`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        healthy: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString()
      };
    }
  }

  static async getConnectionStats() {
    // In a production environment, this would connect to the actual database
    // pool and return real connection statistics
    return {
      totalConnections: 10,
      activeConnections: 3,
      idleConnections: 7,
      waitingConnections: 0,
      maxConnections: 20
    };
  }
}

// Memory usage monitoring
export class MemoryMonitor {
  static getMemoryUsage() {
    const usage = process.memoryUsage();
    
    return {
      rss: `${Math.round(usage.rss / 1024 / 1024 * 100) / 100} MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
      external: `${Math.round(usage.external / 1024 / 1024 * 100) / 100} MB`,
      arrayBuffers: `${Math.round(usage.arrayBuffers / 1024 / 1024 * 100) / 100} MB`
    };
  }

  static startMemoryMonitoring(intervalMs: number = 30000) {
    setInterval(() => {
      const usage = this.getMemoryUsage();
      const heapUsedMB = parseFloat(usage.heapUsed.split(' ')[0]);
      
      // Alert if memory usage exceeds 500MB
      if (heapUsedMB > 500) {
        console.warn(`High memory usage detected: ${usage.heapUsed}`);
      }
    }, intervalMs);
  }
}

// Request rate limiting and tracking
export class RequestTracker {
  private static requests: Map<string, { count: number; lastReset: number }> = new Map();
  private static readonly WINDOW_SIZE = 60000; // 1 minute window

  static trackRequest(endpoint: string, userId?: string) {
    const key = userId ? `${endpoint}:${userId}` : endpoint;
    const now = Date.now();
    
    const existing = this.requests.get(key);
    
    if (!existing || now - existing.lastReset > this.WINDOW_SIZE) {
      this.requests.set(key, { count: 1, lastReset: now });
    } else {
      existing.count += 1;
    }
  }

  static getRequestStats() {
    const now = Date.now();
    const stats = new Map();
    
    for (const [key, data] of this.requests.entries()) {
      if (now - data.lastReset <= this.WINDOW_SIZE) {
        stats.set(key, data.count);
      }
    }
    
    return Object.fromEntries(stats);
  }

  static checkRateLimit(endpoint: string, userId?: string, limit: number = 100): boolean {
    const key = userId ? `${endpoint}:${userId}` : endpoint;
    const existing = this.requests.get(key);
    
    if (!existing) return true;
    
    return existing.count < limit;
  }
}

export { PerformanceMonitor as default };
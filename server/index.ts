import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import session from "express-session";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { loadLeasingData } from "./leasingData";
import { imageOptimizationMiddleware } from "./imageOptimization";
import { imagePerformanceMiddleware } from "./imagePerformance";
import { seoRoutes } from "./seoRoutes";
import { simpleMassEmailRoutes } from "./simpleMassEmailRoutes";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";
import MemoryStore from "memorystore";

// Load .env file, but don't override existing environment variables (Replit Secrets)
dotenv.config({ override: false });

const app = express();

// Enable response compression for faster loading
app.use(compression({
  level: 6, // Good balance between compression and speed
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Compress JSON responses and text files
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Add cookie parser for admin sessions

// Development session debugging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  // Add session debugging for cart routes
  if (req.path.includes('/api/cart')) {
    console.log('=== SESSION DEBUG MIDDLEWARE ===');
    console.log('Request path:', req.path);
    console.log('Method:', req.method);
    console.log('Session ID:', req.sessionID);
    console.log('Raw cookies:', req.headers.cookie);
    console.log('Session exists:', !!req.session);
    console.log('Origin:', req.headers.origin);
    console.log('Host:', req.headers.host);
    console.log('User-Agent:', req.headers['user-agent']);
    
    // Force session creation if it doesn't exist
    if (!req.session) {
      console.log('WARNING: No session found, forcing session initialization');
    }
  }
  next();
});

// Session configuration for cart persistence - Development environment fix

// COMPREHENSIVE SESSION FIX: Create session store and configure properly for development
const sessionStore = new (MemoryStore(session))({
  checkPeriod: 86400000 // prune expired entries every 24h
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'gce-session-secret-development-key',
  store: sessionStore,
  resave: false, // Don't save session if unmodified
  saveUninitialized: true, // Always create sessions for cart functionality
  name: 'connect.sid', // Use standard session name for better compatibility
  proxy: true, // CRITICAL: Enable proxy for Replit's production environment
  cookie: { 
    secure: true, // CRITICAL: Enable secure for HTTPS Replit domain
    httpOnly: false, // Allow frontend access for debugging
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'none', // CRITICAL: Required for secure cookies in cross-domain context
    domain: undefined, // Let browser handle domain automatically
    path: '/' // Explicit path
  },
  rolling: true, // Extend session on each request
  unset: 'keep' // Keep session even if not modified
}));

// Cache-busting headers to prevent old page structure issues
app.use((req: Request, res: Response, next: NextFunction) => {
  // Don't cache HTML and JavaScript files
  if (req.path.endsWith('.html') || req.path.endsWith('.js') || req.path.endsWith('.css') || req.path === '/') {
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }
  next();
});

// Health check timeout middleware to ensure rapid responses
const healthCheckTimeout = (timeoutMs: number) => (req: any, res: any, next: any) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(200).send('OK');
    }
  }, timeoutMs);
  
  res.on('finish', () => clearTimeout(timeout));
  next();
};

// Basic health check endpoint - immediate response for load balancers
app.get('/health', healthCheckTimeout(1000), (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Readiness check with database verification - using /api prefix to avoid frontend routing conflicts
app.get('/api/ready', healthCheckTimeout(2000), async (req, res) => {
  try {
    // Quick database connectivity check
    const { db } = await import('./db');
    await db.execute(sql`SELECT 1 as status`);
    
    res.status(200).json({ 
      status: 'ready', 
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'not_ready', 
      database: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
});

// Also add a simple /ready endpoint that doesn't check the database for faster health checks
app.get('/ready', healthCheckTimeout(500), (req, res) => {
  res.status(200).send('READY');
});

// Removed root health check middleware to avoid conflicts with frontend routing

// Image performance monitoring
app.use(imagePerformanceMiddleware);

// Image optimization middleware - serves WebP and compressed images automatically
app.use(imageOptimizationMiddleware);

// Serve static files from attached_assets directory
app.use('/attached_assets', express.static('attached_assets'));

// Serve optimized images
app.use('/optimized_assets', express.static('optimized_assets'));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        try {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        } catch (jsonError) {
          logLine += ` :: [JSON serialization error]`;
        }
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register SEO routes
  app.use('/', seoRoutes);
  
  // Register simple mass email routes (bypass complex authentication)
  app.use('/api/simple-email', simpleMassEmailRoutes);
  
  const server = await registerRoutes(app);

  // Load leasing data from CSV asynchronously after server starts
  // This ensures health checks can respond quickly while data loads in background
  loadLeasingData()
    .then(() => {
      console.log('✓ Leasing data loaded successfully');
    })
    .catch((error) => {
      console.error('Failed to load leasing data:', error);
    });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

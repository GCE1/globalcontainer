import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key-for-development',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Allow cookies over HTTP in development
      maxAge: sessionTtl,
      sameSite: 'lax',
    },
  });
}

export async function setupSimpleAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Simple demo login endpoint (for development/testing)
  app.get("/api/login", (req, res) => {
    res.status(503).json({ 
      error: 'Authentication service configuration required',
      message: 'Please contact support to configure Replit authentication for this application'
    });
  });

  app.get("/api/callback", (req, res) => {
    res.redirect("/");
  });

  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

  // User endpoint that returns authenticated user or demo user for development
  app.get('/api/auth/user', async (req, res) => {
    try {
      // Check if user has a valid token
      const token = req.headers.authorization?.replace('Bearer ', '');
      console.log('Token received:', token ? 'exists' : 'none');
      
      if (token) {
        // Try to verify the token and get user data
        const jwt = await import('jsonwebtoken');
        const secretKey = process.env.JWT_SECRET || 'fallback_secret_key';
        
        const decoded = jwt.default.verify(token, secretKey) as any;
        console.log('Token decoded successfully, userId:', decoded.userId);
        
        // Get user from database
        const { AuthService } = await import('./auth.js');
        const user = await AuthService.getUserById(decoded.userId);
        console.log('User found:', user ? 'yes' : 'no');
        
        if (user) {
          console.log('Returning authenticated user:', user.email);
          
          // Get user roles to determine dashboard access
          const userRoles = await AuthService.getUserRoles(user.id);
          
          return res.json({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            subscriptionTier: user.subscription_tier,
            subscriptionStatus: user.subscription_status,
            roles: userRoles
          });
        }
      }
      
      console.log('No valid token, returning 401');
      // Return 401 for unauthenticated requests instead of demo user
      return res.status(401).json({ message: 'Access token required' });
    } catch (error) {
      console.error('Error in /api/auth/user:', error);
      // Return 401 for authentication errors
      return res.status(401).json({ message: 'Invalid token' });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // For development, allow all requests to pass through
  next();
};
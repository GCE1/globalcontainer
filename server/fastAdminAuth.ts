import type { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

// In-memory session storage for admin sessions
const adminSessions = new Map<string, any>();

// Export function to get admin session
export function getAdminSession(sessionId: string) {
  const session = adminSessions.get(sessionId);
  if (!session) {
    return null;
  }
  
  // Check if session is expired (24 hours)
  if (Date.now() - session.loginTime > 24 * 60 * 60 * 1000) {
    adminSessions.delete(sessionId);
    return null;
  }
  
  return session;
}

export function registerFastAdminAuth(app: Express): void {
  // Admin login endpoint for GCE email accounts
  app.post('/api/admin/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    console.log('Admin login attempt:', email);
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    try {
      // Query the database for the user
      const [user] = await db.select().from(users).where(eq(users.email, email));
      
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({ 
          success: false, 
          message: "Invalid admin credentials" 
        });
      }

      // Check if user is an admin
      if (user.role !== 'admin') {
        console.log('User is not an admin:', email);
        return res.status(401).json({ 
          success: false, 
          message: "Access denied - admin role required" 
        });
      }

      // Verify password
      const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
      if (!isValidPassword) {
        console.log('Invalid password for:', email);
        return res.status(401).json({ 
          success: false, 
          message: "Invalid admin credentials" 
        });
      }

      // Create session
      const sessionId = Math.random().toString(36);
      adminSessions.set(sessionId, {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        jobTitle: user.jobTitle,
        adminPermissions: user.adminPermissions,
        loginTime: Date.now()
      });

      // Set session cookie with proper configuration for Replit
      console.log('Setting admin session cookie:', sessionId);
      res.cookie('admin_session', sessionId, { 
        httpOnly: false, // Allow JavaScript access for debugging
        secure: false, // Disable secure for development debugging
        sameSite: 'lax', // More permissive for development
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: '/' // Explicit path
      });
      console.log('Admin session cookie set successfully');

      console.log('Admin login successful for:', email);

      return res.json({ 
        success: true, 
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department,
          jobTitle: user.jobTitle,
          adminPermissions: user.adminPermissions
        }
      });

    } catch (error) {
      console.error('Admin login error:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Session check endpoint for email admins
  app.get('/api/admin/check-session', (req: Request, res: Response) => {
    const sessionId = req.cookies?.admin_session;
    
    if (!sessionId) {
      return res.status(401).json({ message: 'No session' });
    }

    const session = adminSessions.get(sessionId);
    if (!session) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    // Check if session is expired (24 hours)
    if (Date.now() - session.loginTime > 24 * 60 * 60 * 1000) {
      adminSessions.delete(sessionId);
      return res.status(401).json({ message: 'Session expired' });
    }

    return res.json(session);
  });

  // Admin logout endpoint
  app.post('/api/admin/logout', (req: Request, res: Response) => {
    const sessionId = req.cookies?.admin_session;
    
    if (sessionId) {
      adminSessions.delete(sessionId);
    }
    
    res.clearCookie('admin_session');
    return res.json({ success: true, message: 'Logged out successfully' });
  });

  // Admin authentication middleware
  app.use('/api/admin', (req: any, res: Response, next: any) => {
    // Skip authentication for login, logout, and session check endpoints
    if (req.path === '/login' || req.path === '/check-session' || req.path === '/logout') {
      return next();
    }

    const sessionId = req.cookies?.admin_session;
    
    if (!sessionId || !adminSessions.has(sessionId)) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const session = adminSessions.get(sessionId);
    
    // Check if session is expired
    if (Date.now() - session.loginTime > 24 * 60 * 60 * 1000) {
      adminSessions.delete(sessionId);
      return res.status(401).json({ message: 'Session expired' });
    }

    req.adminUser = session;
    next();
  });
}
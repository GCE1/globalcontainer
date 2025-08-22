import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { findNearbyByPostalCode } from "./utils/google-maps";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";
import { pieceofshitfile } from "./data/pieceofshit.csv";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "container-exchange-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 }, // 24 hours
      store: new SessionStore({
        checkPeriod: 86400000 // 24 hours
      })
    })
  );

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: () => void) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // User authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const registrationSchema = insertUserSchema.extend({
        email: z.string().email(),
        password: z.string().min(8)
      });

      const validatedData = registrationSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({
        message: "User registered successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Error registering user" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set user in session
      req.session.userId = user.id;

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        message: "Login successful",
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(500).json({ message: "Error during login" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.status(200).json({ message: "Logout successful" });
    });
  });

  // User profile route
  app.get('/api/user/profile', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user profile" });
    }
  });

  // Container routes
  app.get('/api/containers', async (req, res) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const types = req.query.types ? (req.query.types as string).split(',') : undefined;
      const conditions = req.query.conditions ? (req.query.conditions as string).split(',') : undefined;
      const region = req.query.region as string | undefined;
      const city = req.query.city as string | undefined;
      const postalCode = req.query.postalCode as string | undefined;
      const priceMin = req.query.priceMin ? parseFloat(req.query.priceMin as string) : undefined;
      const priceMax = req.query.priceMax ? parseFloat(req.query.priceMax as string) : undefined;
      let query = req.query.query as string | undefined;
      const sortBy = req.query.sortBy as string | undefined;
      const depotId = req.query.depotId ? parseInt(req.query.depotId as string) : undefined;
      let searchWithinRadius = req.query.radius === 'true';
      
      // Auto-detect zip codes in the main search query
      let detectedPostalCode = postalCode;
      let autoLocationSearch = false;
      
      // Check if the main query looks like a zip code (US: 5 digits or 5+4, or postal code patterns)
      if (query && !postalCode) {
        const zipCodePattern = /^\b(\d{5}(-\d{4})?|[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d)\b$/;
        if (zipCodePattern.test(query.trim())) {
          detectedPostalCode = query.trim();
          autoLocationSearch = true;
          searchWithinRadius = true;
          console.log(`Auto-detected zip code in search query: ${detectedPostalCode}`);
          // Clear the query since we're using it as a location search
          query = undefined;
        }
      }
      
      // Location-based search parameters
      let latitude = req.query.latitude ? parseFloat(req.query.latitude as string) : undefined;
      let longitude = req.query.longitude ? parseFloat(req.query.longitude as string) : undefined;
      let radiusMiles = req.query.radiusMiles 
        ? parseFloat(req.query.radiusMiles as string) 
        : (autoLocationSearch ? 100 : 50); // Default 100 miles for auto-detected, 50 for manual
      
      // If we have a postal code (either from parameter or auto-detected) and search within radius is enabled, use Google Maps API to geocode it
      let usingFallbackGeocoding = false;
      if (detectedPostalCode && searchWithinRadius && !latitude && !longitude) {
        try {
          console.log(`Geocoding postal code: ${detectedPostalCode} with radius: ${radiusMiles} miles${autoLocationSearch ? ' (auto-detected from search)' : ''}`);
          const locationData = await findNearbyByPostalCode(detectedPostalCode, radiusMiles);
          
          if (locationData) {
            latitude = locationData.latitude;
            longitude = locationData.longitude;
            usingFallbackGeocoding = locationData.usingFallback || false;
            console.log(`Successfully geocoded postal code to: (${latitude}, ${longitude}) with radius: ${radiusMiles} miles${usingFallbackGeocoding ? ' (using fallback coordinates)' : ''}`);
          } else {
            console.warn(`Failed to geocode postal code: ${postalCode}`);
          }
        } catch (error) {
          console.error('Error geocoding postal code:', error);
        }
      }
      
      // Log the search parameters for debugging
      console.log('Search parameters (raw query):', req.query);
      console.log('Parsed search parameters:', {
        page,
        types,
        conditions,
        region,
        city,
        postalCode: detectedPostalCode,
        priceMin,
        priceMax,
        query,
        sortBy,
        latitude: detectedLatitude,
        longitude: detectedLongitude,
        radiusMiles,
        searchWithinRadius,
        autoLocationSearch,
      });
      
      // Log radius search information
      if (searchWithinRadius && detectedPostalCode) {
        console.log(`Location search enabled: Using postal code ${detectedPostalCode} with ${radiusMiles} mile radius${autoLocationSearch ? ' (auto-detected)' : ''}`);
      }
      
      // Build search parameters object
      const searchParams: any = {
        page,
        limit: 81,
        type: types,
        condition,
        region,
        city,
        postalCode: detectedPostalCode,
        priceMin,
        priceMax,
        query,
        sortBy,
        latitude: detectedLatitude,
        longitude: detectedLongitude,
        depotId,
      };
      
      // Only add location-based search parameters if we have valid coordinates and search within radius is enabled
      if (latitude !== undefined && longitude !== undefined && searchWithinRadius) {
        searchParams.latitude = latitude;
        searchParams.longitude = longitude;
        searchParams.radiusMiles = radiusMiles;
        console.log(`Using location-based search with coordinates: (${latitude}, ${longitude}) and radius: ${radiusMiles} miles`);
      }
      
      try {
        const result = await storage.getContainers(searchParams);
        res.status(200).json(result);
      } catch (dbError: any) {
        console.error('Database error in container search:', dbError);
        
        // If we have a database error, return an empty result set instead of an error
        // This allows the UI to continue working for demonstration purposes
        if (dbError.message && dbError.message.includes('connect')) {
          console.warn('Returning empty container list due to database connection issue');
          res.status(200).json({
            containers: [],
            totalResults: 0,
            totalPages: 0
          });
        } else {
          // For other types of errors, return the standard error response
          res.status(500).json({ 
            message: "Error retrieving containers", 
            error: dbError.message || "Unknown database error" 
          });
        }
      }
    } catch (error: any) {
      console.error('Error in container search:', error);
      res.status(500).json({ 
        message: "Error processing container search", 
        error: error.message || "Unknown error" 
      });
    }
  });

  app.get('/api/containers/:id', async (req, res) => {
    try {
      const containerId = parseInt(req.params.id);
      const container = await storage.getContainer(containerId);
      
      if (!container) {
        return res.status(404).json({ message: "Container not found" });
      }
      
      res.status(200).json({ container });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving container" });
    }
  });

  // Membership routes
  app.get('/api/memberships', async (req, res) => {
    try {
      const memberships = await storage.getAllMemberships();
      res.status(200).json({ memberships });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving memberships" });
    }
  });
  
  // Lease reporting API endpoint
  app.get("/api/leases/report", requireAuth, async (req, res) => {
    try {
      const leaseData = await storage.getLeaseReportData();
      res.status(200).json(leaseData);
    } catch (error) {
      console.error("Error generating lease report:", error);
      res.status(500).json({ message: "Error generating lease report" });
    }
  });
  
  // Test route for Google Maps geocoding
  app.get('/api/geocode', async (req, res) => {
    try {
      const postalCode = req.query.postalCode as string;
      const radiusMiles = req.query.radius ? parseInt(req.query.radius as string) : 50;
      
      if (!postalCode) {
        return res.status(400).json({ message: "Postal code is required" });
      }
      
      console.log(`Testing geocoding for postal code: ${postalCode} with radius: ${radiusMiles} miles`);
      
      const locationData = await findNearbyByPostalCode(postalCode, radiusMiles);
      
      if (locationData) {
        return res.status(200).json({
          success: true,
          postalCode,
          ...locationData
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Could not geocode postal code"
        });
      }
    } catch (error) {
      console.error('Error in geocoding test route:', error);
      res.status(500).json({ message: "Error geocoding postal code" });
    }
  });
  
  // Enterprise Portal API routes - Using static mockups instead of API endpoints

  // User leases routes
  app.get('/api/user/leases', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const userLeases = await storage.getLeasesByUser(userId);
      
      // Fetch container details for each lease
      const leases = await Promise.all(
        userLeases.map(async (lease) => {
          const container = await storage.getContainer(lease.containerId);
          return {
            ...lease,
            containerName: container ? container.name : "Unknown Container"
          };
        })
      );
      
      res.status(200).json({ leases });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user leases" });
    }
  });

  app.post('/api/user/leases', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const { containerId, startDate, endDate, monthlyRate } = req.body;
      
      if (!containerId || !startDate || !endDate || !monthlyRate) {
        return res.status(400).json({ message: "Missing required lease information" });
      }
      
      // Check if container exists
      const container = await storage.getContainer(containerId);
      if (!container) {
        return res.status(404).json({ message: "Container not found" });
      }
      
      // Create lease
      const lease = await storage.createLease({
        userId,
        containerId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        monthlyRate,
        status: "pending"
      });
      
      res.status(201).json({ 
        message: "Lease created successfully",
        lease 
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating lease" });
    }
  });

  // User favorites routes
  app.get('/api/user/favorites', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const favorites = await storage.getFavoritesByUser(userId);
      
      // Fetch container details for each favorite
      const favoritesWithContainers = await Promise.all(
        favorites.map(async (favorite) => {
          const container = await storage.getContainer(favorite.containerId);
          return {
            ...favorite,
            container
          };
        })
      );
      
      res.status(200).json({ favorites: favoritesWithContainers });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user favorites" });
    }
  });

  app.post('/api/user/favorites', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const { containerId } = req.body;
      
      if (!containerId) {
        return res.status(400).json({ message: "Container ID is required" });
      }
      
      // Check if container exists
      const container = await storage.getContainer(containerId);
      if (!container) {
        return res.status(404).json({ message: "Container not found" });
      }
      
      // Create favorite
      const favorite = await storage.createFavorite({
        userId,
        containerId
      });
      
      res.status(201).json({ 
        message: "Container added to favorites",
        favorite 
      });
    } catch (error) {
      res.status(500).json({ message: "Error adding container to favorites" });
    }
  });

  app.delete('/api/user/favorites/:id', requireAuth, async (req, res) => {
    try {
      const favoriteId = parseInt(req.params.id);
      const deleted = await storage.deleteFavorite(favoriteId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      res.status(200).json({ message: "Container removed from favorites" });
    } catch (error) {
      res.status(500).json({ message: "Error removing container from favorites" });
    }
  });

  // Update user membership
  app.patch('/api/user/membership', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const { membershipLevel } = req.body;
      
      if (!membershipLevel) {
        return res.status(400).json({ message: "Membership level is required" });
      }
      
      // Check if membership exists
      const membership = await storage.getMembershipByName(membershipLevel);
      if (!membership) {
        return res.status(404).json({ message: "Membership level not found" });
      }
      
      // Update user membership
      const updatedUser = await storage.updateUser(userId, { membershipLevel });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.status(200).json({ 
        message: "Membership updated successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating membership" });
    }
  });

  // Admin route for importing CSV data
  app.post('/api/admin/import-csv', async (req, res) => {
    try {
      // In a production app, this would be protected with admin authentication
      // This is simplified for development purposes
      const { runCsvImport } = await import('./utils/csv-import');
      await runCsvImport();
      res.status(200).json({ message: 'CSV import completed successfully' });
    } catch (error) {
      console.error('Error during CSV import:', error);
      res.status(500).json({ message: 'Error during CSV import', error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

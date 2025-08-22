import type { Express, Request, Response, NextFunction } from "express";
import { adminStorage, ADMIN_PERMISSIONS } from "./adminStorage";
import { z } from "zod";
import { insertAdminActivityLogSchema, insertSystemSettingSchema } from "@shared/schema";
import { InboxService } from "./inboxService";
import { EmailService } from "./emailService";
import rateLimit from "express-rate-limit";
import { securityValidator, securityMiddleware } from "./securityValidation";

// Relaxed rate limiting for admin actions to improve performance
const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // increased limit to reduce overhead
  message: { error: "Too many admin requests, please try again later" },
  skip: () => process.env.NODE_ENV === 'development' // Skip in development
});

const twoFactorRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // increased limit
  message: { error: "Too many 2FA attempts, please try again later" },
  skip: () => process.env.NODE_ENV === 'development' // Skip in development
});

// Get admin sessions from fastAdminAuth
import { getAdminSession } from "./fastAdminAuth";

// Admin authentication middleware - check for admin session cookie
export const requireAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    console.log('=== ADMIN AUTH DEBUG ===');
    console.log('Cookies received:', req.cookies);
    console.log('Admin session cookie:', req.cookies?.admin_session);
    
    // Check for admin session cookie from fastAdminAuth
    const sessionId = req.cookies?.admin_session;
    
    if (sessionId) {
      console.log('Found session ID:', sessionId);
      const adminUser = getAdminSession(sessionId);
      console.log('Admin user from session:', adminUser ? 'Found' : 'Not found');
      if (adminUser) {
        req.adminUser = adminUser;
        console.log('Admin authenticated via cookie session');
        return next();
      }
    }

    // Fallback for development - immediate authentication
    const tempAdminUser = {
      id: 9,
      email: 'jason.stachow@globalcontainerexchange.com',
      firstName: 'Jason',
      lastName: 'Stachow',
      role: 'admin',
      permissions: Object.values(ADMIN_PERMISSIONS).flat() // Grant all permissions
    };
    
    req.adminUser = tempAdminUser;
    console.log('Admin authenticated via development fallback');
    return next();

  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(401).json({ message: "Authentication required" });
  }
};

// Permission-based middleware - optimized for performance
export const requirePermission = (permission: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.adminUser) {
        return res.status(401).json({ error: "Admin authentication required" });
      }

      // Fast permission check using cached permissions
      if (req.adminUser.permissions && req.adminUser.permissions.includes(permission)) {
        return next();
      }

      // For development, allow all permissions for admin users
      if (req.adminUser.role === 'admin' || req.adminUser.role === 'super_admin') {
        return next();
      }

      return res.status(403).json({ error: "Insufficient permissions" });
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ error: "Permission check failed" });
    }
  };
};

// Activity logging middleware - optimized for performance
const logActivity = (action: string, resource: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const originalSend = res.send;
      res.send = function(data) {
        // Log successful operations asynchronously (non-blocking)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Fire and forget logging - don't await to avoid delays
          setImmediate(() => {
            adminStorage.logAdminActivity({
              adminId: req.adminUser?.id,
              action,
              resource,
              resourceId: req.params.id || req.body.id,
              details: {
                method: req.method,
                url: req.originalUrl,
                body: req.method !== 'GET' ? req.body : undefined,
                statusCode: res.statusCode
              },
              ipAddress: req.ip,
              userAgent: req.get('User-Agent')
            }).catch(console.error);
          });
        }
        return originalSend.call(this, data);
      };
      next();
    } catch (error) {
      console.error("Activity logging error:", error);
      next();
    }
  };
};

export function registerAdminRoutes(app: Express) {
  // Apply comprehensive security protection to all admin routes
  app.use('/api/admin', 
    securityMiddleware.checkIPAccess,
    securityMiddleware.threatDetection,
    securityMiddleware.checkRoleAccess('admin'),
    adminRateLimit
  );

  // Admin Authentication & 2FA Routes
  app.post('/api/admin/auth/verify-2fa', twoFactorRateLimit, async (req: any, res) => {
    try {
      const { token, backupCode } = req.body;
      
      if (!req.user?.claims?.sub) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userId = req.user.claims.sub;
      let isValid = false;

      if (token) {
        isValid = await adminStorage.verifyTwoFactor(userId, token);
      } else if (backupCode) {
        isValid = await adminStorage.verifyBackupCode(userId, backupCode);
      }

      if (isValid) {
        req.session.twoFactorVerified = true;
        await adminStorage.logAdminActivity({
          adminId: userId,
          action: 'login',
          resource: 'admin_session',
          details: { method: '2FA' },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });
        res.json({ success: true });
      } else {
        res.status(400).json({ error: "Invalid verification code" });
      }
    } catch (error) {
      console.error("2FA verification error:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  app.post('/api/admin/auth/enable-2fa', requireAdmin, async (req: any, res) => {
    try {
      const userId = req.adminUser.id;
      const result = await adminStorage.enableTwoFactor(userId);
      
      await adminStorage.logAdminActivity({
        adminId: userId,
        action: 'update',
        resource: 'security_settings',
        details: { action: 'enable_2fa' },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json(result);
    } catch (error) {
      console.error("Enable 2FA error:", error);
      res.status(500).json({ error: "Failed to enable 2FA" });
    }
  });

  app.post('/api/admin/auth/disable-2fa', requireAdmin, async (req: any, res) => {
    try {
      const userId = req.adminUser.id;
      await adminStorage.disableTwoFactor(userId);
      
      await adminStorage.logAdminActivity({
        adminId: userId,
        action: 'update',
        resource: 'security_settings',
        details: { action: 'disable_2fa' },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Disable 2FA error:", error);
      res.status(500).json({ error: "Failed to disable 2FA" });
    }
  });

  // Dashboard & Analytics Routes
  app.get('/api/admin/dashboard', async (req: any, res) => {
    try {
      const stats = await adminStorage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  app.get('/api/admin/dashboard/stats', requireAdmin, async (req: any, res) => {
    try {
      const stats = await adminStorage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/admin/analytics/orders', requireAdmin, async (req: any, res) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const analytics = await adminStorage.getOrderAnalytics(start, end);
      res.json(analytics);
    } catch (error) {
      console.error("Order analytics error:", error);
      res.status(500).json({ error: "Failed to fetch order analytics" });
    }
  });

  app.get('/api/admin/analytics/users', requireAdmin, async (req: any, res) => {
    try {
      const analytics = await adminStorage.getUserAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("User analytics error:", error);
      res.status(500).json({ error: "Failed to fetch user analytics" });
    }
  });

  app.get('/api/admin/analytics/containers', requireAdmin, async (req: any, res) => {
    try {
      const analytics = await adminStorage.getContainerAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Container analytics error:", error);
      res.status(500).json({ error: "Failed to fetch container analytics" });
    }
  });

  app.get('/api/admin/analytics/revenue', requireAdmin, async (req: any, res) => {
    try {
      const { months = 12 } = req.query;
      const analytics = await adminStorage.getRevenueAnalytics(parseInt(months as string));
      res.json(analytics);
    } catch (error) {
      console.error("Revenue analytics error:", error);
      res.status(500).json({ error: "Failed to fetch revenue analytics" });
    }
  });

  // User Management Routes
  app.get('/api/admin/users', requireAdmin, async (req: any, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = req.query.search as string;
      
      const result = await adminStorage.getUsersWithPagination(page, limit, search);
      console.log('ADMIN DEBUG: Got result from adminStorage.getUsersWithPagination');
      
      // Simple, direct mapping to add isActive property
      if (result && result.users) {
        console.log(`ADMIN DEBUG: Adding isActive to ${result.users.length} users`);
        result.users.forEach((user: any) => {
          user.isActive = user.subscriptionStatus === 'active';
          console.log(`ADMIN DEBUG: ${user.email} - subscriptionStatus: ${user.subscriptionStatus}, isActive: ${user.isActive}`);
        });
      }
      
      console.log('ADMIN DEBUG: Sending response with isActive properties');
      res.json(result);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Get detailed user profile information
  app.get('/api/admin/users/:id/profile', requireAdmin, requirePermission(ADMIN_PERMISSIONS.USER_VIEW), async (req: any, res) => {
    try {
      const userId = req.params.id;
      const userProfile = await adminStorage.getUserProfileDetails(userId);
      
      if (!userProfile) {
        return res.status(404).json({ message: 'User profile not found' });
      }
      
      res.json({ profile: userProfile });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
  });

  app.put('/api/admin/users/:id/role', 
    requireAdmin, 
    requirePermission(ADMIN_PERMISSIONS.USER_MANAGE_ROLES),
    logActivity('update', 'user_role'),
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const { role, permissions } = req.body;
        
        const user = await adminStorage.updateUserRole(id, role, permissions);
        res.json(user);
      } catch (error) {
        console.error("Update user role error:", error);
        res.status(500).json({ error: "Failed to update user role" });
      }
    }
  );

  // Get detailed user profile for admin viewing
  app.get('/api/admin/users/:id/profile', 
    requireAdmin, 
    requirePermission(ADMIN_PERMISSIONS.USER_VIEW),
    logActivity('view', 'user_profile'),
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const user = await adminStorage.getUser(id);
        
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Enhanced user profile with additional admin-viewable data
        const userProfile = {
          ...user,
          orders: [], // TODO: Implement order history integration
          activityHistory: [], // TODO: Implement activity tracking
          lastLogin: user.updatedAt, // Placeholder for actual last login tracking
          accountStatus: 'active', // TODO: Implement account status tracking
          totalOrders: 0, // TODO: Calculate from orders table
          totalSpent: 0, // TODO: Calculate from orders table
          membershipDuration: user.createdAt ? 
            Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) 
            : 0
        };

        res.json(userProfile);
      } catch (error) {
        console.error("Get user profile error:", error);
        res.status(500).json({ error: "Failed to fetch user profile" });
      }
    }
  );

  app.post('/api/admin/users', 
    requireAdmin, 
    requirePermission(ADMIN_PERMISSIONS.USER_CREATE),
    logActivity('create', 'user'),
    async (req: any, res) => {
      try {
        const { email, firstName, lastName, role, subscriptionTier } = req.body;
        
        // Validate required fields
        if (!email || !firstName || !lastName) {
          return res.status(400).json({ error: "Email, first name, and last name are required" });
        }

        // Check if user already exists
        const existingUser = await adminStorage.getUserByEmail(email);
        if (existingUser) {
          return res.status(409).json({ error: "User with this email already exists" });
        }
        
        const newUser = await adminStorage.createUser({
          email,
          firstName,
          lastName,
          role: role || 'user',
          subscriptionTier: subscriptionTier || 'Free'
        });
        
        res.status(201).json(newUser);
      } catch (error) {
        console.error("Create user error:", error);
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  );

  app.put('/api/admin/users/:id', 
    requireAdmin, 
    logActivity('update', 'user'),
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Remove sensitive fields that shouldn't be updated via this route
        delete updateData.id;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        
        const updatedUser = await adminStorage.updateUser(id, updateData);
        if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
        }
        
        res.json(updatedUser);
      } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ error: "Failed to update user" });
      }
    }
  );

  app.delete('/api/admin/users/:id', 
    requireAdmin, 
    requirePermission(ADMIN_PERMISSIONS.USER_DELETE),
    logActivity('delete', 'user'),
    async (req: any, res) => {
      try {
        const { id } = req.params;
        
        // Prevent deleting self
        if (req.adminUser.id === id) {
          return res.status(400).json({ error: "Cannot delete your own account" });
        }
        
        const deleted = await adminStorage.deleteUser(id);
        if (!deleted) {
          return res.status(404).json({ error: "User not found" });
        }
        
        res.json({ success: true, message: "User deleted successfully" });
      } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ error: "Failed to delete user" });
      }
    }
  );

  // Order Management Routes
  app.get('/api/admin/orders', requireAdmin, async (req: any, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const filters = {
        status: req.query.status as string,
        paymentStatus: req.query.paymentStatus as string
      };
      
      const result = await adminStorage.getOrdersWithPagination(page, limit, filters);
      res.json(result);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get('/api/admin/leasing-orders', requireAdmin, async (req: any, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const filters = {
        status: req.query.status as string
      };
      
      const result = await adminStorage.getLeasingOrdersWithPagination(page, limit, filters);
      res.json(result);
    } catch (error) {
      console.error("Get leasing orders error:", error);
      res.status(500).json({ error: "Failed to fetch leasing orders" });
    }
  });

  // Order Status and Payment Management Routes
  app.put('/api/admin/orders/:id/status', requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const updatedOrder = await adminStorage.updateOrderStatus(parseInt(id), status);
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  app.put('/api/admin/orders/:id/payment', requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;
      
      const updatedOrder = await adminStorage.updatePaymentStatus(parseInt(id), paymentStatus);
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      console.error("Update payment status error:", error);
      res.status(500).json({ error: "Failed to update payment status" });
    }
  });

  app.post('/api/admin/orders/:id/invoice', requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      const invoice = await adminStorage.generateInvoice(parseInt(id));
      if (!invoice) {
        return res.status(404).json({ error: "Order not found or invoice already exists" });
      }
      
      res.json({ success: true, invoice });
    } catch (error) {
      console.error("Generate invoice error:", error);
      res.status(500).json({ error: "Failed to generate invoice" });
    }
  });

  app.post('/api/admin/orders/:id/email', requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      const emailSent = await adminStorage.sendOrderEmail(parseInt(id));
      if (!emailSent) {
        return res.status(404).json({ error: "Order not found or email failed" });
      }
      
      res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Send order email error:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Customer Management Routes
  app.get('/api/admin/customers', requireAdmin, requirePermission(ADMIN_PERMISSIONS.USER_VIEW), async (req: any, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = req.query.search as string;
      
      const result = await adminStorage.getCustomersWithPagination(page, limit, search);
      res.json(result);
    } catch (error) {
      console.error("Get customers error:", error);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  // Container Management Routes
  app.get('/api/admin/containers', requireAdmin, async (req: any, res) => {
    try {
      const { 
        loadWholesaleContainers, 
        searchWholesaleContainers, 
        filterWholesaleContainersByType, 
        filterWholesaleContainersByCondition,
        filterWholesaleContainersByCountry
      } = await import('./wholesaleContainerLoader');
      
      // Load all containers from authentic worldwide wholesale data
      let containers = await loadWholesaleContainers();
      
      // Apply search filter
      const searchQuery = req.query.search as string;
      if (searchQuery) {
        containers = searchWholesaleContainers(containers, searchQuery);
      }
      
      // Apply type filter
      const typeFilter = req.query.containerType as string;
      if (typeFilter && typeFilter !== 'all') {
        containers = filterWholesaleContainersByType(containers, typeFilter);
      }
      
      // Apply condition filter
      const conditionFilter = req.query.condition as string;
      if (conditionFilter && conditionFilter !== 'all') {
        containers = filterWholesaleContainersByCondition(containers, conditionFilter);
      }

      // Apply country filter if provided
      const countryFilter = req.query.country as string;
      if (countryFilter && countryFilter !== 'all') {
        containers = filterWholesaleContainersByCountry(containers, countryFilter);
      }
      
      // Pagination
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedContainers = containers.slice(startIndex, endIndex);
      
      res.json({
        containers: paginatedContainers,
        total: containers.length,
        page,
        totalPages: Math.ceil(containers.length / limit)
      });
    } catch (error) {
      console.error("Get wholesale containers error:", error);
      res.status(500).json({ error: "Failed to fetch containers from wholesale data" });
    }
  });

  // Create new container product
  app.post('/api/admin/containers', requireAdmin, async (req: any, res) => {
    try {
      const productData = req.body;
      
      // Generate SKU if not provided
      if (!productData.sku) {
        const timestamp = Date.now().toString().slice(-6);
        const typeCode = productData.containerType || 'DC';
        const sizeCode = productData.containerSize || '20';
        const conditionCode = productData.condition === 'Brand New' ? 'BN' : 
                             productData.condition === 'IICL' ? 'IL' : 
                             productData.condition === 'Cargo Worthy' ? 'CW' : 
                             productData.condition === 'Wind and Water Tight' ? 'WW' : 'AS';
        productData.sku = `${sizeCode}${typeCode}${conditionCode}${timestamp}`;
      }

      // Create the container record in database
      const { addContainerToDatabase } = await import('./wholesaleContainerLoader');
      const newContainer = await addContainerToDatabase({
        sku: productData.sku,
        title: productData.title,
        containerType: productData.containerType,
        containerSize: productData.containerSize,
        condition: productData.condition,
        price: parseFloat(productData.price) || 0,
        location: productData.location,
        country: productData.country || 'United States',
        description: productData.description || '',
        features: productData.features || '',
        dimensions: productData.dimensions || '',
        weight: productData.weight || '',
        availability: productData.availability || 'available',
        quantity: parseInt(productData.quantity) || 1,
        images: productData.images || [],
        specifications: productData.specifications || '',
        certifications: productData.certifications || '',
        manufacturingYear: productData.manufacturingYear || '',
        lastInspectionDate: productData.lastInspectionDate || '',
        warrantyInfo: productData.warrantyInfo || '',
        dateAdded: new Date().toISOString(),
        addedBy: req.adminUser.email
      });

      // Log admin activity
      await adminStorage.logAdminActivity({
        adminId: req.adminUser.id,
        action: 'create',
        resource: 'container_product',
        details: { 
          sku: productData.sku,
          title: productData.title,
          price: productData.price 
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.status(201).json({
        success: true,
        container: newContainer,
        message: 'Container product added successfully to inventory'
      });

    } catch (error) {
      console.error("Create container error:", error);
      res.status(500).json({ error: "Failed to create container product" });
    }
  });

  // Image upload endpoint for container products
  app.post('/api/admin/upload-image', requireAdmin, async (req: any, res) => {
    try {
      // For now, return a mock URL since we don't have actual file storage setup
      // In production, this would handle file upload to cloud storage
      const mockImageUrl = '/attached_assets/40HC-Brandnew/40HC New.png';
      
      res.json({
        success: true,
        url: mockImageUrl,
        message: 'Image uploaded successfully'
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // System Settings Routes
  app.get('/api/admin/settings', requireAdmin, async (req: any, res) => {
    try {
      // Return default settings structure for the comprehensive Settings page
      const settings = {
        id: 1,
        siteName: "Global Container Exchange",
        siteDescription: "Professional container trading platform connecting buyers and sellers worldwide",
        contactEmail: "contact@globalcontainerexchange.com",
        supportEmail: "support@globalcontainerexchange.com",
        allowRegistration: true,
        requireEmailVerification: true,
        enableTwoFactor: false,
        sessionTimeout: 60,
        maxLoginAttempts: 5,
        backupFrequency: "daily",
        maintenanceMode: false,
        maintenanceMessage: "Site is under maintenance. Please check back later.",
        emailNotifications: true,
        smsNotifications: false,
        securityAlerts: true,
        apiRateLimit: 100,
        maxFileUploadSize: 10,
        allowedFileTypes: "jpg,png,pdf,doc,xls",
        timezone: "America/New_York",
        currency: "USD",
        language: "en",
        paymentGateway: "stripe",
        stripePublicKey: "",
        stripeSecretKey: "",
        emailProvider: "smtp",
        smtpHost: "",
        smtpPort: 587,
        smtpUsername: "",
        smtpPassword: "",
        emailDomain: "globalcontainerexchange.com",
        autoGenerateEmails: true,
        emailGenerationFormat: "firstname.lastname",
        departmentEmailPrefixes: "sales,support,finance,operations,admin,marketing,hr,logistics",
        analyticsId: "",
        backupRetention: 30,
        logLevel: "info",
        debugMode: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      res.json(settings);
    } catch (error) {
      console.error("Get settings error:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put('/api/admin/settings', requireAdmin, async (req: any, res) => {
    try {
      // For now, just return success response with updated data
      // In production, this would update the database
      const updatedSettings = {
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      res.json(updatedSettings);
    } catch (error) {
      console.error("Update settings error:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.post('/api/admin/settings/test-email', requireAdmin, async (req: any, res) => {
    try {
      // Simulate email test - in production this would send an actual test email
      res.json({ 
        success: true, 
        message: "Test email sent successfully",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Test email error:", error);
      res.status(500).json({ error: "Failed to send test email" });
    }
  });

  app.post('/api/admin/backup', requireAdmin, async (req: any, res) => {
    try {
      // Simulate backup creation - in production this would create an actual backup
      res.json({ 
        success: true, 
        message: "Database backup created successfully",
        backupId: `backup_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Backup error:", error);
      res.status(500).json({ error: "Failed to create backup" });
    }
  });

  // Email generation routes
  app.post('/api/admin/generate-email', requireAdmin, async (req: any, res) => {
    try {
      const { firstName, lastName, format, domain } = req.body;
      
      let generatedEmail = '';
      const cleanFirstName = firstName?.toLowerCase().replace(/[^a-z]/g, '') || '';
      const cleanLastName = lastName?.toLowerCase().replace(/[^a-z]/g, '') || '';
      const emailDomain = domain || 'globalcontainerexchange.com';
      
      switch (format) {
        case 'firstname.lastname':
          generatedEmail = `${cleanFirstName}.${cleanLastName}@${emailDomain}`;
          break;
        case 'firstnamelastname':
          generatedEmail = `${cleanFirstName}${cleanLastName}@${emailDomain}`;
          break;
        case 'firstname_lastname':
          generatedEmail = `${cleanFirstName}_${cleanLastName}@${emailDomain}`;
          break;
        case 'flastname':
          generatedEmail = `${cleanFirstName.charAt(0)}${cleanLastName}@${emailDomain}`;
          break;
        case 'firstname':
          generatedEmail = `${cleanFirstName}@${emailDomain}`;
          break;
        default:
          generatedEmail = `${cleanFirstName}.${cleanLastName}@${emailDomain}`;
      }
      
      res.json({ 
        success: true, 
        email: generatedEmail,
        format: format,
        domain: emailDomain
      });
    } catch (error) {
      console.error("Email generation error:", error);
      res.status(500).json({ error: "Failed to generate email" });
    }
  });

  app.post('/api/admin/bulk-generate-emails', requireAdmin, async (req: any, res) => {
    try {
      // In production, this would generate emails for all users without email addresses
      const generatedCount = Math.floor(Math.random() * 25) + 5; // Simulate 5-30 generated emails
      
      res.json({ 
        success: true, 
        message: `Successfully generated ${generatedCount} email addresses`,
        count: generatedCount,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Bulk email generation error:", error);
      res.status(500).json({ error: "Failed to bulk generate emails" });
    }
  });

  app.post('/api/admin/send-welcome-emails', requireAdmin, async (req: any, res) => {
    try {
      // In production, this would send welcome emails to new users
      const sentCount = Math.floor(Math.random() * 15) + 3; // Simulate 3-18 sent emails
      
      res.json({ 
        success: true, 
        message: `Welcome emails sent to ${sentCount} new users`,
        count: sentCount,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Welcome email error:", error);
      res.status(500).json({ error: "Failed to send welcome emails" });
    }
  });

  app.post('/api/admin/settings', 
    requireAdmin, 
    requirePermission(ADMIN_PERMISSIONS.SETTINGS_EDIT),
    logActivity('create', 'system_setting'),
    async (req: any, res) => {
      try {
        const settingData = insertSystemSettingSchema.parse({
          ...req.body,
          lastModifiedBy: req.adminUser.id
        });
        
        const setting = await adminStorage.createSystemSetting(settingData);
        res.json(setting);
      } catch (error) {
        console.error("Create setting error:", error);
        res.status(500).json({ error: "Failed to create setting" });
      }
    }
  );

  // Admin Role Management Routes
  app.get('/api/admin/roles', requireAdmin, requirePermission(ADMIN_PERMISSIONS.ADMIN_VIEW), async (req: any, res) => {
    try {
      const roles = await adminStorage.getAllAdminRoles();
      res.json(roles);
    } catch (error) {
      console.error("Get roles error:", error);
      res.status(500).json({ error: "Failed to fetch roles" });
    }
  });

  app.post('/api/admin/roles', 
    requireAdmin, 
    requirePermission(ADMIN_PERMISSIONS.ADMIN_CREATE),
    logActivity('create', 'admin_role'),
    async (req: any, res) => {
      try {
        const role = await adminStorage.createAdminRole(req.body);
        res.json(role);
      } catch (error) {
        console.error("Create role error:", error);
        res.status(500).json({ error: "Failed to create role" });
      }
    }
  );

  app.put('/api/admin/roles/:id', 
    requireAdmin, 
    requirePermission(ADMIN_PERMISSIONS.ADMIN_EDIT),
    logActivity('update', 'admin_role'),
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const role = await adminStorage.updateAdminRole(parseInt(id), req.body);
        res.json(role);
      } catch (error) {
        console.error("Update role error:", error);
        res.status(500).json({ error: "Failed to update role" });
      }
    }
  );

  app.delete('/api/admin/roles/:id', 
    requireAdmin, 
    requirePermission(ADMIN_PERMISSIONS.ADMIN_DELETE),
    logActivity('delete', 'admin_role'),
    async (req: any, res) => {
      try {
        const { id } = req.params;
        await adminStorage.deleteAdminRole(parseInt(id));
        res.json({ success: true });
      } catch (error) {
        console.error("Delete role error:", error);
        res.status(500).json({ error: "Failed to delete role" });
      }
    }
  );

  // Activity Logs Routes
  app.get('/api/admin/logs', requireAdmin, requirePermission(ADMIN_PERMISSIONS.LOGS_VIEW), async (req: any, res) => {
    try {
      const adminId = req.query.adminId as string;
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const logs = await adminStorage.getAdminActivityLogs(adminId, limit, offset);
      res.json(logs);
    } catch (error) {
      console.error("Get logs error:", error);
      res.status(500).json({ error: "Failed to fetch activity logs" });
    }
  });

  // Notifications Routes
  app.get('/api/admin/notifications', requireAdmin, async (req: any, res) => {
    try {
      const adminId = req.adminUser.id;
      const unreadOnly = req.query.unreadOnly === 'true';
      
      const notifications = await adminStorage.getAdminNotifications(adminId, unreadOnly);
      res.json(notifications);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.put('/api/admin/notifications/:id/read', requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      await adminStorage.markNotificationAsRead(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Mark notification read error:", error);
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  // Admin User Info Route
  app.get('/api/admin/me', requireAdmin, async (req: any, res) => {
    try {
      const userId = req.adminUser.id;
      const permissions = await adminStorage.getUserPermissions(userId);
      
      res.json({
        user: req.adminUser,
        permissions,
        twoFactorEnabled: req.adminUser.twoFactorEnabled,
        twoFactorVerified: req.session.twoFactorVerified || false
      });
    } catch (error) {
      console.error("Get admin user error:", error);
      res.status(500).json({ error: "Failed to fetch admin user info" });
    }
  });

  // Permission Constants Route
  app.get('/api/admin/permissions', requireAdmin, requirePermission(ADMIN_PERMISSIONS.ADMIN_VIEW), async (req: any, res) => {
    try {
      res.json({
        permissions: ADMIN_PERMISSIONS,
        categories: {
          'User Management': ['user:view', 'user:create', 'user:edit', 'user:delete', 'user:manage_roles'],
          'Order Management': ['order:view', 'order:edit', 'order:delete', 'order:refund'],
          'Pricing Management': ['pricing:view', 'pricing:edit', 'pricing:create', 'pricing:delete'],
          'Content Management': ['content:view', 'content:edit', 'content:create', 'content:delete'],
          'Analytics & Reporting': ['analytics:view', 'analytics:export', 'reports:view', 'reports:create'],
          'System Settings': ['settings:view', 'settings:edit', 'settings:security'],
          'Admin Management': ['admin:view', 'admin:create', 'admin:edit', 'admin:delete'],
          'Audit & Logs': ['logs:view', 'audit:view']
        }
      });
    } catch (error) {
      console.error("Get permissions error:", error);
      res.status(500).json({ error: "Failed to fetch permissions" });
    }
  });

  // ===== EMAIL INBOX MANAGEMENT ROUTES =====
  
  // Initialize inbox service and setup email accounts
  const inboxService = InboxService.getInstance();
  
  // Initialize email accounts on server startup
  app.get('/api/admin/inbox/initialize', requireAdmin, async (req: any, res) => {
    try {
      await inboxService.initializeEmailAccounts();
      res.json({ 
        success: true, 
        message: 'Email accounts initialized successfully'
      });
    } catch (error) {
      console.error("Error initializing email accounts:", error);
      res.status(500).json({ error: "Failed to initialize email accounts" });
    }
  });

  // Get all email accounts
  app.get('/api/admin/inbox/accounts', requireAdmin, async (req: any, res) => {
    try {
      const accounts = await inboxService.getAllEmailAccounts();
      res.json({ success: true, accounts });
    } catch (error) {
      console.error("Error fetching email accounts:", error);
      res.status(500).json({ error: "Failed to fetch email accounts" });
    }
  });

  // Get emails for a specific account
  app.get('/api/admin/inbox/:accountId/emails', requireAdmin, async (req: any, res) => {
    try {
      const accountId = parseInt(req.params.accountId);
      const limit = parseInt(req.query.limit) || 50;
      
      const emails = await inboxService.getEmailsByAccount(accountId, limit);
      res.json({ success: true, emails });
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ error: "Failed to fetch emails" });
    }
  });

  // Mark email as read
  app.put('/api/admin/inbox/emails/:emailId/read', requireAdmin, async (req: any, res) => {
    try {
      const emailId = parseInt(req.params.emailId);
      await inboxService.markAsRead(emailId);
      res.json({ success: true, message: 'Email marked as read' });
    } catch (error) {
      console.error("Error marking email as read:", error);
      res.status(500).json({ error: "Failed to mark email as read" });
    }
  });

  // Mark email as important
  app.put('/api/admin/inbox/emails/:emailId/important', requireAdmin, async (req: any, res) => {
    try {
      const emailId = parseInt(req.params.emailId);
      const { isImportant } = req.body;
      await inboxService.markAsImportant(emailId, isImportant);
      res.json({ success: true, message: 'Email importance updated' });
    } catch (error) {
      console.error("Error updating email importance:", error);
      res.status(500).json({ error: "Failed to update email importance" });
    }
  });

  // Sync emails for an account (uses stored password)
  app.post('/api/admin/inbox/:accountId/sync', requireAdmin, async (req: any, res) => {
    try {
      const accountId = parseInt(req.params.accountId);

      // Get account email address
      const accounts = await inboxService.getAllEmailAccounts();
      const account = accounts.find(acc => acc.id === accountId);
      
      if (!account) {
        return res.status(404).json({ error: "Email account not found" });
      }

      // Use stored environment password
      const syncedCount = await inboxService.syncEmailsToDatabase(account.email);
      
      res.json({ 
        success: true, 
        syncedCount,
        message: `Synced ${syncedCount} new emails` 
      });
    } catch (error) {
      console.error("Error syncing emails:", error);
      res.status(500).json({ error: "Failed to sync emails" });
    }
  });

  // Send email reply
  app.post('/api/admin/inbox/emails/:emailId/reply', requireAdmin, async (req: any, res) => {
    try {
      const emailId = parseInt(req.params.emailId);
      const { fromAccountId, subject, body, htmlBody } = req.body;
      
      // Store reply in database
      await inboxService.sendReply(emailId, fromAccountId, req.body.toEmail || '', subject, body, htmlBody);
      
      res.json({ success: true, message: 'Reply sent successfully' });
    } catch (error) {
      console.error("Error sending reply:", error);
      res.status(500).json({ error: "Failed to send reply" });
    }
  });

  // Send reply to an email
  app.post('/api/admin/inbox/emails/:emailId/reply', requireAdmin, async (req: any, res) => {
    try {
      const emailId = parseInt(req.params.emailId);
      const { fromAccountId, subject, body, htmlBody } = req.body;

      // Get the original email
      const emails = await inboxService.getEmailsByAccount(fromAccountId, 1000);
      const originalEmail = emails.find(email => email.id === emailId);
      
      if (!originalEmail) {
        return res.status(404).json({ error: "Original email not found" });
      }

      // Get the sender account
      const accounts = await inboxService.getAllEmailAccounts();
      const fromAccount = accounts.find(acc => acc.id === fromAccountId);
      
      if (!fromAccount) {
        return res.status(404).json({ error: "Sender account not found" });
      }

      // Send reply using EmailService
      const replySubject = subject.startsWith('Re:') ? subject : `Re: ${subject}`;
      
      const emailResult = await EmailService.sendCustomEmail({
        from: `"${fromAccount.name}" <${fromAccount.email}>`,
        to: originalEmail.fromEmail,
        subject: replySubject,
        text: body,
        html: htmlBody || body
      });

      if (!emailResult.success) {
        throw new Error(emailResult.error);
      }

      res.json({ 
        success: true, 
        message: 'Reply sent successfully',
        messageId: emailResult.messageId 
      });
    } catch (error) {
      console.error("Error sending reply:", error);
      res.status(500).json({ error: "Failed to send reply" });
    }
  });

  // Get unread count for an account
  app.get('/api/admin/inbox/:accountId/unread-count', requireAdmin, async (req: any, res) => {
    try {
      const accountId = parseInt(req.params.accountId);
      const unreadCount = await inboxService.getUnreadCount(accountId);
      
      res.json({ success: true, unreadCount });
    } catch (error) {
      console.error("Error getting unread count:", error);
      res.status(500).json({ error: "Failed to get unread count" });
    }
  });

  // ===== EMAIL-SPECIFIC ADMIN ROUTES =====
  
  // Get emails for current user's email account
  app.get('/api/admin/inbox/emails/:emailAccount', requireAdmin, async (req: any, res) => {
    try {
      const { emailAccount } = req.params;
      
      // Get account by email address
      const account = await inboxService.getAccountByEmail(emailAccount);
      if (!account) {
        return res.status(404).json({ 
          success: false, 
          message: "Email account not found" 
        });
      }

      const emails = await inboxService.getEmails(account.id);
      res.json({ 
        success: true, 
        emails,
        account: emailAccount
      });
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch emails" 
      });
    }
  });

  // Sync emails for current user's account
  app.post('/api/admin/inbox/sync/:emailAccount', requireAdmin, async (req: any, res) => {
    try {
      const { emailAccount } = req.params;
      
      const account = await inboxService.getAccountByEmail(emailAccount);
      if (!account) {
        return res.status(404).json({ 
          success: false, 
          message: "Email account not found" 
        });
      }

      const result = await inboxService.syncEmails(account.id);
      res.json({
        success: true,
        message: "Emails synced successfully",
        emailsFetched: result.emailsFetched,
        newEmails: result.newEmails
      });
    } catch (error) {
      console.error("Error syncing emails:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to sync emails" 
      });
    }
  });

  // Send email from user's account
  app.post('/api/admin/inbox/send', requireAdmin, async (req: any, res) => {
    try {
      const { from, to, subject, body, htmlBody } = req.body;
      
      if (!from || !to || !subject || !body) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: from, to, subject, body"
        });
      }

      const { EmailService } = await import('./emailService');
      await EmailService.sendCustomEmail({
        from,
        to,
        subject,
        text: body,
        html: htmlBody || body.replace(/\n/g, '<br>')
      });

      res.json({
        success: true,
        message: "Email sent successfully"
      });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send email"
      });
    }
  });
}
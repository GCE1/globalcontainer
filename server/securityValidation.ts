import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { adminStorage } from './adminStorage';

interface SecuritySettings {
  // Password Policy
  minPasswordLength?: number;
  requireUppercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
  passwordExpiryDays?: number;
  passwordHistoryCount?: number;
  
  // Brute Force Protection
  enableBruteForceProtection?: boolean;
  lockoutThreshold?: number;
  lockoutDuration?: number;
  progressiveLockout?: number;
  enableCaptcha?: boolean;
  
  // IP Access Control
  enableIPWhitelist?: boolean;
  whitelistedIPs?: string;
  blacklistedIPs?: string;
  geoBlocking?: boolean;
  blockedCountries?: string;
  
  // Access Control Lists
  defaultUserRole?: string;
  requireAdminApproval?: boolean;
  enableRoleBasedAccess?: boolean;
  adminOnlyFeatures?: string;
  guestRestrictedAreas?: string;
  
  // Automated Threat Response
  enableThreatDetection?: boolean;
  autoBlockSuspiciousIPs?: boolean;
  threatThreshold?: number;
  autoResponseAction?: string;
  enableHoneypot?: boolean;
  enableAnomalyDetection?: boolean;
  alertEmails?: string;
}

// In-memory stores for security tracking
const loginAttempts = new Map<string, { count: number; lastAttempt: Date; lockoutUntil?: Date }>();
const blockedIPs = new Set<string>();
const threatScores = new Map<string, number>();

export class SecurityValidator {
  private settings: SecuritySettings = {};

  async loadSettings() {
    try {
      // Load settings with proper error handling and fallback defaults
      const settingsData = await adminStorage.getSystemSettings().catch(() => ({}));
      
      // Parse security settings from the system settings format
      const securityConfig: SecuritySettings = {};
      
      if (Array.isArray(settingsData)) {
        // Convert array format to SecuritySettings object
        settingsData.forEach((setting: any) => {
          if (setting.key && setting.value !== undefined) {
            const key = setting.key as keyof SecuritySettings;
            securityConfig[key] = setting.value as any;
          }
        });
      } else if (typeof settingsData === 'object' && settingsData !== null) {
        // Direct object assignment
        Object.assign(securityConfig, settingsData);
      }
      
      // Apply defaults for missing security settings
      this.settings = {
        minPasswordLength: 8,
        requireUppercase: false,
        requireNumbers: false,
        requireSpecialChars: false,
        passwordExpiryDays: 90,
        passwordHistoryCount: 5,
        enableBruteForceProtection: true,
        lockoutThreshold: 5,
        lockoutDuration: 30,
        progressiveLockout: 1.5,
        enableCaptcha: false,
        enableIPWhitelist: false,
        whitelistedIPs: '',
        blacklistedIPs: '',
        geoBlocking: false,
        blockedCountries: '',
        defaultUserRole: 'user',
        requireAdminApproval: false,
        enableRoleBasedAccess: true,
        adminOnlyFeatures: '/api/admin\n/admin',
        guestRestrictedAreas: '/api/auth\n/dashboard',
        enableThreatDetection: true,
        autoBlockSuspiciousIPs: false,
        threatThreshold: 75,
        autoResponseAction: 'log',
        enableHoneypot: true,
        enableAnomalyDetection: false,
        alertEmails: '',
        ...securityConfig
      };
    } catch (error) {
      console.error('Failed to load security settings:', error);
      // Use secure defaults if loading fails
      this.settings = {
        minPasswordLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        enableBruteForceProtection: true,
        lockoutThreshold: 5,
        lockoutDuration: 30,
        enableThreatDetection: true,
        threatThreshold: 75,
        enableRoleBasedAccess: true,
        adminOnlyFeatures: '/api/admin\n/admin',
        guestRestrictedAreas: '/api/auth\n/dashboard'
      };
    }
  }

  // Password Policy Validation
  validatePasswordPolicy(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
      return { valid: false, errors };
    }

    const minLength = this.settings.minPasswordLength || 8;
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }

    if (this.settings.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (this.settings.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (this.settings.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return { valid: errors.length === 0, errors };
  }

  // Check password history to prevent reuse
  async checkPasswordHistory(userId: string, newPassword: string): Promise<boolean> {
    const historyCount = this.settings.passwordHistoryCount || 5;
    if (historyCount === 0) return true;

    try {
      // For now, skip password history check as the schema doesn't support it yet
      // This can be enabled when passwordHistory field is added to the user schema
      return true;
    } catch (error) {
      console.error('Error checking password history:', error);
      return true; // Allow if check fails
    }
  }

  // Brute Force Protection
  checkBruteForceProtection(ip: string, identifier: string): { allowed: boolean; remainingTime?: number } {
    if (!this.settings.enableBruteForceProtection) {
      return { allowed: true };
    }

    const key = `${ip}-${identifier}`;
    const attempt = loginAttempts.get(key);
    const threshold = this.settings.lockoutThreshold || 5;
    const duration = this.settings.lockoutDuration || 30; // minutes

    if (!attempt) {
      return { allowed: true };
    }

    // Check if currently locked out
    if (attempt.lockoutUntil && new Date() < attempt.lockoutUntil) {
      const remainingTime = Math.ceil((attempt.lockoutUntil.getTime() - Date.now()) / 1000 / 60);
      return { allowed: false, remainingTime };
    }

    // Check if threshold exceeded
    if (attempt.count >= threshold) {
      const multiplier = this.settings.progressiveLockout || 1.5;
      const lockoutDuration = duration * Math.pow(multiplier, attempt.count - threshold);
      const lockoutUntil = new Date(Date.now() + lockoutDuration * 60 * 1000);
      
      loginAttempts.set(key, { ...attempt, lockoutUntil });
      return { allowed: false, remainingTime: lockoutDuration };
    }

    return { allowed: true };
  }

  recordFailedLogin(ip: string, identifier: string) {
    if (!this.settings.enableBruteForceProtection) return;

    const key = `${ip}-${identifier}`;
    const attempt = loginAttempts.get(key);
    
    if (attempt) {
      loginAttempts.set(key, {
        count: attempt.count + 1,
        lastAttempt: new Date()
      });
    } else {
      loginAttempts.set(key, {
        count: 1,
        lastAttempt: new Date()
      });
    }
  }

  recordSuccessfulLogin(ip: string, identifier: string) {
    const key = `${ip}-${identifier}`;
    loginAttempts.delete(key);
  }

  // IP Access Control
  checkIPAccess(ip: string): { allowed: boolean; reason?: string } {
    // Check blacklist first
    if (this.settings.blacklistedIPs) {
      const blacklisted = this.settings.blacklistedIPs.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      for (const blockedIP of blacklisted) {
        if (this.matchesIPRange(ip, blockedIP)) {
          return { allowed: false, reason: 'IP is blacklisted' };
        }
      }
    }

    // Check dynamic blocks
    if (blockedIPs.has(ip)) {
      return { allowed: false, reason: 'IP is temporarily blocked' };
    }

    // Check whitelist if enabled
    if (this.settings.enableIPWhitelist && this.settings.whitelistedIPs) {
      const whitelisted = this.settings.whitelistedIPs.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      for (const allowedIP of whitelisted) {
        if (this.matchesIPRange(ip, allowedIP)) {
          return { allowed: true };
        }
      }
      
      return { allowed: false, reason: 'IP not in whitelist' };
    }

    return { allowed: true };
  }

  private matchesIPRange(ip: string, range: string): boolean {
    // Simple IP matching - in production, use a proper CIDR library
    if (range.includes('/')) {
      // CIDR notation - simplified check
      const [baseIP] = range.split('/');
      return ip.startsWith(baseIP.split('.').slice(0, -1).join('.'));
    }
    return ip === range;
  }

  // Role-based Access Control
  checkRoleAccess(userRole: string, requestedPath: string): { allowed: boolean; reason?: string } {
    if (!this.settings.enableRoleBasedAccess) {
      return { allowed: true };
    }

    // Check admin-only features
    if (this.settings.adminOnlyFeatures) {
      const adminPaths = this.settings.adminOnlyFeatures.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      for (const adminPath of adminPaths) {
        if (requestedPath.startsWith(adminPath) && userRole !== 'admin') {
          return { allowed: false, reason: 'Admin access required' };
        }
      }
    }

    // Check guest restrictions
    if (this.settings.guestRestrictedAreas && userRole === 'guest') {
      const restrictedPaths = this.settings.guestRestrictedAreas.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      for (const restrictedPath of restrictedPaths) {
        if (requestedPath.startsWith(restrictedPath)) {
          return { allowed: false, reason: 'Authentication required' };
        }
      }
    }

    return { allowed: true };
  }

  // Threat Detection and Response
  analyzeThreat(ip: string, userAgent: string, requestPattern: any): number {
    if (!this.settings.enableThreatDetection) return 0;

    let threatScore = 0;

    // Analyze request patterns
    if (requestPattern.rapidRequests > 100) threatScore += 30;
    if (requestPattern.suspiciousEndpoints > 5) threatScore += 40;
    if (requestPattern.malformedRequests > 10) threatScore += 25;

    // Analyze user agent
    if (!userAgent || userAgent.includes('bot') || userAgent.includes('crawler')) {
      threatScore += 20;
    }

    // Check against known threat indicators
    if (userAgent && userAgent.length < 20) threatScore += 15;
    if (ip && this.isKnownThreatIP(ip)) threatScore += 50;

    // Update threat score
    threatScores.set(ip, Math.max(threatScores.get(ip) || 0, threatScore));

    return threatScore;
  }

  private isKnownThreatIP(ip: string): boolean {
    // In production, this would check against threat intelligence feeds
    const knownThreats = ['192.168.100.', '10.10.10.'];
    return knownThreats.some(threat => ip.startsWith(threat));
  }

  async handleThreatResponse(ip: string, threatScore: number) {
    const threshold = this.settings.threatThreshold || 75;
    if (threatScore < threshold) return;

    const action = this.settings.autoResponseAction || 'log';

    switch (action) {
      case 'block-temp':
        blockedIPs.add(ip);
        setTimeout(() => blockedIPs.delete(ip), 60 * 60 * 1000); // 1 hour
        break;
      case 'block-24h':
        blockedIPs.add(ip);
        setTimeout(() => blockedIPs.delete(ip), 24 * 60 * 60 * 1000); // 24 hours
        break;
      case 'block-permanent':
        blockedIPs.add(ip);
        break;
      case 'alert':
        await this.sendSecurityAlert(ip, threatScore);
        break;
      default:
        console.log(`Threat detected from IP ${ip} with score ${threatScore}`);
    }
  }

  private async sendSecurityAlert(ip: string, threatScore: number) {
    if (!this.settings.alertEmails) return;

    const recipients = this.settings.alertEmails.split('\n')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    const alertData = {
      ip,
      threatScore,
      timestamp: new Date().toISOString(),
      action: 'Security Alert - High Threat Score Detected'
    };

    // Log security alert (in production, send actual emails)
    console.log('Security Alert:', alertData);
    console.log('Recipients:', recipients);
  }

  // Honeypot Detection
  checkHoneypot(formData: any): boolean {
    if (!this.settings.enableHoneypot) return false;

    // Check for honeypot fields that should be empty
    const honeypotFields = ['website', 'url', 'company_website', 'phone_backup'];
    for (const field of honeypotFields) {
      if (formData[field] && formData[field].trim().length > 0) {
        return true; // Bot detected
      }
    }

    return false;
  }

  // Anomaly Detection
  detectAnomalies(userActivity: any): { anomalous: boolean; score: number } {
    if (!this.settings.enableAnomalyDetection) {
      return { anomalous: false, score: 0 };
    }

    let anomalyScore = 0;

    // Check for unusual activity patterns
    if (userActivity.loginTimestamp) {
      const hour = new Date(userActivity.loginTimestamp).getHours();
      if (hour < 6 || hour > 22) anomalyScore += 10; // Unusual hours
    }

    if (userActivity.requestCount > 1000) anomalyScore += 30; // High request volume
    if (userActivity.failedAttempts > 10) anomalyScore += 25; // Multiple failures
    if (userActivity.newLocation) anomalyScore += 20; // New geographic location

    return {
      anomalous: anomalyScore > 40,
      score: anomalyScore
    };
  }
}

// Export singleton instance
export const securityValidator = new SecurityValidator();

// Middleware functions
export const securityMiddleware = {
  // IP Access Control Middleware
  checkIPAccess: async (req: Request, res: Response, next: NextFunction) => {
    await securityValidator.loadSettings();
    const clientIP = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const access = securityValidator.checkIPAccess(clientIP);
    
    if (!access.allowed) {
      return res.status(403).json({
        error: 'Access denied',
        reason: access.reason
      });
    }
    
    next();
  },

  // Brute Force Protection Middleware
  checkBruteForce: (identifier: string = 'general') => {
    return async (req: Request, res: Response, next: NextFunction) => {
      await securityValidator.loadSettings();
      const clientIP = req.ip || req.connection.remoteAddress || '127.0.0.1';
      const protection = securityValidator.checkBruteForceProtection(clientIP, identifier);
      
      if (!protection.allowed) {
        return res.status(429).json({
          error: 'Too many attempts',
          remainingTime: protection.remainingTime,
          message: `Account locked. Try again in ${protection.remainingTime} minutes.`
        });
      }
      
      next();
    };
  },

  // Role-based Access Control Middleware
  checkRoleAccess: (requiredRole: string = 'user') => {
    return async (req: Request, res: Response, next: NextFunction) => {
      await securityValidator.loadSettings();
      const userRole = (req as any).user?.role || 'guest';
      const access = securityValidator.checkRoleAccess(userRole, req.path);
      
      if (!access.allowed) {
        return res.status(403).json({
          error: 'Access denied',
          reason: access.reason
        });
      }
      
      next();
    };
  },

  // Threat Detection Middleware
  threatDetection: async (req: Request, res: Response, next: NextFunction) => {
    await securityValidator.loadSettings();
    const clientIP = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const userAgent = req.get('User-Agent') || '';
    
    // Analyze request patterns (simplified)
    const requestPattern = {
      rapidRequests: 0, // Would track actual request rate
      suspiciousEndpoints: req.path.includes('admin') ? 1 : 0,
      malformedRequests: 0
    };
    
    const threatScore = securityValidator.analyzeThreat(clientIP, userAgent, requestPattern);
    
    if (threatScore > 0) {
      await securityValidator.handleThreatResponse(clientIP, threatScore);
    }
    
    // Continue even if threat detected (response is handled separately)
    next();
  },

  // Honeypot Detection Middleware
  honeypotDetection: async (req: Request, res: Response, next: NextFunction) => {
    await securityValidator.loadSettings();
    
    if (req.method === 'POST' && req.body) {
      const isBot = securityValidator.checkHoneypot(req.body);
      if (isBot) {
        // Silently reject bot traffic
        return res.status(200).json({ success: true }); // Fake success
      }
    }
    
    next();
  }
};
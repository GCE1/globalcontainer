import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { db, pool } from "./db";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export class AuthService {
  static getDbPool() {
    return pool;
  }

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  static generateToken(userId: number): string {
    const secretKey = process.env.JWT_SECRET || 'fallback_secret_key';
    return jwt.sign({ userId }, secretKey, { expiresIn: '24h' });
  }

  static verifyToken(token: string): { userId: number } {
    const secretKey = process.env.JWT_SECRET || 'fallback_secret_key';
    return jwt.verify(token, secretKey) as { userId: number };
  }

  static async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    subscriptionTier?: string;
    subscriptionStatus?: string;
  }) {
    const { email, password, firstName, lastName, subscriptionTier = 'none', subscriptionStatus = 'inactive' } = userData;
    
    const pool = this.getDbPool();
    
    // Check if user already exists - if so, authenticate and return the user
    try {
      const existingUserResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUserResult.rows.length > 0) {
        console.log('Found existing user, verifying password for:', email);
        const existingUser = existingUserResult.rows[0];
        
        // Verify the provided password against stored hash
        if (existingUser.password_hash) {
          const isPasswordValid = await this.verifyPassword(password, existingUser.password_hash);
          if (!isPasswordValid) {
            throw new Error('Invalid password for existing user');
          }
        } else {
          // If no password hash exists, update it with the current password
          console.log('No password hash found for existing user, updating...');
          const passwordHash = await this.hashPassword(password);
          await pool.query(
            'UPDATE users SET password_hash = $1 WHERE email = $2',
            [passwordHash, email]
          );
          existingUser.password_hash = passwordHash;
        }
        
        return existingUser;
      }
    } catch (existingUserError) {
      // If it's a password verification error, re-throw it
      if (existingUserError.message === 'Invalid password for existing user') {
        throw existingUserError;
      }
      console.error('Error checking existing user:', existingUserError);
      throw new Error(`Database error checking existing user: ${existingUserError.message}`);
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user (let database auto-generate integer ID)  
    // Only store the hashed password for security - never store plaintext passwords
    try {
      const result = await pool.query(
        'INSERT INTO users (email, password_hash, first_name, last_name, subscription_tier, subscription_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [email, passwordHash, firstName, lastName, subscriptionTier, subscriptionStatus]
      );
      
      console.log('Database insert result:', result);
      
      if (!result || !result.rows || result.rows.length === 0) {
        throw new Error('Failed to create user - no rows returned');
      }
      
      return result.rows[0];
    } catch (dbError) {
      console.error('Database error in createUser:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }
  }

  static async addUserRole(userId: number, roleData: {
    roleType: string;
    subscriptionStatus?: string;
    subscriptionStartDate?: Date;
    subscriptionEndDate?: Date;
    paymentProcessorId?: string;
    paymentTransactionId?: string;
    autoRenew?: boolean;
    features?: object;
  }) {
    const pool = this.getDbPool();
    
    const {
      roleType,
      subscriptionStatus = 'active',
      subscriptionStartDate = new Date(),
      subscriptionEndDate,
      paymentProcessorId,
      paymentTransactionId,
      autoRenew = true,
      features = {}
    } = roleData;

    // Check if user already has this role
    const existingRoleResult = await pool.query(
      'SELECT * FROM user_roles WHERE user_id = $1 AND role_type = $2',
      [userId, roleType]
    );

    if (existingRoleResult.rows.length > 0) {
      // Update existing role
      const result = await pool.query(
        'UPDATE user_roles SET subscription_status = $1, subscription_start_date = $2, subscription_end_date = $3, payment_processor_id = $4, payment_transaction_id = $5, auto_renew = $6, features = $7, updated_at = NOW() WHERE user_id = $8 AND role_type = $9 RETURNING *',
        [subscriptionStatus, subscriptionStartDate, subscriptionEndDate, paymentProcessorId, paymentTransactionId, autoRenew, JSON.stringify(features), userId, roleType]
      );
      return result.rows[0];
    } else {
      // Create new role
      const result = await pool.query(
        'INSERT INTO user_roles (user_id, role_type, subscription_status, subscription_start_date, subscription_end_date, payment_processor_id, payment_transaction_id, auto_renew, features) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [userId, roleType, subscriptionStatus, subscriptionStartDate, subscriptionEndDate, paymentProcessorId, paymentTransactionId, autoRenew, JSON.stringify(features)]
      );
      return result.rows[0];
    }
  }

  static async cancelUserSubscription(userId: number, roleType: string) {
    const pool = this.getDbPool();
    
    try {
      // Update subscription status to cancelled but keep access until period end
      const result = await pool.query(
        'UPDATE user_roles SET subscription_status = $1, auto_renew = $2, updated_at = NOW() WHERE user_id = $3 AND role_type = $4 AND subscription_status = $5 RETURNING *',
        ['cancelled', false, userId, roleType, 'active']
      );

      if (result.rows.length === 0) {
        throw new Error('Subscription not found or already cancelled');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  static async reactivateUserSubscription(userId: number, roleType: string) {
    const pool = this.getDbPool();
    
    try {
      // Reactivate subscription if cancelled
      const result = await pool.query(
        'UPDATE user_roles SET subscription_status = $1, auto_renew = $2, updated_at = NOW() WHERE user_id = $3 AND role_type = $4 AND subscription_status = $5 RETURNING *',
        ['active', true, userId, roleType, 'cancelled']
      );

      if (result.rows.length === 0) {
        throw new Error('Subscription not found or cannot be reactivated');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }

  static async getUserRoles(userId: number) {
    const pool = this.getDbPool();
    const result = await pool.query(
      'SELECT * FROM user_roles WHERE user_id = $1 AND subscription_status = $2 ORDER BY created_at DESC',
      [userId, 'active']
    );
    return result.rows;
  }

  static async hasRole(userId: number, roleType: string): Promise<boolean> {
    const pool = this.getDbPool();
    const result = await pool.query(
      'SELECT 1 FROM user_roles WHERE user_id = $1 AND role_type = $2 AND subscription_status = $3 AND (subscription_end_date IS NULL OR subscription_end_date > NOW())',
      [userId, roleType, 'active']
    );
    return result.rows.length > 0;
  }

  static async authenticateUser(email: string, password: string) {
    const pool = this.getDbPool();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    let isPasswordValid = false;

    // First try password_hash field (hashed password)
    if (user.password_hash) {
      isPasswordValid = await this.verifyPassword(password, user.password_hash);
    }
    
    // If password_hash didn't work, try the password field (could be plaintext or hashed)
    if (!isPasswordValid && user.password) {
      // Check if it's a plaintext password
      if (user.password === password) {
        // Plaintext password found - hash it and update the database
        console.log('Converting plaintext password to hash for user:', email);
        const passwordHash = await this.hashPassword(password);
        await pool.query(
          'UPDATE users SET password_hash = $1, password = NULL WHERE email = $2',
          [passwordHash, email]
        );
        isPasswordValid = true;
      } else {
        // Try to verify as a hashed password
        try {
          isPasswordValid = await this.verifyPassword(password, user.password);
          if (isPasswordValid && !user.password_hash) {
            // Move the hash from password to password_hash field
            console.log('Moving hash from password to password_hash field for user:', email);
            await pool.query(
              'UPDATE users SET password_hash = $1, password = NULL WHERE email = $2',
              [user.password, email]
            );
          }
        } catch (bcryptError) {
          // If bcrypt fails, the password field contains invalid data
          console.log('Invalid hash in password field for user:', email);
        }
      }
    }

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return user;
  }

  static async getUserById(userId: number) {
    const pool = this.getDbPool();
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0];
  }

  static async registerUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    subscriptionTier?: string;
    subscriptionStatus?: string;
  }) {
    return await this.createUser(userData);
  }

  static async updateUserSubscription(userId: number, subscriptionData: {
    subscriptionTier: string;
    subscriptionStatus: string;
    subscriptionStartDate: Date;
    subscriptionEndDate: Date;
  }) {
    const pool = this.getDbPool();
    const { subscriptionTier, subscriptionStatus, subscriptionStartDate, subscriptionEndDate } = subscriptionData;
    
    const result = await pool.query(
      'UPDATE users SET subscription_tier = $1, subscription_status = $2, subscription_start_date = $3, subscription_end_date = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [subscriptionTier, subscriptionStatus, subscriptionStartDate, subscriptionEndDate, userId]
    );
    
    return result.rows[0];
  }

  static async createPasswordResetToken(email: string): Promise<string> {
    const pool = this.getDbPool();
    const token = Math.random().toString(36).substr(2, 15) + Math.random().toString(36).substr(2, 15);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration

    // Store token in database (create table if needed)
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          token VARCHAR(255) NOT NULL UNIQUE,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Remove any existing tokens for this email
      await pool.query('DELETE FROM password_reset_tokens WHERE email = $1', [email]);

      // Insert new token
      await pool.query(
        'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES ($1, $2, $3)',
        [email, token, expiresAt]
      );

      return token;
    } catch (error) {
      console.error('Error creating password reset token:', error);
      throw new Error('Failed to create password reset token');
    }
  }

  static async validatePasswordResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
    const pool = this.getDbPool();
    
    try {
      const result = await pool.query(
        'SELECT email, expires_at, used FROM password_reset_tokens WHERE token = $1',
        [token]
      );

      if (result.rows.length === 0) {
        return { valid: false };
      }

      const tokenData = result.rows[0];
      
      if (tokenData.used) {
        return { valid: false };
      }

      if (new Date() > new Date(tokenData.expires_at)) {
        return { valid: false };
      }

      return { valid: true, email: tokenData.email };
    } catch (error) {
      console.error('Error validating password reset token:', error);
      return { valid: false };
    }
  }

  static async setPasswordWithToken(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const pool = this.getDbPool();
    
    try {
      // Validate token
      const validation = await this.validatePasswordResetToken(token);
      if (!validation.valid || !validation.email) {
        return { success: false, message: 'Invalid or expired token' };
      }

      // Hash the new password
      const passwordHash = await this.hashPassword(newPassword);

      // Update user password
      const updateResult = await pool.query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2 RETURNING id',
        [passwordHash, validation.email]
      );

      if (updateResult.rows.length === 0) {
        return { success: false, message: 'User not found' };
      }

      // Mark token as used
      await pool.query('UPDATE password_reset_tokens SET used = TRUE WHERE token = $1', [token]);

      return { success: true, message: 'Password set successfully' };
    } catch (error) {
      console.error('Error setting password with token:', error);
      return { success: false, message: 'Failed to set password' };
    }
  }
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = AuthService.verifyToken(token);
    const user = await AuthService.getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireSubscription = (requiredTier?: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = req.user;
    
    // Check if user has an active subscription
    if (!user.subscription_status || user.subscription_status !== 'active') {
      return res.status(403).json({ 
        message: 'Active subscription required',
        subscriptionRequired: true 
      });
    }

    // Check subscription tier if specified
    if (requiredTier && user.subscription_tier !== requiredTier) {
      return res.status(403).json({ 
        message: `${requiredTier} subscription tier required`,
        currentTier: user.subscription_tier,
        requiredTier: requiredTier
      });
    }

    next();
  };
};
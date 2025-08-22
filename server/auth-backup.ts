import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { users, customers } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  }

  static verifyToken(token: string): { userId: string } {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
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
    
    // Check if user already exists using direct database query
    const pool = (db as any).pool;
    const existingUserResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUserResult.rows.length > 0) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);
    const userId = uuidv4();

    // Create user using direct database connection to match actual database structure
    const result = await pool.query(
      'INSERT INTO users (id, email, password_hash, first_name, last_name, subscription_tier, subscription_status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, email, passwordHash, firstName, lastName, subscriptionTier, subscriptionStatus]
    );
    
    const newUser = result.rows[0];

    return newUser;
  }

  static async authenticateUser(email: string, password: string) {
    const pool = (db as any).pool;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user || !user.password_hash) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await this.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return user;
  }

  static async getUserById(userId: string) {
    const pool = (db as any).pool;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0];
  }

  static async registerUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    subscriptionTier: string;
    subscriptionStatus: string;
  }) {
    return this.createUser(userData);
  }

  static async updateUserSubscription(userId: string, subscriptionData: {
    subscriptionTier: string;
    subscriptionStatus: string;
    subscriptionStartDate: Date;
    subscriptionEndDate: Date;
  }) {
    await db.update(users)
      .set({
        ...subscriptionData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = AuthService.verifyToken(token);
    const user = await AuthService.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const requireSubscription = (requiredTier?: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.subscriptionStatus !== 'active') {
      return res.status(403).json({ message: 'Active subscription required' });
    }

    if (requiredTier && req.user.subscriptionTier !== requiredTier) {
      return res.status(403).json({ message: `${requiredTier} subscription tier required` });
    }

    next();
  };
};
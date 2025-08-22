import { AuthService } from './auth';
import { db } from './db';
import { sql, eq, and } from 'drizzle-orm';
import { users, userRoles } from '@shared/schema';
import bcrypt from 'bcryptjs';

export interface PaymentAuthData {
  email: string;
  firstName: string;
  lastName: string;
  tier: 'insights' | 'expert' | 'pro';
  paymentId: string;
  amount: number;
}

export class PaymentAuthService {
  // Create or update user after successful payment
  static async createUserAfterPayment(paymentData: PaymentAuthData) {
    try {
      console.log('Creating user after payment:', paymentData);
      
      // Check if user exists
      const existingUserResult = await db.select().from(users).where(eq(users.email, paymentData.email));
      
      let user;
      if (existingUserResult.length > 0) {
        // Update existing user
        user = existingUserResult[0];
        await db.update(users)
          .set({
            firstName: paymentData.firstName,
            lastName: paymentData.lastName,
            subscriptionTier: paymentData.tier,
            subscriptionStatus: 'active',
            updatedAt: new Date()
          })
          .where(eq(users.email, paymentData.email));
      } else {
        // Create new user with a hashed password for payment-auth users
        const hashedPassword = await bcrypt.hash('payment_auth_user', 12);
        
        const insertResult = await db.insert(users)
          .values({
            email: paymentData.email,
            password: hashedPassword,
            passwordHash: hashedPassword,
            firstName: paymentData.firstName || 'User',
            lastName: paymentData.lastName || 'Member',
            subscriptionTier: paymentData.tier,
            subscriptionStatus: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
          })
          .returning();
        
        user = insertResult[0];
      }
      
      // Add user role for tier
      await this.addUserRole(Number(user.id), paymentData.tier);
      
      // Generate token
      const token = AuthService.generateToken(Number(user.id));
      
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          subscriptionTier: user.subscriptionTier,
          subscriptionStatus: user.subscriptionStatus
        },
        token
      };
    } catch (error) {
      console.error('Error creating user after payment:', error);
      throw error;
    }
  }
  
  // Add user role for membership tier
  static async addUserRole(userId: number, tier: 'insights' | 'expert' | 'pro') {
    try {
      await db.insert(userRoles).values({
        userId: userId,
        roleType: tier,
        subscriptionStatus: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }).onConflictDoUpdate({
        target: [userRoles.userId, userRoles.roleType],
        set: {
          subscriptionStatus: 'active',
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error adding user role:', error);
      throw error;
    }
  }
  
  // Authenticate user by email (only for payment-verified users)
  static async authenticateByEmail(email: string) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(and(
          eq(users.email, email),
          eq(users.subscriptionStatus, 'active')
        ))
        .limit(1);
      
      if (!user) {
        throw new Error('User not found or subscription not active');
      }
      
      const token = AuthService.generateToken(Number(user.id));
      
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          subscriptionTier: user.subscriptionTier,
          subscriptionStatus: user.subscriptionStatus
        },
        token
      };
    } catch (error) {
      console.error('Error authenticating by email:', error);
      throw error;
    }
  }
}
import { Request, Response } from "express";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: 'month' | 'year';
  features: string[];
}

export const MEMBERSHIP_PLANS: Record<string, MembershipPlan> = {
  insights: {
    id: 'insights',
    name: 'Insights',
    price: 49.00,
    duration: 'month',
    features: [
      'analytics_dashboard',
      'container_tracking',
      'performance_metrics',
      'custom_reports',
      'data_export',
      'market_trends',
      'email_support'
    ]
  },
  expert: {
    id: 'expert',
    name: 'Expert',
    price: 99.99,
    duration: 'month',
    features: [
      'analytics_dashboard',
      'container_tracking',
      'performance_metrics',
      'custom_reports',
      'data_export',
      'market_trends',
      'email_support',
      'leasing_management',
      'contract_management',
      'automated_billing',
      'multi_location',
      'crm_access',
      'phone_support',
      'account_manager'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 199.99,
    duration: 'month',
    features: [
      'analytics_dashboard',
      'container_tracking',
      'performance_metrics',
      'custom_reports',
      'data_export',
      'market_trends',
      'email_support',
      'leasing_management',
      'contract_management',
      'automated_billing',
      'multi_location',
      'crm_access',
      'phone_support',
      'account_manager',
      'wholesale_marketplace',
      'bulk_orders',
      'volume_pricing',
      'api_access',
      'white_label',
      'premium_support',
      'custom_development',
      'enterprise_sla'
    ]
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    price: 0,
    duration: 'month',
    features: [
      'admin_dashboard',
      'user_management',
      'system_settings',
      'analytics_dashboard',
      'container_tracking',
      'performance_metrics',
      'custom_reports',
      'data_export',
      'market_trends',
      'leasing_management',
      'contract_management',
      'automated_billing',
      'multi_location',
      'crm_access',
      'wholesale_marketplace',
      'bulk_orders',
      'volume_pricing',
      'api_access',
      'white_label',
      'premium_support',
      'custom_development',
      'enterprise_sla',
      'full_admin_access'
    ]
  },
  affiliates: {
    id: 'affiliates',
    name: 'Affiliates',
    price: 0,
    duration: 'month',
    features: [
      'affiliate_dashboard',
      'commission_tracking',
      'referral_management',
      'performance_metrics',
      'custom_reports',
      'data_export',
      'email_support',
      'marketing_tools',
      'promotional_materials',
      'analytics_dashboard'
    ]
  }
};

export class MembershipService {
  
  async getMembershipStatus(userId: number) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return {
          isActive: false,
          plan: null,
          expiresAt: null,
          features: []
        };
      }

      // Check if subscription is active and not expired
      const isActive = user.subscriptionStatus === 'active' && 
        user.subscriptionEndDate && 
        new Date(user.subscriptionEndDate) > new Date();

      const plan = isActive ? user.subscriptionTier as 'insights' | 'expert' | 'pro' : null;
      const features = plan ? MEMBERSHIP_PLANS[plan]?.features || [] : [];

      return {
        isActive,
        plan,
        expiresAt: user.subscriptionEndDate?.toISOString() || null,
        features
      };
    } catch (error) {
      console.error("Error getting membership status:", error);
      return {
        isActive: false,
        plan: null,
        expiresAt: null,
        features: []
      };
    }
  }

  async activateMembership(userId: number, planId: string, paymentId: string) {
    try {
      const plan = MEMBERSHIP_PLANS[planId];
      if (!plan) {
        throw new Error("Invalid plan ID");
      }

      // Calculate subscription end date (1 month from now)
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await db
        .update(users)
        .set({
          subscriptionTier: planId,
          subscriptionStatus: 'active',
          subscriptionStartDate: new Date(),
          subscriptionEndDate: endDate,
          paymentProcessorId: paymentId,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error("Error activating membership:", error);
      throw error;
    }
  }

  async cancelMembership(userId: number) {
    try {
      await db
        .update(users)
        .set({
          subscriptionStatus: 'cancelled',
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error("Error cancelling membership:", error);
      throw error;
    }
  }

  hasFeature(userFeatures: string[], requiredFeature: string): boolean {
    return userFeatures.includes(requiredFeature);
  }

  hasPlanAccess(userPlan: string | null, requiredPlan: string): boolean {
    if (!userPlan) return false;
    
    const planHierarchy = { insights: 1, expert: 2, pro: 3 };
    const userLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0;
    const requiredLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] || 0;
    
    return userLevel >= requiredLevel;
  }
}

export const membershipService = new MembershipService();

// Middleware to check membership requirements
export function requireMembership(requiredPlan?: string) {
  return async (req: Request, res: Response, next: Function) => {
    try {
      // Get user ID from authenticated session
      const userId = req.session?.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const membership = await membershipService.getMembershipStatus(userId);

      if (!membership.isActive) {
        return res.status(403).json({
          error: "Membership required",
          message: "Active membership required to access this feature",
          redirectTo: "/membership-required"
        });
      }

      if (requiredPlan && !membershipService.hasPlanAccess(membership.plan, requiredPlan)) {
        return res.status(403).json({
          error: "Insufficient membership plan",
          message: `${requiredPlan} plan or higher required`,
          currentPlan: membership.plan,
          redirectTo: "/membership-required"
        });
      }

      // Add membership info to request
      (req as any).membership = membership;
      next();
    } catch (error) {
      console.error("Membership check error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
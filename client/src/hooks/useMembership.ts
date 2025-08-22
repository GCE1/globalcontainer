import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect } from "react";

export interface MembershipStatus {
  isActive: boolean;
  plan: 'insights' | 'expert' | 'pro' | null;
  expiresAt: string | null;
  features: string[];
}

export function useMembership() {
  // Get user data which includes roles
  const { data: user, isLoading: userLoading } = useQuery<any>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Check if user has active roles
  const hasActiveRoles = user?.roles?.some((role: any) => 
    role.subscription_status === 'active' &&
    (!role.subscription_end_date || new Date(role.subscription_end_date) > new Date())
  );

  const activeRole = user?.roles?.find((role: any) => 
    role.subscription_status === 'active' &&
    (!role.subscription_end_date || new Date(role.subscription_end_date) > new Date())
  );

  const membership = hasActiveRoles ? {
    isActive: true,
    plan: activeRole?.role_type || null,
    expiresAt: activeRole?.subscription_end_date || null,
    features: ['analytics_dashboard', 'container_tracking', 'performance_metrics']
  } : {
    isActive: false,
    plan: null,
    expiresAt: null,
    features: []
  };

  return {
    membership,
    isLoading: userLoading,
    isActive: membership?.isActive || false,
    plan: membership?.plan || null,
    features: membership?.features || [],
  };
}

export function useRequireMembership(requiredPlan?: 'insights' | 'expert' | 'pro') {
  const [, setLocation] = useLocation();
  const { membership, isLoading } = useMembership();

  useEffect(() => {
    if (!isLoading) {
      // If no active membership, redirect to paywall
      if (!membership?.isActive) {
        setLocation('/membership-required');
        return;
      }

      // Check if specific plan is required
      if (requiredPlan) {
        const planHierarchy = { insights: 1, expert: 2, pro: 3 };
        const userPlanLevel = membership.plan ? planHierarchy[membership.plan] : 0;
        const requiredLevel = planHierarchy[requiredPlan];

        if (userPlanLevel < requiredLevel) {
          setLocation('/membership-required');
          return;
        }
      }
    }
  }, [membership, isLoading, requiredPlan, setLocation]);

  return {
    isAllowed: membership?.isActive && (!requiredPlan || 
      (membership.plan && getPlanLevel(membership.plan) >= getPlanLevel(requiredPlan))),
    isLoading,
    membership
  };
}

function getPlanLevel(plan: 'insights' | 'expert' | 'pro'): number {
  const levels = { insights: 1, expert: 2, pro: 3 };
  return levels[plan] || 0;
}

export function hasFeature(membership: MembershipStatus | undefined, feature: string): boolean {
  return membership?.features.includes(feature) || false;
}

// Define feature access for each plan
export const PLAN_FEATURES = {
  insights: [
    'analytics_dashboard',
    'container_tracking',
    'performance_metrics',
    'custom_reports',
    'data_export',
    'market_trends',
    'email_support'
  ],
  expert: [
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
  ],
  pro: [
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
};
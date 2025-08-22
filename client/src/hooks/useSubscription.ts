import { useAuth } from "./useAuth";
import { useUserRoles, useHasAnyRole } from "./useUserRoles";

export type SubscriptionTier = "insights" | "expert" | "pro" | "admin" | "affiliates";

export interface SubscriptionFeatures {
  containerSearch: boolean;
  advancedFilters: boolean;
  priceAnalytics: boolean;
  bulkOperations: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
  customReports: boolean;
  exportData: boolean;
  realTimeUpdates: boolean;
  advancedMapping: boolean;
  inventoryManagement: boolean;
  wholesaleAccess: boolean;
  leasingManagement: boolean;
  multiUserAccess: boolean;
  whiteLabeling: boolean;
}

const TIER_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    containerSearch: true,
    advancedFilters: false,
    priceAnalytics: false,
    bulkOperations: false,
    apiAccess: false,
    prioritySupport: false,
    customReports: false,
    exportData: false,
    realTimeUpdates: false,
    advancedMapping: false,
    inventoryManagement: false,
    wholesaleAccess: false,
    leasingManagement: false,
    multiUserAccess: false,
    whiteLabeling: false,
  },
  insights: {
    containerSearch: true,
    advancedFilters: true,
    priceAnalytics: true,
    bulkOperations: false,
    apiAccess: false,
    prioritySupport: false,
    customReports: true,
    exportData: true,
    realTimeUpdates: false,
    advancedMapping: true,
    inventoryManagement: false,
    wholesaleAccess: false,
    leasingManagement: false,
    multiUserAccess: false,
    whiteLabeling: false,
  },
  professional: {
    containerSearch: true,
    advancedFilters: true,
    priceAnalytics: true,
    bulkOperations: true,
    apiAccess: true,
    prioritySupport: true,
    customReports: true,
    exportData: true,
    realTimeUpdates: true,
    advancedMapping: true,
    inventoryManagement: true,
    wholesaleAccess: true,
    leasingManagement: false,
    multiUserAccess: false,
    whiteLabeling: false,
  },
  expert: {
    containerSearch: true,
    advancedFilters: true,
    priceAnalytics: true,
    bulkOperations: true,
    apiAccess: true,
    prioritySupport: true,
    customReports: true,
    exportData: true,
    realTimeUpdates: true,
    advancedMapping: true,
    inventoryManagement: true,
    wholesaleAccess: true,
    leasingManagement: true,
    multiUserAccess: true,
    whiteLabeling: true,
  },
  pro: {
    containerSearch: true,
    advancedFilters: true,
    priceAnalytics: true,
    bulkOperations: true,
    apiAccess: true,
    prioritySupport: true,
    customReports: true,
    exportData: true,
    realTimeUpdates: true,
    advancedMapping: true,
    inventoryManagement: true,
    wholesaleAccess: true,
    leasingManagement: true,
    multiUserAccess: true,
    whiteLabeling: true,
  },
};

export function useSubscription() {
  const { user } = useAuth();
  const { data: rolesData, isLoading: rolesLoading } = useUserRoles();
  const { hasAnyRole: hasInsights } = useHasAnyRole(['insights']);
  const { hasAnyRole: hasExpert } = useHasAnyRole(['expert']);
  const { hasAnyRole: hasPro } = useHasAnyRole(['pro']);
  const { hasAnyRole: hasLeasing } = useHasAnyRole(['leasing']);
  const { hasAnyRole: hasWholesale } = useHasAnyRole(['wholesale']);
  
  // Legacy support - use user's subscription tier if no roles found
  const legacyTier: SubscriptionTier = user?.subscriptionTier as SubscriptionTier || "free";
  const legacyStatus = user?.subscriptionStatus || "inactive";
  
  // Determine current tier from roles (highest tier wins)
  let currentTier: SubscriptionTier = "free";
  let isActive = false;
  
  if (rolesLoading) {
    // While loading roles, use legacy system
    currentTier = legacyTier;
    isActive = legacyStatus === "active";
  } else if (rolesData?.roles?.length > 0) {
    // Use role-based system
    const activeRoles = rolesData.roles.filter(role => 
      role.subscriptionStatus === 'active' &&
      (!role.subscriptionEndDate || new Date(role.subscriptionEndDate) > new Date())
    );
    
    if (activeRoles.length > 0) {
      isActive = true;
      
      // Determine highest tier from active roles
      if (activeRoles.some(role => role.roleType === 'pro')) {
        currentTier = 'pro';
      } else if (activeRoles.some(role => role.roleType === 'expert')) {
        currentTier = 'expert';
      } else if (activeRoles.some(role => role.roleType === 'insights')) {
        currentTier = 'insights';
      }
    }
  } else {
    // No roles found, use legacy system
    currentTier = legacyTier;
    isActive = legacyStatus === "active";
  }
  
  const features = TIER_FEATURES[currentTier] || TIER_FEATURES.free;
  
  const hasFeature = (feature: keyof SubscriptionFeatures): boolean => {
    if (!isActive && currentTier !== "free") return false;
    
    // Check role-specific features
    if (feature === 'leasingManagement' && hasLeasing) return true;
    if (feature === 'wholesaleAccess' && hasWholesale) return true;
    
    return features?.[feature] || false;
  };
  
  const canAccess = (feature: keyof SubscriptionFeatures): boolean => {
    return hasFeature(feature);
  };
  
  const getUpgradeMessage = (feature: keyof SubscriptionFeatures): string => {
    if (currentTier === "free") {
      return "Please subscribe to access this feature";
    }
    
    // Find the minimum tier that supports this feature
    const requiredTiers = Object.entries(TIER_FEATURES)
      .filter(([tier, tierFeatures]) => tier !== "free" && tierFeatures[feature])
      .map(([tier]) => tier);
    
    if (requiredTiers.length === 0) {
      return "This feature is not available";
    }
    
    const lowestTier = requiredTiers[0];
    const tierNames = {
      insights: "Insights ($49/month)",
      professional: "Professional ($199/month)", 
      expert: "Expert ($149/month)",
      pro: "Pro ($199/month)"
    };
    
    return `Upgrade to ${tierNames[lowestTier as keyof typeof tierNames]} to access this feature`;
  };
  
  // Additional role-specific helpers
  const userRoles = rolesData?.roles?.filter(role => 
    role.subscriptionStatus === 'active' &&
    (!role.subscriptionEndDate || new Date(role.subscriptionEndDate) > new Date())
  ) || [];
  
  return {
    currentTier,
    subscriptionStatus: isActive ? 'active' : 'inactive',
    isActive,
    features,
    hasFeature,
    canAccess,
    getUpgradeMessage,
    userRoles,
    hasInsights,
    hasExpert,
    hasPro,
    hasLeasing,
    hasWholesale,
    isLoading: rolesLoading,
  };
}
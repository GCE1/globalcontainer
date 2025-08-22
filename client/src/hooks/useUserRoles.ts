import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface UserRole {
  id: number;
  user_id: number;
  role_type: string;
  subscription_status: 'active' | 'cancelled' | 'expired' | 'pending';
  subscription_start_date: string;
  subscription_end_date?: string;
  payment_processor_id?: string;
  payment_transaction_id?: string;
  auto_renew: boolean;
  features: object;
  created_at: string;
  updated_at: string;
}

export function useUserRoles() {
  return useQuery({
    queryKey: ['/api/user/roles'],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      console.log('useUserRoles queryFn - token exists:', !!token);
      
      if (!token) {
        console.log('No token found in localStorage');
        return null;
      }
      
      console.log('Making API request to /api/user/roles');
      const response = await fetch('/api/user/roles', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('Unauthorized - clearing token');
          localStorage.removeItem('authToken');
          return null;
        }
        throw new Error('Failed to fetch user roles');
      }
      
      const data = await response.json();
      console.log('User roles API response:', data);
      return data.roles as UserRole[];
    },
    enabled: !!localStorage.getItem('authToken'),
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleType: string) => {
      const response = await apiRequest('POST', '/api/user/subscription/cancel', { roleType });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/roles'] });
    }
  });
}

export function useReactivateSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleType: string) => {
      const response = await apiRequest('POST', '/api/user/subscription/reactivate', { roleType });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/roles'] });
    }
  });
}

export function useHasAnyRole() {
  const { data: roles, isLoading, error } = useUserRoles();
  
  return {
    hasAnyRole: (roleTypes: string[]) => {
      if (!roles) return false;
      return roles.some(role => 
        roleTypes.includes(role.role_type) && role.subscription_status === 'active'
      );
    },
    isLoading,
    error
  };
}
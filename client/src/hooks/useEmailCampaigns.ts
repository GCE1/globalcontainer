import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  type: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
  audience: string;
  recipientCount: number;
  templateId?: number;
  htmlContent?: string;
  plainTextContent?: string;
  scheduledAt?: string;
  sentAt?: string;
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  emailsBounced: number;
  emailsUnsubscribed: number;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: number;
  name: string;
  category: string;
  subject: string;
  htmlContent: string;
  plainTextContent?: string;
  isActive: boolean;
  variables?: any;
  designTheme: string;
  brandingSettings?: any;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignAnalytics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

export interface CreateCampaignData {
  name: string;
  subject: string;
  type: string;
  audience: string;
  htmlContent?: string;
  plainTextContent?: string;
  templateId?: number;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  scheduledAt?: string;
}

export interface CampaignRecipient {
  id: number;
  campaignId: number;
  userId?: number;
  email: string;
  status: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed';
  sentAt?: string;
  deliveredAt?: string;
  failureReason?: string;
  createdAt: string;
}

export interface CreateTemplateData {
  name: string;
  category: string;
  subject: string;
  htmlContent: string;
  plainTextContent?: string;
  designTheme?: string;
  variables?: any;
  brandingSettings?: any;
}

// Custom hook for email campaigns
export function useEmailCampaigns() {
  return useQuery({
    queryKey: ['/api/admin/campaigns'],
    queryFn: async (): Promise<EmailCampaign[]> => {
      const response = await fetch('/api/admin/campaigns', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      return response.json();
    }
  });
}

export function useEmailCampaign(id: number) {
  return useQuery({
    queryKey: ['/api/admin/campaigns', id],
    queryFn: async (): Promise<EmailCampaign> => {
      const response = await fetch(`/api/admin/campaigns/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch campaign');
      return response.json();
    },
    enabled: !!id
  });
}

export function useCampaignAnalytics(id: number) {
  return useQuery({
    queryKey: ['/api/admin/campaigns', id, 'analytics'],
    queryFn: async (): Promise<CampaignAnalytics> => {
      const response = await fetch(`/api/admin/campaigns/${id}/analytics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    enabled: !!id
  });
}

export function useEmailTemplates() {
  return useQuery({
    queryKey: ['/api/admin/templates'],
    queryFn: async (): Promise<EmailTemplate[]> => {
      const response = await fetch('/api/admin/templates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch templates');
      return response.json();
    }
  });
}

export function useEmailTemplate(id: number) {
  return useQuery({
    queryKey: ['/api/admin/templates', id],
    queryFn: async (): Promise<EmailTemplate> => {
      const response = await fetch(`/api/admin/templates/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch template');
      return response.json();
    },
    enabled: !!id
  });
}

// Mutations for campaigns
export function useCreateCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateCampaignData) => {
      const response = await fetch('/api/admin/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create campaign');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns'] });
    }
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateCampaignData> }) => {
      const response = await fetch(`/api/admin/campaigns/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update campaign');
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns', variables.id] });
    }
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/campaigns/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to delete campaign');
      return response.json();
    },
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['/api/admin/campaigns'] });

      // Snapshot the previous value
      const previousCampaigns = queryClient.getQueryData(['/api/admin/campaigns']);

      // Optimistically update by removing the deleted campaign
      queryClient.setQueryData(['/api/admin/campaigns'], (old: EmailCampaign[] = []) => 
        old.filter(campaign => campaign.id !== deletedId)
      );

      // Return a context object with the snapshotted value
      return { previousCampaigns };
    },
    onError: (err, deletedId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['/api/admin/campaigns'], context?.previousCampaigns);
    },
    onSettled: () => {
      // Always refetch after error or success to make sure we have correct data
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns'] });
      // Force refetch immediately
      queryClient.refetchQueries({ queryKey: ['/api/admin/campaigns'] });
      // Clear all related cache entries
      queryClient.removeQueries({ queryKey: ['/api/admin/campaigns'], exact: false });
    }
  });
}

export function useSendCampaign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/campaigns/${id}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to send campaign');
      return response.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns', id, 'analytics'] });
    }
  });
}

// Mutations for templates
export function useCreateTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateTemplateData) => {
      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create template');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
    }
  });
}

// Campaign recipient management hooks
export function useCampaignRecipients(campaignId: number) {
  return useQuery({
    queryKey: [`/api/admin/campaigns/${campaignId}/recipients`],
    queryFn: async (): Promise<CampaignRecipient[]> => {
      const response = await fetch(`/api/admin/campaigns/${campaignId}/recipients`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch recipients');
      return response.json();
    },
    enabled: !!campaignId
  });
}

export function useAddRecipients() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, emails }: { campaignId: number; emails: string[] }) => {
      const response = await fetch(`/api/admin/campaigns/${campaignId}/recipients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emails })
      });
      if (!response.ok) throw new Error('Failed to add recipients');
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/campaigns/${variables.campaignId}/recipients`] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns'] });
    }
  });
}

export function useRemoveRecipients() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, emails }: { campaignId: number; emails: string[] }) => {
      const response = await fetch(`/api/admin/campaigns/${campaignId}/recipients`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emails })
      });
      if (!response.ok) throw new Error('Failed to remove recipients');
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/campaigns/${variables.campaignId}/recipients`] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns'] });
    }
  });
}

export function useParseBulkEmails() {
  return useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('/api/admin/campaigns/parse-emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });
      if (!response.ok) throw new Error('Failed to parse emails');
      return response.json();
    }
  });
}

// Test email sending
export function useTestEmailSend() {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      subject: string;
      content: string;
      fromEmail?: string;
      fromName?: string;
    }) => {
      const response = await fetch('/api/admin/campaigns/test-send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to send test email');
      return response.json();
    }
  });
}

// Calculate campaign overview stats
export function useCampaignOverviewStats() {
  const { data: campaigns = [] } = useEmailCampaigns();
  
  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter((c: EmailCampaign) => c.status === 'sent' || c.status === 'sending').length,
    totalRecipients: campaigns.reduce((sum: number, campaign: EmailCampaign) => sum + campaign.recipientCount, 0),
    avgOpenRate: campaigns.length > 0 
      ? ((campaigns.reduce((sum: number, campaign: EmailCampaign) => sum + (campaign.emailsSent > 0 ? (campaign.emailsOpened / campaign.emailsSent) * 100 : 0), 0) / campaigns.length).toFixed(1) + '%')
      : 'N/A',
    avgClickRate: campaigns.length > 0 
      ? ((campaigns.reduce((sum: number, campaign: EmailCampaign) => sum + (campaign.emailsSent > 0 ? (campaign.emailsClicked / campaign.emailsSent) * 100 : 0), 0) / campaigns.length).toFixed(1) + '%')
      : 'N/A'
  };
  
  return stats;
}
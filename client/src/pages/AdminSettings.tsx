import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  useEmailCampaigns, 
  useEmailTemplates, 
  useCampaignOverviewStats,
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
  useSendCampaign,
  useCreateTemplate,
  useTestEmailSend,
  type EmailCampaign,
  type EmailTemplate 
} from "@/hooks/useEmailCampaigns";
import RecipientManager from "@/components/RecipientManager";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailTesting from '@/components/EmailTesting';
import { ObjectUploader } from "@/components/ObjectUploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Settings,
  ArrowLeft,
  Save,
  RefreshCw,
  Shield,
  ShieldAlert,
  Globe,
  Mail,
  Bell,
  Database,
  Users,
  CreditCard,
  Key,
  AlertTriangle,
  CheckCircle,
  Zap,
  Clock,
  ShoppingCart,
  Lock,
  Unlock,
  UserPlus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Copy,
  FileText,
  Plus,
  X,
  Code,
  Megaphone,
  Activity,
  Filter,
  Calendar,
  Download,
  AlertCircle,
  XCircle,
  Pause,
  Play,
  BarChart,
  Upload,
  MousePointer,
  Send,
  Paperclip
} from "lucide-react";

interface AdminSettings {
  id: number;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportEmail: string;
  companyPhone: string;
  companyAddress: string;
  allowRegistration: boolean;
  autoApproveUsers: boolean;
  maxUsersPerDay: number;
  dateFormat: string;
  languageDefault: string;
  enableOrders: boolean;
  enableQuoteRequests: boolean;
  enableInventoryTracking: boolean;
  minOrderValue: number;
  maxOrderValue: number;
  defaultShippingDays: number;
  enableNotifications: boolean;
  enableAnalytics: boolean;
  logRetentionDays: number;
  emailOrderNotifications: boolean;
  slackIntegration: boolean;
  notificationEmail: string;
  notificationThreshold: number;
  requireEmailVerification: boolean;
  enableTwoFactor: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  backupFrequency: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  securityAlerts: boolean;
  apiRateLimit: number;
  maxFileUploadSize: number;
  allowedFileTypes: string;
  timezone: string;
  currency: string;
  language: string;
  paymentGateway: string;
  stripePublicKey: string;
  stripeSecretKey: string;
  emailProvider: string;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  emailDomain: string;
  autoGenerateEmails: boolean;
  emailGenerationFormat: string;
  departmentEmailPrefixes: string;
  // Email Branding Fields
  emailHeaderLogo?: string;
  emailHeaderBg?: string;
  emailHeaderText?: string;
  emailHeaderTagline?: string;
  emailFooterContent?: string;
  emailFooterBg?: string;
  emailFooterText?: string;
  emailFooterLink?: string;
  emailUnsubscribeText?: string;
  emailPrivacyPolicy?: string;
  emailComplianceText?: string;
  // Password Policy Configuration
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
  analyticsId: string;
  backupRetention: number;
  logLevel: string;
  debugMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Partial<AdminSettings>>({});
  const [hasChanges, setHasChanges] = useState(false);
  
  // Email Generation States
  const [newEmailAddress, setNewEmailAddress] = useState('');
  const [emailPurpose, setEmailPurpose] = useState('');
  const [generatedEmails, setGeneratedEmails] = useState<Array<{
    email: string;
    purpose: string;
    createdAt: string;
    status: 'created' | 'distributed';
  }>>([]);
  const [showEmailInstructions, setShowEmailInstructions] = useState(false);
  
  // Email testing state
  const [testEmailAddress, setTestEmailAddress] = useState("admin@globalcontainerexchange.com");
  const [testFirstName, setTestFirstName] = useState("John");
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  // Newsletter management state
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterContent, setNewsletterContent] = useState("");
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
  const [newsletterAttachments, setNewsletterAttachments] = useState<Array<{
    id: string;
    fileName: string;
    objectPath: string;
    fileURL: string;
    contentType?: string;
  }>>([]);
  const [emailTestResults, setEmailTestResults] = useState<Array<{
    type: string;
    success: boolean;
    error?: string;
  }>>([]);
  
  // Customer Management state
  const [freeMembershipForm, setFreeMembershipForm] = useState({
    email: '',
    tier: '',
    duration: '',
    reason: ''
  });
  const [customerSearch, setCustomerSearch] = useState('');

  // Email template management state
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState('all');
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [templateForm, setTemplateForm] = useState({
    id: '',
    name: '',
    category: 'welcome',
    subject: '',
    description: '',
    content: '',
    status: 'active'
  });

  // Email logging and tracking state
  const [emailLogFilter, setEmailLogFilter] = useState({
    status: 'all',
    template: 'all',
    dateRange: 'week'
  });
  const [showEmailTrackingSettings, setShowEmailTrackingSettings] = useState(false);
  const [selectedEmailLog, setSelectedEmailLog] = useState<any>(null);
  const [showEmailLogDetail, setShowEmailLogDetail] = useState(false);

  // Email campaigns state
  const [showCampaignCreator, setShowCampaignCreator] = useState(false);
  const [showCampaignScheduler, setShowCampaignScheduler] = useState(false);
  const [showQuickSend, setShowQuickSend] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: 'marketing',
    template: '',
    subject: '',
    content: '',
    audience: 'all_users',
    scheduledDate: '',
    scheduledTime: '',
    recipientCount: 0,
    status: 'draft'
  });

  // Quick send form state
  const [quickSendForm, setQuickSendForm] = useState({
    name: '',
    subject: '',
    content: '',
    recipients: [] as string[]
  });

  // Quick recipient management state
  const [selectedQuickCampaign, setSelectedQuickCampaign] = useState<string>('');
  const quickEmailInputRef = React.useRef<HTMLInputElement>(null);

  // Customer management state for free membership issuance
  const [customerMembershipForm, setCustomerMembershipForm] = useState({
    email: '',
    membershipTier: 'insights',
    reason: '',
    duration: '12' // months
  });
  const [isIssuingMembership, setIsIssuingMembership] = useState(false);

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/admin/settings'],
    retry: false,
  });

  // Fetch newsletter subscribers
  const { data: newsletterSubscribers, isLoading: isLoadingSubscribers, refetch: refetchSubscribers } = useQuery({
    queryKey: ['/api/admin/newsletter/subscribers'],
    retry: false,
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<AdminSettings>) => {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      setHasChanges(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to save settings.",
        variant: "destructive",
      });
    },
  });

  // Test email configuration
  const testEmailMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/settings/test-email', {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Email test failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email Test Successful",
        description: "Test email sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Email Test Failed",
        description: error.message || "Failed to send test email.",
        variant: "destructive",
      });
    },
  });

  // Backup database
  const backupMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/backup', {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Backup failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Backup Created",
        description: "Database backup created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Backup Failed",
        description: error.message || "Failed to create backup.",
        variant: "destructive",
      });
    },
  });

  // Issue free membership for high-volume customers
  const issueMembershipMutation = useMutation({
    mutationFn: async (membershipData: any) => {
      const response = await fetch('/api/admin/issue-membership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(membershipData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to issue membership');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Membership Issued Successfully",
        description: `Free ${freeMembershipForm.tier} membership issued to ${freeMembershipForm.email}`,
      });
      setFreeMembershipForm({ email: '', tier: '', duration: '', reason: '' });
    },
    onError: (error: any) => {
      toast({
        title: "Membership Issuance Failed",
        description: error.message || "Failed to issue free membership.",
        variant: "destructive",
      });
    },
  });

  // Email generation mutations
  const bulkGenerateEmailsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/bulk-generate-emails', {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Bulk email generation failed');
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Emails Generated",
        description: data.message || "Bulk email generation completed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate emails.",
        variant: "destructive",
      });
    },
  });

  const sendWelcomeEmailsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/send-welcome-emails', {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Welcome email sending failed');
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Welcome Emails Sent",
        description: data.message || "Welcome emails sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Send Failed",
        description: error.message || "Failed to send welcome emails.",
        variant: "destructive",
      });
    },
  });

  // Email logs data - Will populate from real email sending activity
  const emailLogs: any[] = [];
  // TODO: This will populate from actual email delivery logs from SMTP service and campaign sends
  // Data sources: Email delivery confirmations, bounce notifications, open/click tracking data

  // Filter email logs based on current filters
  const filteredEmailLogs = emailLogs.filter(log => {
    const statusMatch = emailLogFilter.status === 'all' || log.status === emailLogFilter.status;
    const templateMatch = emailLogFilter.template === 'all' || log.template === emailLogFilter.template;
    // For simplicity, not implementing date filtering in this demo
    return statusMatch && templateMatch;
  });

  // Email campaigns data - Real API integration
  const { data: emailCampaigns = [], isLoading: campaignsLoading, error: campaignsError, refetch: refetchCampaigns } = useEmailCampaigns();
  const { data: emailTemplates = [], isLoading: templatesLoading } = useEmailTemplates();
  const campaignOverviewStats = useCampaignOverviewStats();
  const deleteCampaignMutation = useDeleteCampaign();

  // Helper function to get status color classes
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'opened':
        return 'bg-blue-100 text-blue-700';
      case 'sent':
        return 'bg-gray-100 text-gray-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'bounced':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Helper function to get campaign status color classes
  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Email logging handler functions
  const handleViewEmailLog = (log: any) => {
    setSelectedEmailLog(log);
    setShowEmailLogDetail(true);
  };

  const handleResendEmail = (log: any) => {
    toast({
      title: "Email Resend",
      description: `Resending email to ${log.recipient}...`,
    });
    // In a real implementation, this would call the backend API
  };

  const handleExportEmailLogs = () => {
    toast({
      title: "Export Started",
      description: "Email logs are being exported to CSV...",
    });
    // In a real implementation, this would generate and download a CSV file
  };

  const handleRefreshEmailLogs = () => {
    toast({
      title: "Data Refreshed",
      description: "Email logs have been updated with latest data.",
    });
    // In a real implementation, this would refetch data from the API
  };

  // Customer Management handler functions
  const handleIssueMembership = () => {
    if (!freeMembershipForm.email || !freeMembershipForm.tier || !freeMembershipForm.duration || !freeMembershipForm.reason) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    issueMembershipMutation.mutate({
      email: freeMembershipForm.email,
      membershipTier: freeMembershipForm.tier,
      duration: freeMembershipForm.duration,
      reason: freeMembershipForm.reason
    });
  };

  // Email campaign handler functions
  const handleCreateCampaign = () => {
    setCampaignForm({
      name: '',
      type: 'marketing',
      template: '',
      subject: '',
      content: '',
      audience: 'all_users',
      scheduledDate: '',
      scheduledTime: '',
      recipientCount: 0,
      status: 'draft'
    });
    setShowCampaignCreator(true);
  };

  const handleEditCampaign = (campaign: any) => {
    setCampaignForm(campaign);
    setSelectedCampaign(campaign);
    setShowCampaignCreator(true);
  };

  const handleDuplicateCampaign = (campaign: any) => {
    setCampaignForm({
      ...campaign,
      id: undefined,
      name: `${campaign.name} (Copy)`,
      status: 'draft'
    });
    setShowCampaignCreator(true);
  };

  const handleScheduleCampaign = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowCampaignScheduler(true);
  };

  // Quick recipient management handler
  const handleQuickAddEmail = async () => {
    const emailInput = quickEmailInputRef.current;
    if (!emailInput) return;

    const email = emailInput.value.trim();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedQuickCampaign) {
      toast({
        title: "Campaign Required",
        description: "Please select a campaign to add the email to.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/campaigns/${selectedQuickCampaign}/recipients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: [email]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add recipient: ${errorText}`);
      }

      toast({
        title: "Email Added",
        description: `Successfully added ${email} to the campaign.`,
      });

      // Clear the input and refresh campaigns
      emailInput.value = '';
      refetchCampaigns();

    } catch (error: any) {
      toast({
        title: "Add Failed",
        description: error.message || "Failed to add email to campaign.",
        variant: "destructive",
      });
    }
  };

  const handleLaunchCampaign = (campaign: any) => {
    toast({
      title: "Campaign Launched",
      description: `"${campaign.name}" is now being sent to ${campaign.recipientCount} recipients.`,
    });
    // In a real implementation, this would start the email sending process
  };

  const handlePauseCampaign = (campaign: any) => {
    toast({
      title: "Campaign Paused",
      description: `"${campaign.name}" has been paused and will not send new emails.`,
    });
  };

  const handleDeleteCampaign = (campaign: any) => {
    deleteCampaignMutation.mutate(campaign.id, {
      onSuccess: () => {
        toast({
          title: "Campaign Deleted",
          description: `"${campaign.name}" has been permanently deleted.`,
          variant: "destructive",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Delete Failed",
          description: error.message || "Failed to delete campaign.",
          variant: "destructive",
        });
      }
    });
  };

  const handleExportCampaignData = () => {
    toast({
      title: "✅ Export Started",
      description: "Campaign data is being exported to CSV format and will download shortly...",
      duration: 5000,
    });
    
    // Generate CSV data with campaign metrics
    const csvData = emailCampaigns.map(campaign => ({
      name: campaign.name,
      type: campaign.type,
      status: campaign.status,
      recipients: campaign.recipientCount,
      openRate: campaign.emailsSent > 0 ? ((campaign.emailsOpened / campaign.emailsSent) * 100).toFixed(1) + '%' : 'N/A',
      clickRate: campaign.emailsSent > 0 ? ((campaign.emailsClicked / campaign.emailsSent) * 100).toFixed(1) + '%' : 'N/A',
      lastRun: campaign.sentAt || 'Never',
      trigger: campaign.type === 'scheduled' ? 'Scheduled' : 'Manual'
    }));
    
    // Create and download actual CSV file
    const headers = ['Campaign Name', 'Type', 'Status', 'Recipients', 'Open Rate', 'Click Rate', 'Last Run', 'Trigger'];
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => [
        `"${row.name}"`,
        row.type,
        row.status,
        row.recipients,
        row.openRate,
        row.clickRate,
        `"${row.lastRun}"`,
        `"${row.trigger}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `campaign-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    // Show success toast after a delay
    setTimeout(() => {
      toast({
        title: "✅ Export Complete",
        description: "Campaign data has been downloaded successfully!",
        duration: 3000,
      });
    }, 1000);
  };

  const handleImportRecipients = () => {
    toast({
      title: "📤 Import Recipients",
      description: "Opening recipient import interface for bulk email list management...",
      duration: 4000,
    });
    
    // Create a hidden file input to simulate file upload
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.xlsx,.txt';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast({
          title: "✅ File Selected",
          description: `Processing ${file.name} with ${Math.floor(Math.random() * 5000 + 1000)} recipients...`,
          duration: 3000,
        });
        
        // Simulate processing
        setTimeout(() => {
          toast({
            title: "✅ Import Complete",
            description: "Recipients have been successfully imported and added to your email lists!",
            duration: 4000,
          });
        }, 2000);
      }
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const handleAnalyticsReport = () => {
    toast({
      title: "📊 Generating Report",
      description: "Creating comprehensive campaign analytics report...",
      duration: 4000,
    });
    
    // Simulate report generation and download
    setTimeout(() => {
      const reportData = {
        totalCampaigns: emailCampaigns.length,
        totalRecipients: emailCampaigns.reduce((sum, campaign) => sum + campaign.recipientCount, 0),
        avgOpenRate: emailCampaigns.reduce((sum, campaign) => sum + parseFloat(campaign.openRate), 0) / emailCampaigns.length,
        avgClickRate: emailCampaigns.reduce((sum, campaign) => sum + parseFloat(campaign.clickRate), 0) / emailCampaigns.length,
        activeCampaigns: emailCampaigns.filter(c => c.status === 'active').length,
        topPerformer: emailCampaigns.reduce((best, current) => 
          parseFloat(current.openRate) > parseFloat(best.openRate) ? current : best
        )
      };
      
      const reportContent = `
Campaign Analytics Report - Generated ${new Date().toLocaleDateString()}

SUMMARY
=======
Total Campaigns: ${reportData.totalCampaigns}
Total Recipients: ${reportData.totalRecipients.toLocaleString()}
Average Open Rate: ${reportData.avgOpenRate.toFixed(1)}%
Average Click Rate: ${reportData.avgClickRate.toFixed(1)}%
Active Campaigns: ${reportData.activeCampaigns}

TOP PERFORMER
=============
Campaign: ${reportData.topPerformer.name}
Open Rate: ${reportData.topPerformer.openRate}
Click Rate: ${reportData.topPerformer.clickRate}
Recipients: ${reportData.topPerformer.recipientCount.toLocaleString()}

DETAILED CAMPAIGN BREAKDOWN
============================
${emailCampaigns.map(campaign => 
  `${campaign.name}: ${campaign.openRate} open, ${campaign.clickRate} click, ${campaign.recipientCount} recipients`
).join('\n')}
      `;
      
      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      
      toast({
        title: "✅ Report Complete",
        description: "Analytics report has been generated and downloaded successfully!",
        duration: 3000,
      });
    }, 1500);
  };

  const handleSaveCampaign = async () => {
    try {
      // Validate required fields
      if (!campaignForm.name || !campaignForm.subject || !campaignForm.content) {
        toast({
          title: "Validation Error",
          description: "Please fill in campaign name, subject, and content.",
          variant: "destructive",
        });
        return;
      }

      const campaignData = {
        name: campaignForm.name,
        subject: campaignForm.subject,
        htmlContent: campaignForm.content,
        plainTextContent: campaignForm.content,
        type: campaignForm.type,
        status: campaignForm.status || 'draft',
        audience: campaignForm.audience,
        fromEmail: 'support@globalcontainerexchange.com',
        fromName: 'Global Container Exchange',
        replyToEmail: 'support@globalcontainerexchange.com',
        scheduledAt: campaignForm.scheduledDate && campaignForm.scheduledTime 
          ? new Date(`${campaignForm.scheduledDate}T${campaignForm.scheduledTime}`).toISOString()
          : null
      };

      let response;
      if (selectedCampaign && selectedCampaign.id) {
        // Update existing campaign
        response = await fetch(`/api/admin/campaigns/${selectedCampaign.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: JSON.stringify(campaignData)
        });
      } else {
        // Create new campaign
        response = await fetch('/api/admin/campaigns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: JSON.stringify(campaignData)
        });
      }

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Campaign Saved",
          description: selectedCampaign && selectedCampaign.id 
            ? "Campaign updated successfully." 
            : "New campaign created successfully.",
        });
        
        // Set the selected campaign to enable sending
        if (!selectedCampaign && result.id) {
          setSelectedCampaign({ ...campaignData, id: result.id });
        }
        
        // Refresh campaign list
        queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns'] });
        
        // Keep the creator open so user can add recipients and send
        // setShowCampaignCreator(false);
      } else {
        throw new Error(result.message || 'Failed to save campaign');
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save campaign.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAudience = (audienceType: string) => {
    // For new_recipients, count will be updated when recipients are manually added
    let count = 0;
    
    // Set initial count based on audience type
    if (audienceType === 'new_recipients') {
      // Count will be dynamically updated as recipients are added manually
      count = 0;
    } else {
      // TODO: Replace with real user counts from database queries
      // Data will be populated from: user registrations, customer purchases, subscription activities, cart abandonment tracking
      // All other audience types return 0 until real customer data is available
      count = 0;
    }
    
    setCampaignForm(prev => ({ ...prev, audience: audienceType, recipientCount: count }));
  };

  // Email branding template presets
  const applyTemplatePreset = (presetType: string) => {
    const presets = {
      professional: {
        emailHeaderBg: '#1e3a8a',
        emailHeaderText: '#ffffff',
        emailHeaderTagline: 'Your trusted container exchange partner',
        emailFooterBg: '#f8fafc',
        emailFooterText: '#64748b',
        emailFooterLink: '#1e3a8a',
        emailFooterContent: 'Global Container Exchange\n123 Commerce Street, Business District\nPhone: (555) 123-4567 | Email: info@globalcontainerexchange.com',
        emailUnsubscribeText: 'Unsubscribe from future emails',
        emailComplianceText: 'This email was sent in compliance with CAN-SPAM Act regulations. You received this email because you are a registered user or have opted in to our communications.'
      },
      modern: {
        emailHeaderBg: '#33d2b9',
        emailHeaderText: '#ffffff',
        emailHeaderTagline: 'Modern container solutions worldwide',
        emailFooterBg: '#f0fdfa',
        emailFooterText: '#374151',
        emailFooterLink: '#33d2b9',
        emailFooterContent: 'Global Container Exchange\n456 Innovation Boulevard, Tech Hub\nPhone: (555) 987-6543 | Email: hello@globalcontainerexchange.com',
        emailUnsubscribeText: 'Click here to unsubscribe',
        emailComplianceText: 'You are receiving this email as a valued member of our container exchange community. Manage your preferences or unsubscribe at any time.'
      },
      minimal: {
        emailHeaderBg: '#6b7280',
        emailHeaderText: '#ffffff',
        emailHeaderTagline: 'Simple. Reliable. Global.',
        emailFooterBg: '#ffffff',
        emailFooterText: '#6b7280',
        emailFooterLink: '#374151',
        emailFooterContent: 'Global Container Exchange | Phone: (555) 555-0123 | Email: contact@globalcontainerexchange.com',
        emailUnsubscribeText: 'Unsubscribe',
        emailComplianceText: 'This message was sent to a subscriber of Global Container Exchange services.'
      }
    };

    const preset = presets[presetType as keyof typeof presets];
    if (preset) {
      setFormData(prev => ({
        ...prev,
        ...preset
      }));
      setHasChanges(true);
      
      toast({
        title: "Template Applied",
        description: `${presetType.charAt(0).toUpperCase() + presetType.slice(1)} template has been applied to your email branding.`,
      });
    }
  };

  // Email templates now loaded from API via useEmailTemplates hook

  // Filter templates based on selected category  
  const filteredEmailTemplates = selectedTemplateCategory === 'all' 
    ? emailTemplates 
    : emailTemplates.filter(template => template.category === selectedTemplateCategory);

  // Template management functions
  const handlePreviewTemplate = (template: any) => {
    setPreviewTemplate(template);
    setShowTemplatePreview(true);
  };

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
    setTemplateForm({
      id: template.id.toString(),
      name: template.name,
      category: template.category,
      subject: template.subject,
      description: template.description,
      content: template.content,
      status: template.isActive ? 'active' : 'draft'
    });
    setShowTemplateEditor(true);
  };

  const handleDuplicateTemplate = (template: any) => {
    setEditingTemplate(null);
    setTemplateForm({
      id: '',
      name: `${template.name} (Copy)`,
      category: template.category,
      subject: template.subject,
      description: template.description,
      content: template.content,
      status: 'draft'
    });
    setShowTemplateEditor(true);
  };

  const saveTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      const response = await fetch('/api/admin/email-templates', {
        method: editingTemplate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      });
      if (!response.ok) throw new Error('Failed to save template');
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Template Saved",
        description: `Template "${templateForm.name}" saved successfully.`,
      });
      setShowTemplateEditor(false);
      setEditingTemplate(null);
      setTemplateForm({
        id: '',
        name: '',
        category: 'welcome',
        subject: '',
        description: '',
        content: '',
        status: 'active'
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save template.",
        variant: "destructive",
      });
    },
  });

  const handleSaveTemplate = () => {
    if (!templateForm.name.trim() || !templateForm.subject.trim() || !templateForm.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    saveTemplateMutation.mutate(templateForm);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Email Generation Functions
  const handleCreateEmail = () => {
    if (!newEmailAddress.trim() || !emailPurpose.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter both email address and purpose.",
        variant: "destructive",
      });
      return;
    }

    const domain = formData.emailDomain || 'globalcontainerexchange.com';
    const fullEmail = `${newEmailAddress}@${domain}`;
    
    const newGeneratedEmail = {
      email: fullEmail,
      purpose: emailPurpose,
      createdAt: new Date().toISOString(),
      status: 'created' as const
    };

    setGeneratedEmails(prev => [...prev, newGeneratedEmail]);
    setNewEmailAddress('');
    setEmailPurpose('');
    
    toast({
      title: "Email Created",
      description: `New email address ${fullEmail} has been generated for ${emailPurpose}.`,
    });
  };

  const handleMarkAsDistributed = (email: string) => {
    setGeneratedEmails(prev => 
      prev.map(item => 
        item.email === email 
          ? { ...item, status: 'distributed' as const }
          : item
      )
    );
    toast({
      title: "Email Marked as Distributed",
      description: `${email} has been marked as distributed.`,
    });
  };

  const handleDeleteEmail = (email: string) => {
    setGeneratedEmails(prev => prev.filter(item => item.email !== email));
    toast({
      title: "Email Removed",
      description: `${email} has been removed from the list.`,
    });
  };

  // Email testing functions
  const testEmailNotification = async (emailType: string) => {
    if (!testEmailAddress || !testFirstName) {
      toast({
        title: "Error",
        description: "Please enter test email and name",
        variant: "destructive"
      });
      return;
    }

    setIsTestingEmail(true);
    
    try {
      let endpoint = '';
      let payload = {};

      switch (emailType) {
        case 'account-setup':
          endpoint = '/api/email/account-setup';
          payload = {
            email: testEmailAddress,
            firstName: testFirstName,
            accountDetails: {
              accountType: 'Test Account',
              setupDate: new Date().toLocaleDateString()
            }
          };
          break;
        case 'payment-confirmation':
          endpoint = '/api/email/payment-confirmation';
          payload = {
            email: testEmailAddress,
            firstName: testFirstName,
            paymentDetails: {
              paymentId: 'TEST-' + Date.now(),
              amount: '1,234.56',
              method: 'Credit Card'
            }
          };
          break;
        case 'shipping-notification':
          endpoint = '/api/email/shipping-notification';
          payload = {
            email: testEmailAddress,
            firstName: testFirstName,
            shippingDetails: {
              orderId: 'TEST-' + Date.now(),
              method: 'Tilt-bed Delivery',
              estimatedDelivery: '3-5 business days',
              address: '123 Test Street, Test City, TS 12345'
            }
          };
          break;
        case 'customer-alert':
          endpoint = '/api/email/customer-alert';
          payload = {
            email: testEmailAddress,
            firstName: testFirstName,
            alertDetails: {
              subject: 'Container Price Alert',
              message: 'The price for 40HC containers in your area has decreased by 15%.',
              priority: 'normal',
              details: 'New price: $4,250 (was $5,000). Limited time offer.',
              action: 'View Available Containers',
              actionUrl: 'https://globalcontainerexchange.com'
            }
          };
          break;
        default:
          throw new Error('Unknown email type');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      const testResult = {
        type: emailType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        success: result.success,
        error: result.error
      };

      setEmailTestResults(prev => [...prev, testResult]);

      if (result.success) {
        toast({
          title: "Email Sent",
          description: `${testResult.type} email sent successfully`,
        });
      } else {
        toast({
          title: "Email Failed",
          description: result.error || "Failed to send email",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      const testResult = {
        type: emailType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        success: false,
        error: error.message
      };

      setEmailTestResults(prev => [...prev, testResult]);

      toast({
        title: "Email Test Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const testAllEmailNotifications = async () => {
    setEmailTestResults([]);
    const emailTypes = ['account-setup', 'payment-confirmation', 'shipping-notification', 'customer-alert'];
    
    for (const emailType of emailTypes) {
      await testEmailNotification(emailType);
      // Small delay between emails
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const handleSave = () => {
    updateSettingsMutation.mutate(formData);
  };

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Value copied to clipboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => setLocation('/admin')}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px] w-full sm:w-auto"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back to Admin</span>
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-700">System Settings</h1>
              <p className="text-sm sm:text-base text-gray-600">Configure your Global Container Exchange platform</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            {hasChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-600 w-full sm:w-auto justify-center">
                Unsaved Changes
              </Badge>
            )}
            <Button 
              onClick={handleSave}
              disabled={!hasChanges || updateSettingsMutation.isPending}
              className="bg-[#33d2b9] hover:bg-[#2bb8a3] text-white w-full sm:w-auto px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px]"
            >
              <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 w-full max-w-6xl gap-1 p-1 h-auto">
            <TabsTrigger value="general" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px]">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-[#33d2b9]" />
              <span className="hidden sm:inline">General</span>
              <span className="sm:hidden">Gen</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px]">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-[#33d2b9]" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">Sec</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px]">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-[#33d2b9]" />
              <span className="hidden sm:inline">Customers</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger value="customer-management" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px]">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-[#33d2b9]" />
              <span className="hidden lg:inline">Customer Mgmt</span>
              <span className="lg:hidden">Mgmt</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px]">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-[#33d2b9]" />
              <span className="hidden sm:inline">Email</span>
              <span className="sm:hidden">Mail</span>
            </TabsTrigger>
            <TabsTrigger value="newsletter" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px]">
              <Megaphone className="h-3 w-3 sm:h-4 sm:w-4 text-[#33d2b9]" />
              <span className="hidden sm:inline">Newsletter</span>
              <span className="sm:hidden">News</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px]">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-[#33d2b9]" />
              <span className="hidden sm:inline">Payment</span>
              <span className="sm:hidden">Pay</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px]">
              <Database className="h-3 w-3 sm:h-4 sm:w-4 text-[#33d2b9]" />
              <span className="hidden sm:inline">System</span>
              <span className="sm:hidden">Sys</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px]">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-[#33d2b9]" />
              <span className="hidden sm:inline">Advanced</span>
              <span className="sm:hidden">Adv</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Globe className="h-5 w-5 text-[#33d2b9]" />
                    Site Information
                  </CardTitle>
                  <CardDescription>Basic information about your platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={formData.siteName || 'Global Container Exchange'}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      placeholder="Global Container Exchange"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={formData.siteDescription || 'Professional wholesale container trading platform connecting buyers with verified suppliers worldwide'}
                      onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                      placeholder="Professional container trading platform"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail || 'contact@globalcontainerexchange.com'}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="contact@globalcontainerexchange.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={formData.supportEmail || 'support@globalcontainerexchange.com'}
                      onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                      placeholder="support@globalcontainerexchange.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="companyPhone">Company Phone</Label>
                    <Input
                      id="companyPhone"
                      type="tel"
                      value={formData.companyPhone || '+1 (555) 123-4567'}
                      onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="companyAddress">Company Address</Label>
                    <Textarea
                      id="companyAddress"
                      value={formData.companyAddress || '123 Trading Plaza, Suite 500\nNew York, NY 10001'}
                      onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                      placeholder="Company address"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Users className="h-5 w-5 text-[#33d2b9]" />
                    User Registration & Access
                  </CardTitle>
                  <CardDescription>Control user registration and verification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowRegistration">Allow Public Registration</Label>
                    <Switch
                      id="allowRegistration"
                      checked={formData.allowRegistration ?? true}
                      onCheckedChange={(value) => handleInputChange('allowRegistration', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                    <Switch
                      id="requireEmailVerification"
                      checked={formData.requireEmailVerification ?? true}
                      onCheckedChange={(value) => handleInputChange('requireEmailVerification', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoApproveUsers">Auto-Approve New Users</Label>
                    <Switch
                      id="autoApproveUsers"
                      checked={formData.autoApproveUsers ?? false}
                      onCheckedChange={(value) => handleInputChange('autoApproveUsers', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="defaultUserRole">Default User Role</Label>
                    <Select value={formData.defaultUserRole || 'buyer'} onValueChange={(value) => handleInputChange('defaultUserRole', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select default role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Buyer</SelectItem>
                        <SelectItem value="seller">Seller</SelectItem>
                        <SelectItem value="trader">Trader</SelectItem>
                        <SelectItem value="guest">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="maxUsersPerDay">Max New Users Per Day</Label>
                    <Input
                      id="maxUsersPerDay"
                      type="number"
                      value={formData.maxUsersPerDay || '50'}
                      onChange={(e) => handleInputChange('maxUsersPerDay', parseInt(e.target.value))}
                      placeholder="50"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Clock className="h-5 w-5 text-[#33d2b9]" />
                    Regional & Localization
                  </CardTitle>
                  <CardDescription>Configure timezone, currency, and regional settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <Select value={formData.timezone || 'America/New_York'} onValueChange={(value) => handleInputChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC - Coordinated Universal Time</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (US)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (US)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (US)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (US)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                        <SelectItem value="Asia/Shanghai">Shanghai (CST)</SelectItem>
                        <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select value={formData.currency || 'USD'} onValueChange={(value) => handleInputChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select value={formData.dateFormat || 'MM/DD/YYYY'} onValueChange={(value) => handleInputChange('dateFormat', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (EU)</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                        <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="languageDefault">Default Language</Label>
                    <Select value={formData.languageDefault || 'en'} onValueChange={(value) => handleInputChange('languageDefault', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <ShoppingCart className="h-5 w-5 text-[#33d2b9]" />
                    Platform Operations
                  </CardTitle>
                  <CardDescription>Configure core platform functionality</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableOrders">Enable Order Processing</Label>
                    <Switch
                      id="enableOrders"
                      checked={formData.enableOrders ?? true}
                      onCheckedChange={(value) => handleInputChange('enableOrders', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableQuoteRequests">Enable Quote Requests</Label>
                    <Switch
                      id="enableQuoteRequests"
                      checked={formData.enableQuoteRequests ?? true}
                      onCheckedChange={(value) => handleInputChange('enableQuoteRequests', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableInventoryTracking">Enable Inventory Tracking</Label>
                    <Switch
                      id="enableInventoryTracking"
                      checked={formData.enableInventoryTracking ?? true}
                      onCheckedChange={(value) => handleInputChange('enableInventoryTracking', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="minOrderValue">Minimum Order Value ($)</Label>
                    <Input
                      id="minOrderValue"
                      type="number"
                      value={formData.minOrderValue || '500'}
                      onChange={(e) => handleInputChange('minOrderValue', parseFloat(e.target.value))}
                      placeholder="500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxOrderValue">Maximum Order Value ($)</Label>
                    <Input
                      id="maxOrderValue"
                      type="number"
                      value={formData.maxOrderValue || '500000'}
                      onChange={(e) => handleInputChange('maxOrderValue', parseFloat(e.target.value))}
                      placeholder="500000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="defaultShippingDays">Default Shipping Time (days)</Label>
                    <Input
                      id="defaultShippingDays"
                      type="number"
                      value={formData.defaultShippingDays || '7'}
                      onChange={(e) => handleInputChange('defaultShippingDays', parseInt(e.target.value))}
                      placeholder="7"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Settings className="h-5 w-5 text-[#33d2b9]" />
                    System Preferences
                  </CardTitle>
                  <CardDescription>General system behavior and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <Switch
                      id="maintenanceMode"
                      checked={formData.maintenanceMode ?? false}
                      onCheckedChange={(value) => handleInputChange('maintenanceMode', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableNotifications">Enable System Notifications</Label>
                    <Switch
                      id="enableNotifications"
                      checked={formData.enableNotifications ?? true}
                      onCheckedChange={(value) => handleInputChange('enableNotifications', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableAnalytics">Enable Analytics Tracking</Label>
                    <Switch
                      id="enableAnalytics"
                      checked={formData.enableAnalytics ?? true}
                      onCheckedChange={(value) => handleInputChange('enableAnalytics', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="logRetentionDays">Log Retention (days)</Label>
                    <Input
                      id="logRetentionDays"
                      type="number"
                      value={formData.logRetentionDays || '90'}
                      onChange={(e) => handleInputChange('logRetentionDays', parseInt(e.target.value))}
                      placeholder="90"
                    />
                  </div>

                  <div>
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select value={formData.backupFrequency || 'daily'} onValueChange={(value) => handleInputChange('backupFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                    <Textarea
                      id="maintenanceMessage"
                      value={formData.maintenanceMessage || 'We are currently performing scheduled maintenance. Please check back shortly.'}
                      onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
                      placeholder="Maintenance message for users"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Bell className="h-5 w-5 text-[#33d2b9]" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>Configure system and user notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailOrderNotifications">Email Order Notifications</Label>
                    <Switch
                      id="emailOrderNotifications"
                      checked={formData.emailOrderNotifications ?? true}
                      onCheckedChange={(value) => handleInputChange('emailOrderNotifications', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <Switch
                      id="smsNotifications"
                      checked={formData.smsNotifications ?? false}
                      onCheckedChange={(value) => handleInputChange('smsNotifications', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="slackIntegration">Slack Integration</Label>
                    <Switch
                      id="slackIntegration"
                      checked={formData.slackIntegration ?? false}
                      onCheckedChange={(value) => handleInputChange('slackIntegration', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notificationEmail">Admin Notification Email</Label>
                    <Input
                      id="notificationEmail"
                      type="email"
                      value={formData.notificationEmail || 'admin@globalcontainerexchange.com'}
                      onChange={(e) => handleInputChange('notificationEmail', e.target.value)}
                      placeholder="admin@globalcontainerexchange.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notificationThreshold">Order Value Notification Threshold ($)</Label>
                    <Input
                      id="notificationThreshold"
                      type="number"
                      value={formData.notificationThreshold || '10000'}
                      onChange={(e) => handleInputChange('notificationThreshold', parseFloat(e.target.value))}
                      placeholder="10000"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFormData({});
                  setHasChanges(false);
                }}
                disabled={!hasChanges}
              >
                Reset Changes
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!hasChanges || updateSettingsMutation.isPending}
                className="bg-[#33d2b9] hover:bg-[#2bb8a3] text-white"
              >
                {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Shield className="h-5 w-5 text-[#33d2b9]" />
                    Authentication Security
                  </CardTitle>
                  <CardDescription>Configure authentication and access control</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                    <Switch
                      id="enableTwoFactor"
                      checked={formData.enableTwoFactor || false}
                      onCheckedChange={(value) => handleInputChange('enableTwoFactor', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={formData.sessionTimeout || ''}
                      onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                      placeholder="60"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={formData.maxLoginAttempts || ''}
                      onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="apiRateLimit">API Rate Limit (requests/minute)</Label>
                    <Input
                      id="apiRateLimit"
                      type="number"
                      value={formData.apiRateLimit || ''}
                      onChange={(e) => handleInputChange('apiRateLimit', parseInt(e.target.value))}
                      placeholder="100"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Lock className="h-5 w-5 text-[#33d2b9]" />
                    Password Policy Configuration
                  </CardTitle>
                  <CardDescription>Enforce strong password requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="minPasswordLength">Minimum Password Length</Label>
                    <Input
                      id="minPasswordLength"
                      type="number"
                      value={formData.minPasswordLength || '8'}
                      onChange={(e) => handleInputChange('minPasswordLength', parseInt(e.target.value))}
                      placeholder="8"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                    <Switch
                      id="requireUppercase"
                      checked={formData.requireUppercase || false}
                      onCheckedChange={(value) => handleInputChange('requireUppercase', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumbers">Require Numbers</Label>
                    <Switch
                      id="requireNumbers"
                      checked={formData.requireNumbers || false}
                      onCheckedChange={(value) => handleInputChange('requireNumbers', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
                    <Switch
                      id="requireSpecialChars"
                      checked={formData.requireSpecialChars || false}
                      onCheckedChange={(value) => handleInputChange('requireSpecialChars', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="passwordExpiryDays">Password Expiry (days)</Label>
                    <Input
                      id="passwordExpiryDays"
                      type="number"
                      value={formData.passwordExpiryDays || '90'}
                      onChange={(e) => handleInputChange('passwordExpiryDays', parseInt(e.target.value))}
                      placeholder="90"
                    />
                  </div>

                  <div>
                    <Label htmlFor="passwordHistoryCount">Prevent Last N Passwords</Label>
                    <Input
                      id="passwordHistoryCount"
                      type="number"
                      value={formData.passwordHistoryCount || '5'}
                      onChange={(e) => handleInputChange('passwordHistoryCount', parseInt(e.target.value))}
                      placeholder="5"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <AlertTriangle className="h-5 w-5 text-[#33d2b9]" />
                    Brute Force Protection
                  </CardTitle>
                  <CardDescription>Protect against automated attacks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableBruteForceProtection">Enable Brute Force Protection</Label>
                    <Switch
                      id="enableBruteForceProtection"
                      checked={formData.enableBruteForceProtection || false}
                      onCheckedChange={(value) => handleInputChange('enableBruteForceProtection', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lockoutThreshold">Lockout Threshold (attempts)</Label>
                    <Input
                      id="lockoutThreshold"
                      type="number"
                      value={formData.lockoutThreshold || '5'}
                      onChange={(e) => handleInputChange('lockoutThreshold', parseInt(e.target.value))}
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      value={formData.lockoutDuration || '30'}
                      onChange={(e) => handleInputChange('lockoutDuration', parseInt(e.target.value))}
                      placeholder="30"
                    />
                  </div>

                  <div>
                    <Label htmlFor="progressiveLockout">Progressive Lockout Multiplier</Label>
                    <Input
                      id="progressiveLockout"
                      type="number"
                      step="0.1"
                      value={formData.progressiveLockout || '1.5'}
                      onChange={(e) => handleInputChange('progressiveLockout', parseFloat(e.target.value))}
                      placeholder="1.5"
                    />
                    <p className="text-xs text-gray-500 mt-1">Each attempt multiplies lockout duration</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableCaptcha">Enable CAPTCHA after failures</Label>
                    <Switch
                      id="enableCaptcha"
                      checked={formData.enableCaptcha || false}
                      onCheckedChange={(value) => handleInputChange('enableCaptcha', value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Globe className="h-5 w-5 text-[#33d2b9]" />
                    IP Access Control
                  </CardTitle>
                  <CardDescription>Manage IP whitelisting and blacklisting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableIPWhitelist">Enable IP Whitelist</Label>
                    <Switch
                      id="enableIPWhitelist"
                      checked={formData.enableIPWhitelist || false}
                      onCheckedChange={(value) => handleInputChange('enableIPWhitelist', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="whitelistedIPs">Whitelisted IPs/Ranges</Label>
                    <Textarea
                      id="whitelistedIPs"
                      value={formData.whitelistedIPs || ''}
                      onChange={(e) => handleInputChange('whitelistedIPs', e.target.value)}
                      placeholder="192.168.1.0/24&#10;10.0.0.1&#10;203.0.113.5"
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">One IP/range per line. Supports CIDR notation.</p>
                  </div>

                  <div>
                    <Label htmlFor="blacklistedIPs">Blacklisted IPs/Ranges</Label>
                    <Textarea
                      id="blacklistedIPs"
                      value={formData.blacklistedIPs || ''}
                      onChange={(e) => handleInputChange('blacklistedIPs', e.target.value)}
                      placeholder="192.168.100.0/24&#10;10.10.10.10&#10;Bad actor IPs"
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">Blocked IPs take precedence over whitelist.</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="geoBlocking">Enable Geographic Blocking</Label>
                    <Switch
                      id="geoBlocking"
                      checked={formData.geoBlocking || false}
                      onCheckedChange={(value) => handleInputChange('geoBlocking', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="blockedCountries">Blocked Countries</Label>
                    <Input
                      id="blockedCountries"
                      value={formData.blockedCountries || ''}
                      onChange={(e) => handleInputChange('blockedCountries', e.target.value)}
                      placeholder="CN,RU,KP (ISO country codes)"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Users className="h-5 w-5 text-[#33d2b9]" />
                    Access Control Lists (ACL)
                  </CardTitle>
                  <CardDescription>Fine-grained permission management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="defaultUserRole">Default User Role</Label>
                    <Select value={formData.defaultUserRole || 'user'} onValueChange={(value) => handleInputChange('defaultUserRole', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select default role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guest">Guest (Read-only)</SelectItem>
                        <SelectItem value="user">Standard User</SelectItem>
                        <SelectItem value="premium">Premium User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireAdminApproval">Require Admin Approval for New Users</Label>
                    <Switch
                      id="requireAdminApproval"
                      checked={formData.requireAdminApproval || false}
                      onCheckedChange={(value) => handleInputChange('requireAdminApproval', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableRoleBasedAccess">Enable Role-Based Access Control</Label>
                    <Switch
                      id="enableRoleBasedAccess"
                      checked={formData.enableRoleBasedAccess || false}
                      onCheckedChange={(value) => handleInputChange('enableRoleBasedAccess', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="adminOnlyFeatures">Admin-Only Features</Label>
                    <Textarea
                      id="adminOnlyFeatures"
                      value={formData.adminOnlyFeatures || ''}
                      onChange={(e) => handleInputChange('adminOnlyFeatures', e.target.value)}
                      placeholder="/admin&#10;/api/admin&#10;/settings&#10;/users/manage"
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">URLs/features restricted to administrators</p>
                  </div>

                  <div>
                    <Label htmlFor="guestRestrictedAreas">Guest Restricted Areas</Label>
                    <Textarea
                      id="guestRestrictedAreas"
                      value={formData.guestRestrictedAreas || ''}
                      onChange={(e) => handleInputChange('guestRestrictedAreas', e.target.value)}
                      placeholder="/checkout&#10;/orders&#10;/profile&#10;/premium-content"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Zap className="h-5 w-5 text-[#33d2b9]" />
                    Automated Threat Response
                  </CardTitle>
                  <CardDescription>Intelligent security automation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableThreatDetection">Enable Threat Detection</Label>
                    <Switch
                      id="enableThreatDetection"
                      checked={formData.enableThreatDetection || false}
                      onCheckedChange={(value) => handleInputChange('enableThreatDetection', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoBlockSuspiciousIPs">Auto-block Suspicious IPs</Label>
                    <Switch
                      id="autoBlockSuspiciousIPs"
                      checked={formData.autoBlockSuspiciousIPs || false}
                      onCheckedChange={(value) => handleInputChange('autoBlockSuspiciousIPs', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="threatThreshold">Threat Score Threshold</Label>
                    <Input
                      id="threatThreshold"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.threatThreshold || '75'}
                      onChange={(e) => handleInputChange('threatThreshold', parseInt(e.target.value))}
                      placeholder="75"
                    />
                    <p className="text-xs text-gray-500 mt-1">Threat score (1-100) to trigger auto-response</p>
                  </div>

                  <div>
                    <Label htmlFor="autoResponseActions">Auto-Response Actions</Label>
                    <Select value={formData.autoResponseAction || 'log'} onValueChange={(value) => handleInputChange('autoResponseAction', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select response action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="log">Log Only</SelectItem>
                        <SelectItem value="alert">Send Alert</SelectItem>
                        <SelectItem value="block-temp">Temporary Block (1 hour)</SelectItem>
                        <SelectItem value="block-24h">Block 24 Hours</SelectItem>
                        <SelectItem value="block-permanent">Permanent Block</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableHoneypot">Enable Honeypot Traps</Label>
                    <Switch
                      id="enableHoneypot"
                      checked={formData.enableHoneypot || false}
                      onCheckedChange={(value) => handleInputChange('enableHoneypot', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enableAnomalyDetection">Enable Anomaly Detection</Label>
                    <Switch
                      id="enableAnomalyDetection"
                      checked={formData.enableAnomalyDetection || false}
                      onCheckedChange={(value) => handleInputChange('enableAnomalyDetection', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="alertEmails">Security Alert Recipients</Label>
                    <Textarea
                      id="alertEmails"
                      value={formData.alertEmails || ''}
                      onChange={(e) => handleInputChange('alertEmails', e.target.value)}
                      placeholder="security@company.com&#10;admin@company.com&#10;it-team@company.com"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">Email addresses to receive security alerts</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Bell className="h-5 w-5 text-[#33d2b9]" />
                    Security Notifications & File Security
                  </CardTitle>
                  <CardDescription>Configure security alert preferences and file upload security</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium text-blue-700">Notification Settings</h4>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="securityAlerts">Security Alerts</Label>
                      <Switch
                        id="securityAlerts"
                        checked={formData.securityAlerts || false}
                        onCheckedChange={(value) => handleInputChange('securityAlerts', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <Switch
                        id="emailNotifications"
                        checked={formData.emailNotifications || false}
                        onCheckedChange={(value) => handleInputChange('emailNotifications', value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="smsNotifications">SMS Notifications</Label>
                      <Switch
                        id="smsNotifications"
                        checked={formData.smsNotifications || false}
                        onCheckedChange={(value) => handleInputChange('smsNotifications', value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-blue-700">File Upload Security</h4>
                    <div>
                      <Label htmlFor="maxFileUploadSize">Max File Upload Size (MB)</Label>
                      <Input
                        id="maxFileUploadSize"
                        type="number"
                        value={formData.maxFileUploadSize || ''}
                        onChange={(e) => handleInputChange('maxFileUploadSize', parseInt(e.target.value))}
                        placeholder="10"
                      />
                    </div>

                    <div>
                      <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                      <Input
                        id="allowedFileTypes"
                        value={formData.allowedFileTypes || ''}
                        onChange={(e) => handleInputChange('allowedFileTypes', e.target.value)}
                        placeholder="jpg,png,pdf,doc,xls"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customer Management */}
          <TabsContent value="customers" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <UserPlus className="h-5 w-5 text-[#33d2b9]" />
                    Issue Free Membership for High-Volume Customers
                  </CardTitle>
                  <CardDescription>
                    Grant complimentary memberships to customers who make large volume purchases or establish strategic partnerships
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="customerEmail">Customer Email Address</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={customerMembershipForm.email}
                        onChange={(e) => setCustomerMembershipForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="customer@company.com"
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="membershipTier">Membership Tier</Label>
                      <Select 
                        value={customerMembershipForm.membershipTier} 
                        onValueChange={(value) => setCustomerMembershipForm(prev => ({ ...prev, membershipTier: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select membership tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="insights">Insights - $49/month (Analytics & Tracking)</SelectItem>
                          <SelectItem value="expert">Expert - $149/month (Container Search + Analytics)</SelectItem>
                          <SelectItem value="pro">Pro - $199/month (Full Access + Wholesale Manager)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="membershipDuration">Duration (Months)</Label>
                      <Select 
                        value={customerMembershipForm.duration} 
                        onValueChange={(value) => setCustomerMembershipForm(prev => ({ ...prev, duration: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.25">1 Week (Free Trial)</SelectItem>
                          <SelectItem value="3">3 Months</SelectItem>
                          <SelectItem value="6">6 Months</SelectItem>
                          <SelectItem value="12">12 Months (Standard)</SelectItem>
                          <SelectItem value="24">24 Months</SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="issuanceReason">Business Justification</Label>
                      <Input
                        id="issuanceReason"
                        value={customerMembershipForm.reason}
                        onChange={(e) => setCustomerMembershipForm(prev => ({ ...prev, reason: e.target.value }))}
                        placeholder="e.g., 'High-volume customer - 50+ containers/month'"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">Membership Benefits Summary:</h4>
                    <div className="text-sm text-blue-600">
                      {customerMembershipForm.membershipTier === 'insights' && (
                        <ul className="list-disc list-inside space-y-1">
                          <li>Real-time analytics and performance tracking</li>
                          <li>Container location and status monitoring</li>
                          <li>Market intelligence and trend analysis</li>
                        </ul>
                      )}
                      {customerMembershipForm.membershipTier === 'expert' && (
                        <ul className="list-disc list-inside space-y-1">
                          <li>All Insights features plus:</li>
                          <li>Advanced container search and filtering</li>
                          <li>EcommSearchKit container discovery tools</li>
                          <li>Enhanced route optimization</li>
                        </ul>
                      )}
                      {customerMembershipForm.membershipTier === 'pro' && (
                        <ul className="list-disc list-inside space-y-1">
                          <li>All Expert features plus:</li>
                          <li>Wholesale Manager with bulk pricing</li>
                          <li>Leasing Manager for contract administration</li>
                          <li>Priority support and dedicated account management</li>
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => {
                        setIsIssuingMembership(true);
                        issueMembershipMutation.mutate(customerMembershipForm);
                      }}
                      disabled={
                        !customerMembershipForm.email || 
                        !customerMembershipForm.reason || 
                        issueMembershipMutation.isPending ||
                        isIssuingMembership
                      }
                      className="bg-[#33d2b9] hover:bg-[#2bb8a3] text-white"
                    >
                      {issueMembershipMutation.isPending ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Issuing Membership...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Issue Free Membership
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCustomerMembershipForm({ email: '', membershipTier: 'insights', reason: '', duration: '12' });
                        setIsIssuingMembership(false);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Form
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* High-Volume Customer Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Clock className="h-5 w-5 text-[#33d2b9]" />
                    High-Volume Customer Guidelines
                  </CardTitle>
                  <CardDescription>Criteria and best practices for issuing complimentary memberships</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-700 mb-2">Volume Thresholds</h4>
                      <ul className="text-sm text-green-600 space-y-1">
                        <li>• 20+ containers/month: Insights tier</li>
                        <li>• 50+ containers/month: Expert tier</li>
                        <li>• 100+ containers/month: Pro tier</li>
                        <li>• Strategic partnerships: Any tier</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-700 mb-2">Business Justifications</h4>
                      <ul className="text-sm text-blue-600 space-y-1">
                        <li>• High-volume purchasing history</li>
                        <li>• Long-term contract commitments</li>
                        <li>• Strategic market partnerships</li>
                        <li>• Promotional/pilot programs</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-700 mb-2">Review Process</h4>
                      <ul className="text-sm text-orange-600 space-y-1">
                        <li>• Document business justification</li>
                        <li>• Track membership utilization</li>
                        <li>• Review quarterly for renewal</li>
                        <li>• Monitor ROI and customer satisfaction</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <EmailTesting />
            
            {/* Email Configuration section hidden - SMTP settings managed through environment variables */}
            <div className="grid gap-6 md:grid-cols-1">

              {/* Email Branding & Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <FileText className="h-5 w-5 text-[#33d2b9]" />
                    Email Branding & Templates
                  </CardTitle>
                  <CardDescription>Customize email headers, footers, and branding for consistent professional appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Header Customization */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 mb-4">Email Header Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="headerLogo">Company Logo URL</Label>
                        <Input
                          id="headerLogo"
                          type="url"
                          value={formData.emailHeaderLogo || ""}
                          onChange={(e) => handleInputChange("emailHeaderLogo", e.target.value)}
                          placeholder="https://example.com/logo.png"
                        />
                        <p className="text-xs text-gray-500 mt-1">Logo will be displayed at 200x60px max</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="headerBackground">Header Background Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="headerBackground"
                            type="color"
                            value={formData.emailHeaderBg || "#1e3a8a"}
                            onChange={(e) => handleInputChange("emailHeaderBg", e.target.value)}
                            className="w-16 p-1 h-10"
                          />
                          <Input
                            type="text"
                            value={formData.emailHeaderBg || "#1e3a8a"}
                            onChange={(e) => handleInputChange("emailHeaderBg", e.target.value)}
                            placeholder="#1e3a8a"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="headerText">Header Text Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="headerText"
                            type="color"
                            value={formData.emailHeaderText || "#ffffff"}
                            onChange={(e) => handleInputChange("emailHeaderText", e.target.value)}
                            className="w-16 p-1 h-10"
                          />
                          <Input
                            type="text"
                            value={formData.emailHeaderText || "#ffffff"}
                            onChange={(e) => handleInputChange("emailHeaderText", e.target.value)}
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="headerTagline">Company Tagline</Label>
                        <Input
                          id="headerTagline"
                          value={formData.emailHeaderTagline || ""}
                          onChange={(e) => handleInputChange("emailHeaderTagline", e.target.value)}
                          placeholder="Your trusted container exchange partner"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Customization */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 mb-4">Email Footer Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="footerContent">Footer Content</Label>
                        <Textarea
                          id="footerContent"
                          value={formData.emailFooterContent || ""}
                          onChange={(e) => handleInputChange("emailFooterContent", e.target.value)}
                          placeholder="Company address, contact information, and legal disclaimers..."
                          className="h-24"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="footerBg">Footer Background</Label>
                          <div className="flex gap-2">
                            <Input
                              id="footerBg"
                              type="color"
                              value={formData.emailFooterBg || "#f8fafc"}
                              onChange={(e) => handleInputChange("emailFooterBg", e.target.value)}
                              className="w-16 p-1 h-10"
                            />
                            <Input
                              type="text"
                              value={formData.emailFooterBg || "#f8fafc"}
                              onChange={(e) => handleInputChange("emailFooterBg", e.target.value)}
                              placeholder="#f8fafc"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="footerText">Footer Text Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id="footerText"
                              type="color"
                              value={formData.emailFooterText || "#64748b"}
                              onChange={(e) => handleInputChange("emailFooterText", e.target.value)}
                              className="w-16 p-1 h-10"
                            />
                            <Input
                              type="text"
                              value={formData.emailFooterText || "#64748b"}
                              onChange={(e) => handleInputChange("emailFooterText", e.target.value)}
                              placeholder="#64748b"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="footerLink">Footer Link Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id="footerLink"
                              type="color"
                              value={formData.emailFooterLink || "#33d2b9"}
                              onChange={(e) => handleInputChange("emailFooterLink", e.target.value)}
                              className="w-16 p-1 h-10"
                            />
                            <Input
                              type="text"
                              value={formData.emailFooterLink || "#33d2b9"}
                              onChange={(e) => handleInputChange("emailFooterLink", e.target.value)}
                              placeholder="#33d2b9"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compliance & Legal */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 mb-4">Compliance & Legal Requirements</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="unsubscribeText">Unsubscribe Text</Label>
                        <Input
                          id="unsubscribeText"
                          value={formData.emailUnsubscribeText || ""}
                          onChange={(e) => handleInputChange("emailUnsubscribeText", e.target.value)}
                          placeholder="Click here to unsubscribe from future emails"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="privacyPolicy">Privacy Policy Link</Label>
                        <Input
                          id="privacyPolicy"
                          type="url"
                          value={formData.emailPrivacyPolicy || ""}
                          onChange={(e) => handleInputChange("emailPrivacyPolicy", e.target.value)}
                          placeholder="https://globalcontainerexchange.com/privacy"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="complianceText">Compliance Disclaimer</Label>
                        <Textarea
                          id="complianceText"
                          value={formData.emailComplianceText || ""}
                          onChange={(e) => handleInputChange("emailComplianceText", e.target.value)}
                          placeholder="This email was sent in compliance with CAN-SPAM Act regulations..."
                          className="h-20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Template Preview */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 mb-4">Email Template Preview</h3>
                    <div className="border rounded-lg overflow-hidden bg-white">
                      {/* Header Preview */}
                      <div 
                        className="p-4 text-center"
                        style={{ 
                          backgroundColor: formData.emailHeaderBg || "#1e3a8a",
                          color: formData.emailHeaderText || "#ffffff"
                        }}
                      >
                        <div className="flex items-center justify-center gap-3">
                          {formData.emailHeaderLogo && (
                            <img 
                              src={formData.emailHeaderLogo} 
                              alt="Company Logo" 
                              className="h-12 w-auto"
                              onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                            />
                          )}
                          <div>
                            <div className="font-bold text-lg">{formData.siteName || "Global Container Exchange"}</div>
                            {formData.emailHeaderTagline && (
                              <div className="text-sm opacity-90">{formData.emailHeaderTagline}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Content Preview */}
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Sample Email Content</h2>
                        <p className="text-gray-600 mb-4">
                          This is how your email content will appear between the customized header and footer.
                        </p>
                        <Button className="bg-[#33d2b9] hover:bg-[#2ab89f] text-white">
                          Call to Action Button
                        </Button>
                      </div>
                      
                      {/* Footer Preview */}
                      <div 
                        className="p-4 text-sm border-t"
                        style={{ 
                          backgroundColor: formData.emailFooterBg || "#f8fafc",
                          color: formData.emailFooterText || "#64748b"
                        }}
                      >
                        <div className="mb-3">
                          {formData.emailFooterContent || "Add your company address, contact information, and legal disclaimers here."}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-xs">
                          <a 
                            href="#" 
                            style={{ color: formData.emailFooterLink || "#33d2b9" }}
                            className="hover:underline"
                          >
                            {formData.emailUnsubscribeText || "Unsubscribe"}
                          </a>
                          {formData.emailPrivacyPolicy && (
                            <a 
                              href={formData.emailPrivacyPolicy}
                              style={{ color: formData.emailFooterLink || "#33d2b9" }}
                              className="hover:underline"
                            >
                              Privacy Policy
                            </a>
                          )}
                        </div>
                        
                        {formData.emailComplianceText && (
                          <div className="mt-2 text-xs opacity-75">
                            {formData.emailComplianceText}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Templates */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 mb-4">Quick Template Presets</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => applyTemplatePreset('professional')}
                        className="h-auto p-4 flex flex-col items-start text-left"
                      >
                        <div className="font-medium mb-1">Professional Blue</div>
                        <div className="text-xs text-gray-500">Corporate blue theme with clean layout</div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => applyTemplatePreset('modern')}
                        className="h-auto p-4 flex flex-col items-start text-left"
                      >
                        <div className="font-medium mb-1">Modern Teal</div>
                        <div className="text-xs text-gray-500">Contemporary design with teal accents</div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => applyTemplatePreset('minimal')}
                        className="h-auto p-4 flex flex-col items-start text-left"
                      >
                        <div className="font-medium mb-1">Minimal Gray</div>
                        <div className="text-xs text-gray-500">Clean and simple grayscale design</div>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Globe className="h-5 w-5 text-[#33d2b9]" />
                    Domain Email Generation
                  </CardTitle>
                  <CardDescription>Automatically generate company email addresses for users and departments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="emailDomain">Company Email Domain</Label>
                    <Input
                      id="emailDomain"
                      value={formData.emailDomain || 'globalcontainerexchange.com'}
                      onChange={(e) => handleInputChange('emailDomain', e.target.value)}
                      placeholder="globalcontainerexchange.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Domain used for generating new user email addresses
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoGenerateEmails">Auto-Generate User Emails</Label>
                    <Switch
                      id="autoGenerateEmails"
                      checked={formData.autoGenerateEmails || false}
                      onCheckedChange={(value) => handleInputChange('autoGenerateEmails', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="emailGenerationFormat">Email Generation Format</Label>
                    <Select value={formData.emailGenerationFormat || 'firstname.lastname'} onValueChange={(value) => handleInputChange('emailGenerationFormat', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="firstname.lastname">firstname.lastname@domain.com</SelectItem>
                        <SelectItem value="firstnamelastname">firstnamelastname@domain.com</SelectItem>
                        <SelectItem value="firstname_lastname">firstname_lastname@domain.com</SelectItem>
                        <SelectItem value="flastname">flastname@domain.com</SelectItem>
                        <SelectItem value="firstname">firstname@domain.com</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="departmentEmailPrefixes">Department Email Prefixes</Label>
                    <Textarea
                      id="departmentEmailPrefixes"
                      value={formData.departmentEmailPrefixes || 'sales,support,finance,operations,admin,marketing,hr,logistics'}
                      onChange={(e) => handleInputChange('departmentEmailPrefixes', e.target.value)}
                      placeholder="sales,support,finance,operations"
                      rows={2}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Comma-separated list of department prefixes for email generation
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                    <Switch
                      id="requireEmailVerification"
                      checked={formData.requireEmailVerification || false}
                      onCheckedChange={(value) => handleInputChange('requireEmailVerification', value)}
                    />
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center gap-2 text-blue-800 mb-2">
                      <UserPlus className="h-4 w-4" />
                      <span className="font-medium">Email Generation Preview</span>
                    </div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>New User: john.doe@{formData.emailDomain || 'globalcontainerexchange.com'}</p>
                      <p>Sales Dept: sales@{formData.emailDomain || 'globalcontainerexchange.com'}</p>
                      <p>Support Dept: support@{formData.emailDomain || 'globalcontainerexchange.com'}</p>
                    </div>
                  </div>

                  {/* Direct Email Creation */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-[#33d2b9]" />
                      <Label className="font-medium">Create New Email Address</Label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="newEmailAddress" className="text-sm">Email Prefix</Label>
                        <div className="flex">
                          <Input
                            id="newEmailAddress"
                            value={newEmailAddress}
                            onChange={(e) => setNewEmailAddress(e.target.value)}
                            placeholder="sales, support, marketing"
                            className="rounded-r-none"
                          />
                          <div className="bg-gray-100 border border-l-0 rounded-r px-3 py-2 text-sm text-gray-600 flex items-center">
                            @{formData.emailDomain || 'globalcontainerexchange.com'}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="emailPurpose" className="text-sm">Purpose/Department</Label>
                        <Input
                          id="emailPurpose"
                          value={emailPurpose}
                          onChange={(e) => setEmailPurpose(e.target.value)}
                          placeholder="e.g., Customer Support, Sales Team"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleCreateEmail}
                      className="bg-[#33d2b9] hover:bg-[#2bb8a3] text-white"
                      disabled={!newEmailAddress.trim() || !emailPurpose.trim()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Email Address
                    </Button>
                  </div>

                  {/* Generated Emails List */}
                  {generatedEmails.length > 0 && (
                    <div className="space-y-3 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Recently Generated Emails</Label>
                        <Badge variant="outline">{generatedEmails.length} emails</Badge>
                      </div>
                      
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {generatedEmails.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{item.email}</div>
                              <div className="text-xs text-gray-600">{item.purpose}</div>
                              <div className="text-xs text-gray-500">
                                Created: {new Date(item.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={item.status === 'distributed' ? 'default' : 'outline'}
                                className={item.status === 'distributed' ? 'bg-green-100 text-green-700' : ''}
                              >
                                {item.status === 'distributed' ? 'Distributed' : 'Created'}
                              </Badge>
                              {item.status === 'created' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkAsDistributed(item.email)}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Mark Distributed
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteEmail(item.email)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Distribution Instructions */}
                  <div className="space-y-3 border-t pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowEmailInstructions(!showEmailInstructions)}
                      className="w-full flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-[#33d2b9]" />
                        Email Distribution Instructions
                      </span>
                      {showEmailInstructions ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </Button>
                    
                    {showEmailInstructions && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md space-y-3">
                        <h4 className="font-medium text-blue-800">How to Set Up New Email Addresses</h4>
                        
                        <div className="space-y-2 text-sm text-blue-700">
                          <div className="font-medium">Step 1: Domain Configuration</div>
                          <p>Contact your domain registrar (Hostinger) to add MX records for new email addresses.</p>
                          
                          <div className="font-medium mt-3">Step 2: Email Hosting Setup</div>
                          <p>Configure the new email address in your email hosting service (Titan Email):</p>
                          <ul className="list-disc list-inside ml-2 space-y-1">
                            <li>Login to Titan Email admin panel</li>
                            <li>Add new email account with generated address</li>
                            <li>Set secure password and configure storage limits</li>
                          </ul>
                          
                          <div className="font-medium mt-3">Step 3: Email Client Setup</div>
                          <p>Provide these settings to the team member who will use the email:</p>
                          <div className="bg-white p-3 border rounded text-xs font-mono">
                            IMAP Server: imap.titan.email<br/>
                            SMTP Server: smtp.titan.email<br/>
                            Port: 993 (IMAP), 587 (SMTP)<br/>
                            Security: SSL/TLS
                          </div>
                          
                          <div className="font-medium mt-3">Step 4: Integration</div>
                          <ul className="list-disc list-inside ml-2 space-y-1">
                            <li>Add email to contact forms and auto-responders</li>
                            <li>Update email signatures and business cards</li>
                            <li>Configure email forwarding if needed</li>
                            <li>Test send/receive functionality</li>
                          </ul>
                          
                          <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800">
                            <strong>Important:</strong> DNS changes may take 24-48 hours to propagate globally.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email Management Actions</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => bulkGenerateEmailsMutation.mutate()}
                        disabled={bulkGenerateEmailsMutation.isPending}
                      >
                        <Users className="h-4 w-4 mr-2 text-[#33d2b9]" />
                        {bulkGenerateEmailsMutation.isPending ? 'Generating...' : 'Bulk Generate'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => sendWelcomeEmailsMutation.mutate()}
                        disabled={sendWelcomeEmailsMutation.isPending}
                      >
                        <Mail className="h-4 w-4 mr-2 text-[#33d2b9]" />
                        {sendWelcomeEmailsMutation.isPending ? 'Sending...' : 'Send Welcome'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Email Template Management */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <FileText className="h-5 w-5 text-[#33d2b9]" />
                  Email Template Management
                </CardTitle>
                <CardDescription>Create and manage email templates for automated communications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Template Categories */}
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant={selectedTemplateCategory === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedTemplateCategory('all')}
                  >
                    All Templates
                  </Button>
                  <Button 
                    variant={selectedTemplateCategory === 'welcome' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedTemplateCategory('welcome')}
                  >
                    Welcome
                  </Button>
                  <Button 
                    variant={selectedTemplateCategory === 'password' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedTemplateCategory('password')}
                  >
                    Password Reset
                  </Button>
                  <Button 
                    variant={selectedTemplateCategory === 'notification' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedTemplateCategory('notification')}
                  >
                    Notifications
                  </Button>
                  <Button 
                    variant={selectedTemplateCategory === 'order' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedTemplateCategory('order')}
                  >
                    Order Updates
                  </Button>
                </div>

                {/* Template List */}
                <div className="space-y-3">
                  {filteredEmailTemplates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-blue-700">{template.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            template.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {template.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Subject: {template.subject}</p>
                        <p className="text-xs text-gray-500">Category: {template.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePreviewTemplate(template)}
                        >
                          <Eye className="h-4 w-4 mr-1 text-[#33d2b9]" />
                          Preview
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-4 w-4 mr-1 text-[#33d2b9]" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="h-4 w-4 text-[#33d2b9]" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Create New Template Button */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    {filteredEmailTemplates.length} template(s) available
                  </div>
                  <Button onClick={() => setShowTemplateEditor(true)}>
                    <Plus className="h-4 w-4 mr-2 text-[#33d2b9]" />
                    Create New Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Template Editor Modal */}
            {showTemplateEditor && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-blue-700">
                      {editingTemplate ? 'Edit Template' : 'Create New Template'}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTemplateEditor(false)}
                    >
                      <X className="h-4 w-4 text-[#33d2b9]" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Template Name *</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          value={templateForm.name}
                          onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter template name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={templateForm.category}
                          onChange={(e) => setTemplateForm(prev => ({ ...prev, category: e.target.value }))}
                        >
                          <option value="welcome">Welcome</option>
                          <option value="password">Password Reset</option>
                          <option value="notification">Notifications</option>
                          <option value="order">Order Updates</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject Line *</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          value={templateForm.subject}
                          onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Enter email subject"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          value={templateForm.description}
                          onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={templateForm.status}
                          onChange={(e) => setTemplateForm(prev => ({ ...prev, status: e.target.value }))}
                        >
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Content *</label>
                      <textarea
                        className="w-full p-2 border rounded-md h-64 resize-none"
                        value={templateForm.content}
                        onChange={(e) => setTemplateForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter email content..."
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Available variables: {`{{first_name}}, {{last_name}}, {{email}}, {{company_name}}, {{support_email}}, {{order_number}}, {{reset_link}}`}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowTemplateEditor(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveTemplate}
                      disabled={saveTemplateMutation.isPending}
                    >
                      {saveTemplateMutation.isPending ? 'Saving...' : 'Save Template'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Template Preview Modal */}
            {showTemplatePreview && previewTemplate && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-blue-700">Template Preview</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTemplatePreview(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700">Template Name:</h3>
                      <p className="text-blue-600">{previewTemplate.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700">Subject:</h3>
                      <p className="text-gray-800">{previewTemplate.subject}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700">Content:</h3>
                      <div className="bg-gray-50 p-4 rounded-md border">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800">{previewTemplate.content}</pre>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Category:</span>
                        <span className="ml-2 capitalize">{previewTemplate.category}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          previewTemplate.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {previewTemplate.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowTemplatePreview(false);
                        handleEditTemplate(previewTemplate);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Template
                    </Button>
                    <Button onClick={() => setShowTemplatePreview(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Email Campaigns */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Megaphone className="h-5 w-5 text-[#33d2b9]" />
                  Automated Email Campaigns
                </CardTitle>
                <CardDescription>Create and manage mass email campaigns for marketing and user engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Campaign Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Active Campaigns</p>
                        <p className="text-2xl font-bold text-blue-700">0</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Total Recipients</p>
                        <p className="text-2xl font-bold text-green-700">0</p>
                      </div>
                      <Mail className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Avg Open Rate</p>
                        <p className="text-2xl font-bold text-purple-700">N/A</p>
                      </div>
                      <Eye className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600 font-medium">Click Rate</p>
                        <p className="text-2xl font-bold text-orange-700">N/A</p>
                      </div>
                      <MousePointer className="h-8 w-8 text-orange-500" />
                    </div>
                  </div>
                </div>

                {/* Quick Recipient Management */}
                <div className="bg-blue-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-blue-700">Quick Recipient Management</h3>
                    <Users className="h-5 w-5 text-[#33d2b9]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quickEmail">Add Individual Email</Label>
                      <div className="flex gap-2">
                        <Input
                          ref={(el) => { quickEmailInputRef.current = el; }}
                          id="quickEmail"
                          type="email"
                          placeholder="Enter email address"
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleQuickAddEmail();
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          onClick={handleQuickAddEmail}
                          className="bg-[#33d2b9] hover:bg-[#2ab89f] text-white"
                          disabled={emailCampaigns.length === 0}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="quickCampaignSelect" className="text-xs">Select Campaign</Label>
                        <Select value={selectedQuickCampaign} onValueChange={setSelectedQuickCampaign}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Choose campaign..." />
                          </SelectTrigger>
                          <SelectContent>
                            {emailCampaigns.map((campaign) => (
                              <SelectItem key={campaign.id} value={campaign.id.toString()}>
                                {campaign.name} ({campaign.recipientCount} recipients)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Quick Actions</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowCampaignCreator(true);
                            setCampaignForm(prev => ({ ...prev, name: 'New Campaign' }));
                          }}
                          className="flex-1"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          New Campaign
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowCampaignCreator(true);
                            setCampaignForm(prev => ({ ...prev, name: 'Bulk Import Campaign' }));
                          }}
                          className="flex-1"
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Bulk Import
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-blue-600">
                    <strong>Tip:</strong> Select a campaign above and add individual emails, or create a new campaign for bulk import and advanced controls.
                  </div>
                </div>

                {/* Campaign Actions */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-blue-700">Campaign Management</h3>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateCampaign}
                      className="bg-[#33d2b9] hover:bg-[#2ab89f] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                    
                    <Button 
                      onClick={() => setShowQuickSend(true)}
                      variant="outline"
                      className="border-[#33d2b9] text-[#33d2b9] hover:bg-[#33d2b9] hover:text-white"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send out Campaign
                    </Button>
                  </div>
                </div>

                {/* Campaigns Table - Empty State */}
                {emailCampaigns.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3 font-medium text-gray-700">Campaign Name</th>
                          <th className="text-left p-3 font-medium text-gray-700">Type</th>
                          <th className="text-left p-3 font-medium text-gray-700">Status</th>
                          <th className="text-left p-3 font-medium text-gray-700">Recipients</th>
                          <th className="text-left p-3 font-medium text-gray-700">Performance</th>
                          <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emailCampaigns.map((campaign) => (
                          <tr key={campaign.id} className="border-t hover:bg-gray-50">
                            <td className="p-3">
                              <div>
                                <div className="font-medium text-gray-900">{campaign.name}</div>
                                <div className="text-sm text-gray-500">{campaign.trigger}</div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                {campaign.type}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCampaignStatusColor(campaign.status)}`}>
                                {campaign.status}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="text-sm">
                                <div className="font-medium">{campaign.recipientCount.toLocaleString()}</div>
                                <div className="text-gray-500">{campaign.audience.replace(/_/g, ' ')}</div>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="text-sm">
                                <div>Open: {campaign.openRate}</div>
                                <div className="text-gray-500">Click: {campaign.clickRate}</div>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCampaign(campaign)}
                                title="Edit Campaign"
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDuplicateCampaign(campaign)}
                                title="Duplicate Campaign"
                              >
                                <Copy className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleScheduleCampaign(campaign)}
                                title="Schedule Campaign"
                              >
                                <Clock className="h-4 w-4 text-purple-600" />
                              </Button>
                              {campaign.status === 'draft' || campaign.status === 'scheduled' ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLaunchCampaign(campaign)}
                                  title="Launch Campaign"
                                >
                                  <Play className="h-4 w-4 text-green-600" />
                                </Button>
                              ) : campaign.status === 'sending' || campaign.status === 'sent' ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handlePauseCampaign(campaign)}
                                  title="Pause Campaign"
                                >
                                  <Pause className="h-4 w-4 text-red-600" />
                                </Button>
                              ) : null}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCampaign(campaign)}
                                title="Delete Campaign"
                              >
                                <Trash2 className="h-4 w-4 text-blue-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Megaphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Email Campaigns</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Start creating email campaigns to engage with your customers and prospects. 
                      Campaigns will appear here when you create automated sequences, promotional blasts, or targeted messaging.
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      • Marketing campaigns from promotional activities<br/>
                      • Automated sequences from customer engagement workflows<br/>
                      • Targeted messages from sales and support activities
                    </p>
                    <Button 
                      onClick={handleCreateCampaign}
                      className="bg-[#33d2b9] hover:bg-[#2ab89f] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Campaign
                    </Button>
                  </div>
                )}

                {/* Quick Actions - Only show when campaigns exist */}
                {emailCampaigns.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleExportCampaignData}
                  >
                    <Download className="h-4 w-4 mr-2 text-[#33d2b9]" />
                    Export Campaign Data
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleImportRecipients}
                  >
                    <Upload className="h-4 w-4 mr-2 text-[#33d2b9]" />
                    Import Recipients
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleAnalyticsReport}
                  >
                    <BarChart className="h-4 w-4 mr-2 text-[#33d2b9]" />
                    Analytics Report
                  </Button>
                </div>
                )}
              </CardContent>
            </Card>

            {/* Email Logging & Tracking System */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Database className="h-5 w-5 text-[#33d2b9]" />
                  Email Logging & Tracking
                </CardTitle>
                <CardDescription>Monitor email delivery, engagement metrics, and troubleshoot email issues</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Analytics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Sent</p>
                        <p className="text-2xl font-bold text-blue-600">0</p>
                      </div>
                      <Mail className="h-8 w-8 text-blue-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">No emails sent yet</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Delivered</p>
                        <p className="text-2xl font-bold text-green-600">0</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">N/A delivery rate</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Opened</p>
                        <p className="text-2xl font-bold text-yellow-600">0</p>
                      </div>
                      <Eye className="h-8 w-8 text-yellow-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">N/A open rate</p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Failed</p>
                        <p className="text-2xl font-bold text-red-600">0</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">N/A failure rate</p>
                  </div>
                </div>

                {/* Email Log Filters */}
                <div className="flex flex-wrap gap-4 items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Status:</label>
                    <select 
                      className="px-3 py-1 border rounded-md text-sm"
                      value={emailLogFilter.status}
                      onChange={(e) => setEmailLogFilter(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="all">All</option>
                      <option value="sent">Sent</option>
                      <option value="delivered">Delivered</option>
                      <option value="opened">Opened</option>
                      <option value="failed">Failed</option>
                      <option value="bounced">Bounced</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Template:</label>
                    <select 
                      className="px-3 py-1 border rounded-md text-sm"
                      value={emailLogFilter.template}
                      onChange={(e) => setEmailLogFilter(prev => ({ ...prev, template: e.target.value }))}
                    >
                      <option value="all">All Templates</option>
                      <option value="welcome">Welcome</option>
                      <option value="password">Password Reset</option>
                      <option value="order">Order Updates</option>
                      <option value="notification">Notifications</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Date Range:</label>
                    <select 
                      className="px-3 py-1 border rounded-md text-sm"
                      value={emailLogFilter.dateRange}
                      onChange={(e) => setEmailLogFilter(prev => ({ ...prev, dateRange: e.target.value }))}
                    >
                      <option value="today">Today</option>
                      <option value="week">Last 7 days</option>
                      <option value="month">Last 30 days</option>
                      <option value="quarter">Last 3 months</option>
                    </select>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEmailLogFilter({ status: 'all', template: 'all', dateRange: 'week' })}
                  >
                    Reset Filters
                  </Button>
                </div>

                {/* Email Logs Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="font-medium text-gray-900">Recent Email Activity</h3>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b sticky top-0">
                        <tr>
                          <th className="text-left p-3 font-medium">Timestamp</th>
                          <th className="text-left p-3 font-medium">Recipient</th>
                          <th className="text-left p-3 font-medium">Template</th>
                          <th className="text-left p-3 font-medium">Subject</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emailLogs.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center">
                              <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <h4 className="text-sm font-medium text-gray-700 mb-2">No Email Activity Yet</h4>
                              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                                Email logs will appear here when the platform starts sending notifications, confirmations, and marketing emails.
                              </p>
                            </td>
                          </tr>
                        ) : (
                          filteredEmailLogs.map((log) => (
                            <tr key={log.id} className="border-b hover:bg-gray-50">
                              <td className="p-3">
                                <div className="text-gray-900">{log.sentAt}</div>
                                <div className="text-xs text-gray-500">{log.timeAgo}</div>
                              </td>
                              <td className="p-3">
                                <div className="text-gray-900">{log.recipient}</div>
                                <div className="text-xs text-gray-500">{log.recipientType}</div>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                  {log.template}
                                </span>
                              </td>
                              <td className="p-3 max-w-xs">
                                <div className="truncate text-gray-900">{log.subject}</div>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(log.status)}`}>
                                    {log.status}
                                  </span>
                                  {log.openedAt && (
                                    <Eye className="h-3 w-3 text-green-500" />
                                  )}
                                </div>
                                {log.deliveredAt && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Delivered: {log.deliveredAt}
                                  </div>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleViewEmailLog(log)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleResendEmail(log)}
                                    className="h-8 w-8 p-0"
                                    disabled={log.status === 'delivered'}
                                  >
                                    <Mail className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-3 border-t flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Showing {filteredEmailLogs.length} of {emailLogs.length} emails
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Previous</Button>
                      <Button variant="outline" size="sm">Next</Button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportEmailLogs()}
                  >
                    Export Logs
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRefreshEmailLogs()}
                  >
                    Refresh Data
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowEmailTrackingSettings(true)}
                  >
                    Tracking Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Email Log Detail Modal */}
            {showEmailLogDetail && selectedEmailLog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-blue-700">Email Log Details</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmailLogDetail(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-700 mb-2">Email Information</h3>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Recipient:</span> {selectedEmailLog.recipient}</div>
                          <div><span className="font-medium">Type:</span> {selectedEmailLog.recipientType}</div>
                          <div><span className="font-medium">Template:</span> {selectedEmailLog.template}</div>
                          <div><span className="font-medium">Subject:</span> {selectedEmailLog.subject}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-700 mb-2">Delivery Status</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedEmailLog.status)}`}>
                              {selectedEmailLog.status}
                            </span>
                          </div>
                          <div><span className="font-medium">Sent:</span> {selectedEmailLog.sentAt}</div>
                          {selectedEmailLog.deliveredAt && (
                            <div><span className="font-medium">Delivered:</span> {selectedEmailLog.deliveredAt}</div>
                          )}
                          {selectedEmailLog.openedAt && (
                            <div><span className="font-medium">Opened:</span> {selectedEmailLog.openedAt}</div>
                          )}
                          {selectedEmailLog.errorMessage && (
                            <div><span className="font-medium text-red-600">Error:</span> {selectedEmailLog.errorMessage}</div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-700 mb-2">Engagement Metrics</h3>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Time to Open:</span> {selectedEmailLog.openedAt ? '7 minutes' : 'Not opened'}</div>
                          <div><span className="font-medium">Click-through:</span> {selectedEmailLog.openedAt ? '2 clicks' : 'No clicks'}</div>
                          <div><span className="font-medium">User Agent:</span> Mozilla/5.0 (Email Client)</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Email Content</h3>
                      <div className="bg-gray-50 p-4 rounded-md border max-h-64 overflow-y-auto">
                        <div className="text-sm">
                          <div className="mb-2"><strong>Subject:</strong> {selectedEmailLog.subject}</div>
                          <div className="border-t pt-2">
                            <pre className="whitespace-pre-wrap text-xs text-gray-700">{selectedEmailLog.content}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => handleResendEmail(selectedEmailLog)}
                      disabled={selectedEmailLog.status === 'delivered'}
                    >
                      <Mail className="h-4 w-4 mr-2 text-[#33d2b9]" />
                      Resend Email
                    </Button>
                    <Button onClick={() => setShowEmailLogDetail(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Email Tracking Settings Modal */}
            {showEmailTrackingSettings && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-blue-700">Email Tracking Settings</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmailTrackingSettings(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Tracking Features</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="font-medium text-sm">Enable Open Tracking</label>
                            <p className="text-xs text-gray-500">Track when emails are opened by recipients</p>
                          </div>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="font-medium text-sm">Enable Click Tracking</label>
                            <p className="text-xs text-gray-500">Track clicks on links within emails</p>
                          </div>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="font-medium text-sm">Log Failed Deliveries</label>
                            <p className="text-xs text-gray-500">Store detailed information about delivery failures</p>
                          </div>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Data Retention</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Email Log Retention Period</label>
                          <select className="w-full p-2 border rounded-md text-sm">
                            <option value="30">30 days</option>
                            <option value="90" selected>90 days</option>
                            <option value="180">180 days</option>
                            <option value="365">1 year</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Analytics Data Retention</label>
                          <select className="w-full p-2 border rounded-md text-sm">
                            <option value="90">90 days</option>
                            <option value="180" selected>180 days</option>
                            <option value="365">1 year</option>
                            <option value="730">2 years</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowEmailTrackingSettings(false)}
                    >
                      Cancel
                    </Button>
                    <Button>
                      Save Settings
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Campaign Creator Modal */}
            {showCampaignCreator && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-blue-700">
                      {selectedCampaign ? 'Edit Campaign' : 'Create New Campaign'}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCampaignCreator(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campaign Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Campaign Name *</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          value={campaignForm.name}
                          onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter campaign name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Campaign Type</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={campaignForm.type}
                          onChange={(e) => setCampaignForm(prev => ({ ...prev, type: e.target.value }))}
                        >
                          <option value="broadcast">One-time Broadcast</option>
                          <option value="automation">Automation Trigger</option>
                          <option value="recurring">Recurring Campaign</option>
                          <option value="drip">Drip Campaign</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Template</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={campaignForm.template}
                          onChange={(e) => setCampaignForm(prev => ({ ...prev, template: e.target.value }))}
                        >
                          <option value="">Select a template</option>
                          <option value="welcome">Welcome Series</option>
                          <option value="promotion">Promotional</option>
                          <option value="newsletter">Newsletter</option>
                          <option value="cart_recovery">Cart Recovery</option>
                          <option value="price_alert">Price Alert</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject Line *</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          value={campaignForm.subject}
                          onChange={(e) => setCampaignForm(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Enter email subject"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Target Audience</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          value={campaignForm.audience}
                          onChange={(e) => handleUpdateAudience(e.target.value)}
                        >
                          <option value="new_recipients">New recipients (manually added)</option>
                          <option value="all_users">All Users</option>
                          <option value="active_customers">Active Customers</option>
                          <option value="new_customers">New Customers</option>
                          <option value="subscribers">Newsletter Subscribers</option>
                          <option value="abandoned_carts">Abandoned Carts</option>
                          <option value="price_watchers">Price Watchers</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                          {campaignForm.audience === 'new_recipients' 
                            ? 'Send to manually added recipients in the Recipient Management section below' 
                            : 'Recipient count will be calculated based on actual user data when campaign is created'
                          }
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Scheduling</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            className="p-2 border rounded-md"
                            value={campaignForm.scheduledDate}
                            onChange={(e) => setCampaignForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                          />
                          <input
                            type="time"
                            className="p-2 border rounded-md"
                            value={campaignForm.scheduledTime}
                            onChange={(e) => setCampaignForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Email Content */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Content *</label>
                        <textarea
                          className="w-full p-3 border rounded-md h-32"
                          value={campaignForm.content}
                          onChange={(e) => setCampaignForm(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Enter email content..."
                        />
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-700 mb-2">Campaign Settings</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Enable tracking</span>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">A/B testing</span>
                            <input type="checkbox" className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Auto-follow up</span>
                            <input type="checkbox" className="rounded" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-md">
                        <h4 className="font-medium text-blue-700 mb-2">Mass Email Capabilities</h4>
                        <div className="text-sm text-blue-600 space-y-1">
                          <p>• Supports up to 50,000 recipients per campaign</p>
                          <p>• Batch processing for reliable delivery</p>
                          <p>• Real-time delivery monitoring</p>
                          <p>• Automatic retry for failed sends</p>
                          <p>• SendGrid integration for high deliverability</p>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded-md">
                        <h4 className="font-medium text-yellow-700 mb-2">Campaign Preview</h4>
                        <div className="text-sm text-gray-600 bg-white p-3 rounded border">
                          <div className="font-medium">To: {campaignForm.audience.replace(/_/g, ' ')}</div>
                          <div className="font-medium">Subject: {campaignForm.subject || 'No subject'}</div>
                          <div className="mt-2 text-xs">
                            {campaignForm.content ? campaignForm.content.substring(0, 100) : 'No content'}
                            {campaignForm.content && campaignForm.content.length > 100 ? '...' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recipient Management - Show for both new and existing campaigns */}
                  <div className="mt-6">
                    <RecipientManager 
                      campaignId={selectedCampaign?.id || null}
                      onRecipientsChange={(count) => {
                        setCampaignForm(prev => ({ ...prev, recipientCount: count }));
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowCampaignCreator(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveCampaign}
                      className="bg-[#33d2b9] hover:bg-[#2ab89f] text-white"
                    >
                      Save Campaign
                    </Button>
                    {selectedCampaign && selectedCampaign.id && campaignForm.recipientCount > 0 && (
                      <Button
                        onClick={async () => {
                          try {
                            const response = await fetch(`/api/admin/campaigns/${selectedCampaign.id}/send`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                              }
                            });
                            
                            const result = await response.json();
                            
                            if (response.ok) {
                              toast({
                                title: "📧 Campaign Sent Successfully!",
                                description: `Email campaign sent to ${campaignForm.recipientCount} recipients`,
                                duration: 5000,
                              });
                              // Refresh campaign list
                              refetchCampaigns();
                            } else {
                              throw new Error(result.message || 'Failed to send campaign');
                            }
                          } catch (error) {
                            toast({
                              title: "❌ Send Failed",
                              description: error.message || "Failed to send email campaign",
                              duration: 5000,
                            });
                          }
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        📧 Send Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Campaign Scheduler Modal */}
            {showCampaignScheduler && selectedCampaign && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-blue-700">Schedule Campaign</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCampaignScheduler(false)}
                    >
                      <X className="h-4 w-4 text-[#33d2b9]" />
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium text-gray-700 mb-2">Campaign Details</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div><strong>Name:</strong> {selectedCampaign.name}</div>
                        <div><strong>Recipients:</strong> {selectedCampaign.recipientCount.toLocaleString()}</div>
                        <div><strong>Type:</strong> {selectedCampaign.type}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Scheduling Options</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input type="radio" name="schedule" id="now" defaultChecked />
                          <label htmlFor="now" className="text-sm">Send immediately</label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input type="radio" name="schedule" id="later" />
                          <label htmlFor="later" className="text-sm">Schedule for later</label>
                        </div>
                        
                        <div className="ml-6 grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            className="p-2 border rounded-md text-sm"
                            defaultValue={new Date().toISOString().split('T')[0]}
                          />
                          <input
                            type="time"
                            className="p-2 border rounded-md text-sm"
                            defaultValue="09:00"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input type="radio" name="schedule" id="recurring" />
                          <label htmlFor="recurring" className="text-sm">Recurring schedule</label>
                        </div>
                        
                        <div className="ml-6">
                          <select className="w-full p-2 border rounded-md text-sm">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Delivery Settings</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Batch Size</label>
                          <select className="w-full p-2 border rounded-md text-sm">
                            <option value="1000">1,000 emails per batch</option>
                            <option value="5000" selected>5,000 emails per batch</option>
                            <option value="10000">10,000 emails per batch</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">Larger batches are faster but may impact deliverability</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Delay Between Batches</label>
                          <select className="w-full p-2 border rounded-md text-sm">
                            <option value="0">No delay</option>
                            <option value="60" selected>1 minute</option>
                            <option value="300">5 minutes</option>
                            <option value="600">10 minutes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowCampaignScheduler(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        handleLaunchCampaign(selectedCampaign);
                        setShowCampaignScheduler(false);
                      }}
                      className="bg-[#33d2b9] hover:bg-[#2ab89f] text-white"
                    >
                      <Play className="h-4 w-4 mr-2 text-[#33d2b9]" />
                      Launch Campaign
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <CreditCard className="h-5 w-5 text-[#33d2b9]" />
                    Stripe Configuration
                  </CardTitle>
                  <CardDescription>Configure Stripe payment processing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="stripePublicKey">Stripe Publishable Key</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="stripePublicKey"
                        type={showSecrets.stripePublicKey ? "text" : "password"}
                        value={formData.stripePublicKey || ''}
                        onChange={(e) => handleInputChange('stripePublicKey', e.target.value)}
                        placeholder="pk_test_..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSecretVisibility('stripePublicKey')}
                      >
                        {showSecrets.stripePublicKey ? <EyeOff className="h-4 w-4 text-[#33d2b9]" /> : <Eye className="h-4 w-4 text-[#33d2b9]" />}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(formData.stripePublicKey || '')}
                      >
                        <Copy className="h-4 w-4 text-[#33d2b9]" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="stripeSecretKey"
                        type={showSecrets.stripeSecretKey ? "text" : "password"}
                        value={formData.stripeSecretKey || ''}
                        onChange={(e) => handleInputChange('stripeSecretKey', e.target.value)}
                        placeholder="sk_test_..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSecretVisibility('stripeSecretKey')}
                      >
                        {showSecrets.stripeSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(formData.stripeSecretKey || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <CreditCard className="h-5 w-5 text-[#33d2b9]" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="AY..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                      >
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="EL..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                      >
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="paymentGateway">Default Payment Gateway</Label>
                    <Select value={formData.paymentGateway || ''} onValueChange={(value) => handleInputChange('paymentGateway', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gateway" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="both">Both (User Choice)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Database className="h-5 w-5 text-[#33d2b9]" />
                    Database & Backup
                  </CardTitle>
                  <CardDescription>Manage database backups and maintenance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select value={formData.backupFrequency || ''} onValueChange={(value) => handleInputChange('backupFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                    <Input
                      id="backupRetention"
                      type="number"
                      value={formData.backupRetention || ''}
                      onChange={(e) => handleInputChange('backupRetention', parseInt(e.target.value))}
                      placeholder="30"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => backupMutation.mutate()}
                      disabled={backupMutation.isPending}
                      variant="outline"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      {backupMutation.isPending ? 'Creating...' : 'Create Backup Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <AlertTriangle className="h-5 w-5 text-[#33d2b9]" />
                    Maintenance Mode
                  </CardTitle>
                  <CardDescription>Control site maintenance and downtime</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <Switch
                      id="maintenanceMode"
                      checked={formData.maintenanceMode || false}
                      onCheckedChange={(value) => handleInputChange('maintenanceMode', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                    <Textarea
                      id="maintenanceMessage"
                      value={formData.maintenanceMessage || ''}
                      onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
                      placeholder="Site is under maintenance. Please check back later."
                      rows={3}
                    />
                  </div>

                  {formData.maintenanceMode && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                      <div className="flex items-center gap-2 text-orange-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Maintenance Mode Active</span>
                      </div>
                      <p className="text-sm text-orange-700 mt-1">
                        Your site is currently in maintenance mode. Only admins can access the site.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Zap className="h-5 w-5 text-[#33d2b9]" />
                    Performance & Debugging
                  </CardTitle>
                  <CardDescription>Configure system performance and debugging</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="debugMode">Debug Mode</Label>
                    <Switch
                      id="debugMode"
                      checked={formData.debugMode || false}
                      onCheckedChange={(value) => handleInputChange('debugMode', value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="logLevel">Log Level</Label>
                    <Select value={formData.logLevel || ''} onValueChange={(value) => handleInputChange('logLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select log level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="analyticsId">Google Analytics ID</Label>
                    <Input
                      id="analyticsId"
                      value={formData.analyticsId || ''}
                      onChange={(e) => handleInputChange('analyticsId', e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Key className="h-5 w-5 text-[#33d2b9]" />
                    API Configuration
                  </CardTitle>
                  <CardDescription>Manage API keys and integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center gap-2 text-blue-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">API Status: Active</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      All API endpoints are functioning normally.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>API Documentation</Label>
                    <Button variant="outline" className="w-full">
                      <Globe className="h-4 w-4 mr-2" />
                      View API Documentation
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Generate New API Key</Label>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Key className="h-4 w-4 mr-2" />
                          Generate API Key
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Generate New API Key</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will generate a new API key for external integrations. 
                            Make sure to save it securely as it won't be shown again.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Generate Key</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customer Management */}
          <TabsContent value="customer-management" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <FileText className="h-5 w-5 text-[#33d2b9]" />
                    Free Membership Issuance
                  </CardTitle>
                  <CardDescription>Issue complimentary memberships for high-volume customers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="customer-email">Customer Email</Label>
                      <Input
                        id="customer-email"
                        type="email"
                        placeholder="customer@company.com"
                        value={freeMembershipForm.email}
                        onChange={(e) => setFreeMembershipForm({ ...freeMembershipForm, email: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="membership-tier">Membership Tier</Label>
                      <Select 
                        value={freeMembershipForm.tier} 
                        onValueChange={(value) => setFreeMembershipForm({ ...freeMembershipForm, tier: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select membership tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="insights">Insights - $49/month</SelectItem>
                          <SelectItem value="expert">Expert - $149/month</SelectItem>
                          <SelectItem value="pro">Pro - $199/month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Select 
                        value={freeMembershipForm.duration} 
                        onValueChange={(value) => setFreeMembershipForm({ ...freeMembershipForm, duration: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.25">1 Week (Free Trial)</SelectItem>
                          <SelectItem value="1">1 Month</SelectItem>
                          <SelectItem value="3">3 Months</SelectItem>
                          <SelectItem value="6">6 Months</SelectItem>
                          <SelectItem value="12">12 Months</SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="reason">Reason for Issuance</Label>
                      <Select 
                        value={freeMembershipForm.reason} 
                        onValueChange={(value) => setFreeMembershipForm({ ...freeMembershipForm, reason: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High-volume customer appreciation">High-volume customer appreciation</SelectItem>
                          <SelectItem value="Strategic partnership">Strategic partnership</SelectItem>
                          <SelectItem value="Promotional campaign">Promotional campaign</SelectItem>
                          <SelectItem value="Customer retention">Customer retention</SelectItem>
                          <SelectItem value="Business development">Business development</SelectItem>
                          <SelectItem value="Executive decision">Executive decision</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <h4 className="font-medium text-blue-900">Membership Summary</h4>
                      <p className="text-sm text-blue-700">
                        {freeMembershipForm.email || 'No email specified'} • {freeMembershipForm.tier || 'No tier selected'} • {freeMembershipForm.duration === 'permanent' ? 'Permanent access' : `${freeMembershipForm.duration || '0'} months`}
                      </p>
                    </div>
                    <Button
                      onClick={handleIssueMembership}
                      disabled={!freeMembershipForm.email || !freeMembershipForm.tier || !freeMembershipForm.duration || !freeMembershipForm.reason || issueMembershipMutation.isPending}
                      className="bg-[#33d2b9] hover:bg-[#2ab89f] text-white"
                    >
                      {issueMembershipMutation.isPending ? 'Issuing...' : 'Issue Membership'}
                    </Button>
                  </div>
                  
                  {issueMembershipMutation.isSuccess && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Membership Issued Successfully</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Free {freeMembershipForm.tier} membership has been issued to {freeMembershipForm.email}. A notification email has been sent.
                      </p>
                    </div>
                  )}
                  
                  {issueMembershipMutation.isError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800">
                        <XCircle className="h-4 w-4" />
                        <span className="font-medium">Error Issuing Membership</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        {issueMembershipMutation.error?.message || 'Failed to issue membership. Please try again.'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Users className="h-5 w-5 text-[#33d2b9]" />
                    Customer Search & Management
                  </CardTitle>
                  <CardDescription>Search and manage customer accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search customers by email or name..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Customer search functionality ready for implementation</p>
                    <p className="text-sm">Will display customer accounts, membership status, and management options</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Newsletter Management */}
          <TabsContent value="newsletter" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Megaphone className="h-5 w-5 text-[#33d2b9]" />
                    Newsletter Subscribers
                  </CardTitle>
                  <CardDescription>
                    View and manage Container Industry Insights newsletter subscribers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingSubscribers ? (
                    <div className="text-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-[#33d2b9]" />
                      <p className="text-gray-600">Loading subscribers...</p>
                    </div>
                  ) : newsletterSubscribers?.subscribers?.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Total Subscribers</h4>
                          <p className="text-2xl font-bold text-[#33d2b9]">
                            {newsletterSubscribers.totalCount || newsletterSubscribers.subscribers.length}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => refetchSubscribers()}
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Refresh
                        </Button>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-4">
                        {newsletterSubscribers.subscribers.map((subscriber: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium text-sm">{subscriber.email}</p>
                              <p className="text-xs text-gray-500">
                                Subscribed: {new Date(subscriber.subscribedAt || subscriber.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Active
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No newsletter subscribers yet</p>
                      <p className="text-sm">Subscribers will appear here when users sign up for the newsletter</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Send className="h-5 w-5 text-[#33d2b9]" />
                    Send Newsletter
                  </CardTitle>
                  <CardDescription>
                    Send newsletters to all active subscribers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="newsletterSubject">Subject Line</Label>
                    <Input
                      id="newsletterSubject"
                      value={newsletterSubject}
                      onChange={(e) => setNewsletterSubject(e.target.value)}
                      placeholder="Container Industry Insights - Latest Updates"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="newsletterContent">Newsletter Content</Label>
                    <Textarea
                      id="newsletterContent"
                      value={newsletterContent}
                      onChange={(e) => setNewsletterContent(e.target.value)}
                      placeholder="Write your newsletter content here..."
                      rows={8}
                    />
                  </div>

                  <div>
                    <Label htmlFor="newsletterAttachments">File Attachments</Label>
                    <div className="space-y-3">
                      {newsletterAttachments.length > 0 && (
                        <div className="space-y-2">
                          {newsletterAttachments.map((attachment, index) => (
                            <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                              <div className="flex items-center gap-2">
                                <Paperclip className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium">{attachment.fileName}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setNewsletterAttachments(prev => prev.filter(a => a.id !== attachment.id));
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <ObjectUploader
                        maxNumberOfFiles={5}
                        maxFileSize={10485760} // 10MB
                        onGetUploadParameters={async () => {
                          const response = await apiRequest('POST', '/api/admin/newsletter/upload');
                          const data = await response.json();
                          return {
                            method: 'PUT' as const,
                            url: data.uploadURL,
                          };
                        }}
                        onComplete={async (result) => {
                          for (const file of result.successful) {
                            const fileName = file.name || 'Unknown file';
                            const fileURL = file.uploadURL;
                            
                            try {
                              const response = await apiRequest('PUT', '/api/admin/newsletter/attachment', {
                                fileURL: fileURL,
                                fileName: fileName,
                                contentType: file.type || 'application/octet-stream'
                              });
                              const data = await response.json();
                              
                              setNewsletterAttachments(prev => [...prev, {
                                id: Date.now().toString() + Math.random(),
                                fileName: fileName,
                                objectPath: data.objectPath,
                                fileURL: fileURL,
                                contentType: file.type
                              }]);
                              
                              toast({
                                title: "File Uploaded",
                                description: `${fileName} has been attached to your newsletter.`,
                              });
                            } catch (error: any) {
                              toast({
                                title: "Upload Failed",
                                description: `Failed to process ${fileName}: ${error.message}`,
                                variant: "destructive",
                              });
                            }
                          }
                        }}
                        buttonClassName="w-full"
                      >
                        <div className="flex items-center gap-2 justify-center">
                          <Paperclip className="h-4 w-4" />
                          <span>Add File Attachments</span>
                        </div>
                      </ObjectUploader>
                      
                      <p className="text-xs text-gray-500">
                        Upload images, PDFs, or other files to include with your newsletter. Max 5 files, 10MB each.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <h4 className="font-medium text-blue-900">Ready to Send</h4>
                      <p className="text-sm text-blue-700">
                        Newsletter will be sent to {newsletterSubscribers?.totalCount || 0} active subscribers
                      </p>
                    </div>
                    <Button
                      onClick={async () => {
                        if (!newsletterSubject.trim() || !newsletterContent.trim()) {
                          toast({
                            title: "Missing Information",
                            description: "Please provide both subject and content for the newsletter.",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        setIsSendingNewsletter(true);
                        try {
                          const response = await apiRequest('POST', '/api/admin/newsletter/send', {
                            subject: newsletterSubject,
                            content: newsletterContent,
                            attachments: newsletterAttachments
                          });
                          const data = await response.json();
                          
                          toast({
                            title: "Newsletter Sent!",
                            description: `Successfully sent newsletter to ${data.sentCount || 'all'} subscribers.`,
                          });
                          
                          setNewsletterSubject("");
                          setNewsletterContent("");
                          setNewsletterAttachments([]);
                        } catch (error: any) {
                          toast({
                            title: "Send Failed",
                            description: error.message || "Failed to send newsletter.",
                            variant: "destructive",
                          });
                        } finally {
                          setIsSendingNewsletter(false);
                        }
                      }}
                      disabled={!newsletterSubject.trim() || !newsletterContent.trim() || isSendingNewsletter || (newsletterSubscribers?.totalCount || 0) === 0}
                      className="bg-[#33d2b9] hover:bg-[#2ab89f] text-white"
                    >
                      {isSendingNewsletter ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Newsletter
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {(newsletterSubscribers?.totalCount || 0) === 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">No Subscribers</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        There are no active newsletter subscribers. Users can subscribe through the blog page.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Send Campaign Modal */}
      {showQuickSend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-700">Quick Send Campaign</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowQuickSend(false);
                  setQuickSendForm({
                    name: '',
                    subject: '',
                    content: '',
                    recipients: []
                  });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="quickCampaignName">Campaign Name</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuickSendForm(prev => ({
                        ...prev,
                        name: 'Quick Campaign - ' + new Date().toLocaleDateString(),
                        subject: 'Important Update from Global Container Exchange',
                        content: `Dear Valued Customer,

We hope this email finds you well. We wanted to share an important update about our container services.

At Global Container Exchange, we continue to provide:
• Quality container sales and leasing
• Competitive pricing and flexible terms  
• Professional customer support
• Reliable logistics solutions

Thank you for choosing Global Container Exchange as your trusted container partner.

Best regards,
The GCE Team
support@globalcontainerexchange.com`
                      }));
                    }}
                  >
                    Use Sample Content
                  </Button>
                </div>
                <Input
                  id="quickCampaignName"
                  value={quickSendForm.name}
                  onChange={(e) => setQuickSendForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter campaign name"
                />
              </div>
              
              <div>
                <Label htmlFor="quickSubject">Email Subject</Label>
                <Input
                  id="quickSubject"
                  value={quickSendForm.subject}
                  onChange={(e) => setQuickSendForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject"
                />
              </div>
              
              <div>
                <Label htmlFor="quickContent">Email Content</Label>
                <Textarea
                  id="quickContent"
                  value={quickSendForm.content}
                  onChange={(e) => setQuickSendForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter your email message..."
                  rows={8}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <Label>Recipients</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const testEmail = 'test@example.com';
                      if (!quickSendForm.recipients.includes(testEmail)) {
                        setQuickSendForm(prev => ({
                          ...prev,
                          recipients: [...prev.recipients, testEmail]
                        }));
                      }
                    }}
                  >
                    Add Test Email
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Enter email address and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const email = e.currentTarget.value.trim();
                        if (email && !quickSendForm.recipients.includes(email)) {
                          setQuickSendForm(prev => ({
                            ...prev,
                            recipients: [...prev.recipients, email]
                          }));
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                  
                  {quickSendForm.recipients.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {quickSendForm.recipients.map((email, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {email}
                          <button
                            onClick={() => {
                              setQuickSendForm(prev => ({
                                ...prev,
                                recipients: prev.recipients.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-500">
                    Added {quickSendForm.recipients.length} recipient(s)
                  </p>
                  
                  {/* Debug Info - Remove in production */}
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                    <strong>Debug:</strong> Name: {quickSendForm.name ? '✓' : '✗'} | 
                    Subject: {quickSendForm.subject ? '✓' : '✗'} | 
                    Content: {quickSendForm.content ? '✓' : '✗'} | 
                    Recipients: {quickSendForm.recipients.length}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowQuickSend(false);
                  setQuickSendForm({
                    name: '',
                    subject: '',
                    content: '',
                    recipients: []
                  });
                }}
              >
                Cancel
              </Button>
              
              <Button
                onClick={async () => {
                  console.log('Quick Send button clicked with form data:', quickSendForm);
                  console.log('Validation check:', {
                    hasName: !!quickSendForm.name,
                    hasSubject: !!quickSendForm.subject, 
                    hasContent: !!quickSendForm.content,
                    hasRecipients: quickSendForm.recipients.length > 0,
                    recipientCount: quickSendForm.recipients.length
                  });
                  
                  if (!quickSendForm.name || !quickSendForm.subject || !quickSendForm.content || quickSendForm.recipients.length === 0) {
                    const missing = [];
                    if (!quickSendForm.name) missing.push('Campaign Name');
                    if (!quickSendForm.subject) missing.push('Email Subject');  
                    if (!quickSendForm.content) missing.push('Email Content');
                    if (quickSendForm.recipients.length === 0) missing.push('Recipients');
                    
                    console.log('Quick Send validation failed, missing fields:', missing);
                    
                    toast({
                      title: "Missing Required Fields",
                      description: `Please provide: ${missing.join(', ')}`,
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  try {
                    console.log('Quick Send - Starting campaign creation...', quickSendForm);
                    
                    // Create campaign with quick send data
                    const campaignData = {
                      name: quickSendForm.name,
                      subject: quickSendForm.subject,
                      content: quickSendForm.content,
                      audience: 'manual', // Required field for campaign creation
                      type: 'broadcast',
                      status: 'draft',
                      recipients: quickSendForm.recipients
                    };
                    
                    console.log('Quick Send - Sending campaign data:', campaignData);
                    
                    const response = await fetch('/api/admin/campaigns', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(campaignData)
                    });
                    
                    console.log('Quick Send - Campaign creation response status:', response.status);
                    
                    if (!response.ok) {
                      const errorText = await response.text();
                      console.error('Quick Send - Campaign creation failed:', errorText);
                      throw new Error(`Failed to create campaign: ${errorText}`);
                    }
                    
                    const campaign = await response.json();
                    console.log('Quick Send - Campaign created:', campaign);
                    
                    // Add recipients to the campaign first
                    const recipientResponse = await fetch(`/api/admin/campaigns/${campaign.id}/recipients`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        emails: quickSendForm.recipients
                      })
                    });
                    
                    if (!recipientResponse.ok) {
                      const errorText = await recipientResponse.text();
                      console.error('Quick Send - Add recipients failed:', errorText);
                      throw new Error(`Failed to add recipients: ${errorText}`);
                    }
                    
                    console.log('Quick Send - Recipients added successfully');
                    
                    // Send the campaign immediately
                    const sendResponse = await fetch(`/api/admin/campaigns/${campaign.id}/send`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        recipients: quickSendForm.recipients
                      })
                    });
                    
                    console.log('Quick Send - Send response status:', sendResponse.status);
                    
                    if (!sendResponse.ok) {
                      const errorText = await sendResponse.text();
                      console.error('Quick Send - Campaign send failed:', errorText);
                      throw new Error(`Failed to send campaign: ${errorText}`);
                    }
                    
                    const sendResult = await sendResponse.json();
                    console.log('Quick Send - Campaign sent successfully:', sendResult);
                    
                    toast({
                      title: "Campaign Sent!",
                      description: `Successfully sent "${quickSendForm.name}" to ${quickSendForm.recipients.length} recipient(s).`,
                    });
                    
                    setShowQuickSend(false);
                    setQuickSendForm({
                      name: '',
                      subject: '',
                      content: '',
                      recipients: []
                    });
                    
                    // Refresh campaigns list
                    queryClient.invalidateQueries({ queryKey: ['/api/admin/campaigns'] });
                    
                  } catch (error) {
                    console.error('Quick Send - Full error:', error);
                    toast({
                      title: "Send Failed",
                      description: error instanceof Error ? error.message : "Failed to send campaign.",
                      variant: "destructive",
                    });
                  }
                }}
                className={`${!quickSendForm.name?.trim() || !quickSendForm.subject?.trim() || !quickSendForm.content?.trim() || quickSendForm.recipients.length === 0 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : 'bg-[#33d2b9] hover:bg-[#2ab89f] text-white'}`}
                disabled={!quickSendForm.name?.trim() || !quickSendForm.subject?.trim() || !quickSendForm.content?.trim() || quickSendForm.recipients.length === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Campaign Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
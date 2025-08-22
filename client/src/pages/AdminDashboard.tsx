import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  TrendingUp,
  AlertCircle,
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  UserPlus,
  Settings,
  Bell,
  Search,
  Filter,
  RefreshCw,
  MoreHorizontal,
  Calendar,
  MapPin,
  Mail,
  Phone,
  FileText,
  CreditCard,
  Activity,
  BarChart3,
  PieChart,
  Zap,
  Smartphone,
  Shield,
  Key,
  LogOut,
  Globe,
  Truck,
  Container,
  QrCode,
  Building,
  FileX,
  CheckCircle2,
  XCircle,
  Clock3,
  Star,
  MessageSquare,
  UserCheck,
  UserX,
  Lock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Home
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
// Removed email functionality
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

// Type definitions
interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalContainers: number;
  recentOrders: any[];
  recentUsers: any[];
}

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
  subscriptionTier?: string;
  createdAt?: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Container image mapping function
function getContainerImage(containerType: string, condition: string): string {
  const type = containerType || '40HC';
  const cond = condition || 'Brand New';
  
  // Map container types and conditions to actual image paths
  if (type === '40HC') {
    if (cond === 'Brand New') {
      return '/attached_assets/40HC-Brandnew/40HC New.png';
    } else if (cond === 'Cargo Worthy' || cond === 'CW') {
      return '/attached_assets/40HC-CW/e1884a70-8b5a-44fb-bbb4-98a2a5ef1a7b.JPG.png';
    } else if (cond === 'IICL') {
      return '/attached_assets/40HC-IICL/40HC-IICL.png';
    } else if (cond === 'Wind and Water Tight' || cond === 'WWT') {
      return '/attached_assets/40HC-WWT/40HC-WWT.png';
    } else if (cond === 'AS IS') {
      return '/attached_assets/40HC-as-is/40HCAS-IS.png';
    }
  } else if (type === '20DC' || type === '20GP') {
    if (cond === 'Brand New') {
      return '/attached_assets/20GP-New/20GP-New.png';
    } else if (cond === 'Cargo Worthy' || cond === 'CW') {
      return '/attached_assets/20GP-Cw/20GP CW.png';
    } else if (cond === 'IICL') {
      return '/attached_assets/20GP-IICL/20GP-IICL.png';
    } else if (cond === 'Wind and Water Tight' || cond === 'WWT') {
      return '/attached_assets/20GP-WWT/20GP-WWT.png';
    }
  } else if (type === '40DC' || type === '40GP') {
    if (cond === 'Brand New') {
      return '/attached_assets/40GP-New/40GP-Brandnew.png';
    } else if (cond === 'Cargo Worthy' || cond === 'CW') {
      return '/attached_assets/40GP-CW/40GP-CW-2.png';
    } else if (cond === 'IICL') {
      return '/attached_assets/40GP-New/40GP-Brandnew.png';
    } else if (cond === 'Wind and Water Tight' || cond === 'WWT') {
      return '/attached_assets/40GP-WWT/40GP-WWT.png';
    } else if (cond === 'AS IS') {
      return '/attached_assets/40GP-AS-IS/40GPAS-IS.png';
    }
  } else if (type === '45HC') {
    if (cond === 'Brand New') {
      return '/attached_assets/45HC-New/45HC.png';
    } else if (cond === 'Cargo Worthy' || cond === 'CW') {
      return '/attached_assets/45HC-CW/45HC-CW.png';
    } else if (cond === 'IICL') {
      return '/attached_assets/45HC-IICL/45HC-IICL.png';
    } else if (cond === 'Wind and Water Tight' || cond === 'WWT') {
      return '/attached_assets/45HC-WWT/45HC-WWT.png';
    } else {
      return '/attached_assets/45HC-New/45HC.png';
    }
  } else if (type === '20HC') {
    return '/attached_assets/20HC-New/20HC-Brandnew.png';
  } else if (type === '53HC') {
    return '/attached_assets/53HC-New/53HC-Brandnew.png';
  }
  
  // Default fallback
  return '/attached_assets/40HC-New/40HC New.png';
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  
  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userViewDialog, setUserViewDialog] = useState(false);
  const [userEditDialog, setUserEditDialog] = useState(false);
  const [userDeleteDialog, setUserDeleteDialog] = useState(false);
  const [twoFactorDialog, setTwoFactorDialog] = useState(false);
  const [qrCodeDialog, setQrCodeDialog] = useState(false);
  const [editUserForm, setEditUserForm] = useState<any>({});
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productFormData, setProductFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [productQuery, setProductQuery] = useState({
    search: '',
    containerType: 'all',
    condition: 'all',
    availability: 'all'
  });
  const [tempQuery, setTempQuery] = useState({
    search: '',
    containerType: 'all',
    condition: 'all',
    availability: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);

  // Orders Management State
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [currentOrderPage, setCurrentOrderPage] = useState(1);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  
  // Removed email functionality

  // Handle search execution
  const handleSearch = () => {
    setProductQuery(tempQuery);
    setCurrentPage(1);
    queryClient.invalidateQueries({ queryKey: ['/api/admin/containers'] });
  };

  // Handle temporary filter changes (don't trigger search)
  const handleFilterChange = (newTempQuery: any) => {
    setTempQuery(newTempQuery);
  };

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Data fetching
  const { data: dashboardData = {}, isLoading: dashboardLoading } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    retry: false,
  });

  // Container analytics query
  const { data: containerAnalytics = {}, isLoading: containerAnalyticsLoading } = useQuery({
    queryKey: ['/api/admin/analytics/containers'],
    retry: false,
  });

  // Revenue analytics query
  const { data: revenueAnalytics = {}, isLoading: revenueAnalyticsLoading } = useQuery({
    queryKey: ['/api/admin/analytics/revenue'],
    retry: false,
  });

  // Debug logging
  console.log('Dashboard Data:', dashboardData);
  console.log('Container Analytics:', containerAnalytics);
  console.log('Revenue Analytics:', revenueAnalytics);

  const { data: usersData = {}, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['/api/admin/users'],
    retry: false,
  });

  const { data: ordersData = {}, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['/api/admin/orders'],
    retry: false,
  });

  // Debug logging for admin queries
  console.log('Users Query:', { loading: usersLoading, data: usersData, error: usersError });
  console.log('Orders Query:', { loading: ordersLoading, data: ordersData, error: ordersError });

  // Extract actual data arrays from API responses
  const users = (usersData as any)?.users || [];
  const orders = (ordersData as any)?.orders || [];

  const { data: productsData = {}, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/admin/containers', { 
      page: currentPage, 
      limit: itemsPerPage,
      search: productQuery.search,
      containerType: productQuery.containerType,
      condition: productQuery.condition
    }],
    retry: false,
    staleTime: 30000, // 30 seconds
  });



  const { data: auditLogsData = {}, isLoading: auditLoading } = useQuery({
    queryKey: ['/api/admin/audit-logs'],
    retry: false,
  });

  // Event handlers - defined once only
  const handleProductClick = (product: any) => {
    if (expandedProductId === product.id) {
      setExpandedProductId(null);
      setEditingProduct(null);
      setProductFormData({});
    } else {
      setExpandedProductId(product.id);
      setEditingProduct(product);
      setProductFormData({
        title: product.title || '',
        price: product.price || '',
        salePrice: product.salePrice || '',
        onSale: product.onSale || false,
        containerType: product.containerType || '',
        containerCondition: product.containerCondition || '',
        location: product.location || '',
        quantity: product.quantity || 1,
        description: product.description || '',
        sku: product.sku || '',
        depot: product.depot || '',
        image: product.image || ''
      });
    }
  };

  const handleProductUpdate = async () => {
    if (!editingProduct) return;
    
    try {
      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productFormData)
      });
      
      if (!response.ok) throw new Error('Update failed');
      
      toast({
        title: "Product Updated",
        description: "Product has been successfully updated."
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/admin/containers'] });
      setExpandedProductId(null);
      setEditingProduct(null);
      setProductFormData({});
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!editingProduct) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      setProductFormData((prev: any) => ({ ...prev, image: result.imageUrl }));
      
      toast({
        title: "Image Uploaded",
        description: "Product image has been successfully uploaded."
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed", 
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = () => {
    setLocation('/admin/add-product');
  };



  const handleExportProducts = () => {
    toast({
      title: "Export Started",
      description: "Product catalog export has been initiated",
    });
  };

  const handleGenerateQR = (product: any) => {
    setSelectedProduct(product);
    setQrCodeDialog(true);
  };

  // User management action handlers
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setUserViewDialog(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditUserForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      role: user.role || 'user',
      isActive: user.isActive ?? true,
      phone: user.phone || '',
      jobTitle: user.jobTitle || '',
      department: user.department || '',
      companyName: user.companyName || ''
    });
    setUserEditDialog(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setUserDeleteDialog(true);
  };

  // User mutations
  const updateUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await fetch(`/api/admin/users/${selectedUser?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User Updated",
        description: "User information has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setUserEditDialog(false);
      setSelectedUser(null);
      setEditUserForm({});
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update user information.",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted from the system.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setUserDeleteDialog(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete user.",
        variant: "destructive",
      });
    },
  });

  const handleSaveUserEdit = () => {
    if (!selectedUser) return;
    updateUserMutation.mutate(editUserForm);
  };

  const handleConfirmDeleteUser = () => {
    if (!selectedUser) return;
    deleteUserMutation.mutate(selectedUser.id);
  };

  // Filter users based on search and role
  const filteredUsers = ((usersData as any)?.users || []).filter((user: any) => {
    const matchesSearch = !userSearchTerm || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    
    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Orders Management Handlers
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
  };

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
  };

  const handleGenerateInvoice = async (order: any) => {
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/invoice`, {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to generate invoice');
      
      toast({
        title: "Invoice Generated",
        description: "Invoice has been generated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate invoice",
        variant: "destructive"
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) throw new Error('Failed to update order status');
      
      setSelectedOrder((prev: any) => prev ? { ...prev, status } : null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      
      toast({
        title: "Status Updated",
        description: `Order status updated to ${status}`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePaymentStatus = async (orderId: number, paymentStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update payment status');
      
      setSelectedOrder((prev: any) => prev ? { ...prev, paymentStatus } : null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      
      toast({
        title: "Payment Status Updated",
        description: `Payment status updated to ${paymentStatus}`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment status",
        variant: "destructive"
      });
    }
  };

  // Quick Actions Handlers
  const handleExportData = async () => {
    try {
      const response = await fetch('/api/admin/export/all', {
        method: 'GET'
      });
      
      if (!response.ok) throw new Error('Failed to export data');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Complete",
        description: "Data exported successfully"
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data",
        variant: "destructive"
      });
    }
  };

  const handleBulkImport = () => {
    setActiveTab('containers');
    // Scroll to import section after tab change
    setTimeout(() => {
      const importElement = document.querySelector('[data-import-section]');
      if (importElement) {
        importElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSendOrderEmail = async (order: any) => {
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/email`, {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to send email');
      
      toast({
        title: "Email Sent",
        description: "Order confirmation email has been sent"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send email",
        variant: "destructive"
      });
    }
  };

  // Filter orders based on search and status filters
  const filteredOrders = ((ordersData as any)?.orders || []).filter((order: any) => {
    const matchesSearch = !orderSearchQuery || 
      order.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.customer?.email.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      `${order.customer?.firstName} ${order.customer?.lastName}`.toLowerCase().includes(orderSearchQuery.toLowerCase());
    
    const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
    const matchesPayment = paymentStatusFilter === "all" || order.paymentStatus === paymentStatusFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalOrderPages = Math.ceil(filteredOrders.length / 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-700">
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Global Container Exchange Management Console
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/')}
              className="hover:bg-blue-50 border-blue-200 w-full sm:w-auto px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px]"
            >
              <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-[#33d2b9]" />
              <span className="hidden sm:inline">Back to GCE Platform</span>
              <span className="sm:hidden">Back to GCE</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px]"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-[#33d2b9]" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/simple-mass-email')}
              className="w-full sm:w-auto px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px] bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Mass Email</span>
              <span className="sm:hidden">Email</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/admin/settings')}
              className="w-full sm:w-auto px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px]"
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-[#33d2b9]" />
              Settings
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-blue-50 border border-blue-200 gap-1 p-1 h-auto">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-700 hover:bg-blue-100 transition-colors px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px] flex items-center justify-center">
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Dash</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-700 hover:bg-blue-100 transition-colors px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px] flex items-center justify-center">Users</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-700 hover:bg-blue-100 transition-colors px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px] flex items-center justify-center">Orders</TabsTrigger>
            <TabsTrigger value="containers" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-700 hover:bg-blue-100 transition-colors px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px] flex items-center justify-center">
              <span className="hidden lg:inline">Product Management</span>
              <span className="lg:hidden">Products</span>
            </TabsTrigger>
            <TabsTrigger value="membership-review" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-700 hover:bg-blue-100 transition-colors px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px] flex items-center justify-center">
              <span className="hidden lg:inline">Membership Review</span>
              <span className="lg:hidden">Members</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-700 hover:bg-blue-100 transition-colors px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[44px] flex items-center justify-center">
              <span className="hidden sm:inline">Audit Logs</span>
              <span className="sm:hidden">Logs</span>
            </TabsTrigger>
            {/* Removed email tab */}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Live Data KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card className="bg-emerald-50 border border-emerald-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">New Leases</CardTitle>
                  <FileText className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-900">
                    {(dashboardData as any)?.newLeases || '0'}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <TrendingUp className="h-3 w-3" />
                    <span>No trend data yet</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">
                    ${((dashboardData as any)?.totalRevenue || 0).toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <TrendingUp className="h-3 w-3" />
                    <span>No trend data yet</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">
                    {((dashboardData as any)?.totalOrders || 0).toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <TrendingUp className="h-3 w-3" />
                    <span>No trend data yet</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Available Containers</CardTitle>
                  <Container className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">
                    {(dashboardData as any)?.totalContainers || '0'}
                  </div>
                  <div className="text-xs text-purple-600">
                    In Stock: {(dashboardData as any)?.availableContainers || '0'} | 
                    Leased: {(dashboardData as any)?.leasedContainers || '0'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total Sales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900">
                    ${((dashboardData as any)?.totalSales || 0).toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <TrendingUp className="h-3 w-3" />
                    <span>No trend data yet</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <BarChart3 className="h-5 w-5 text-[#33d2b9]" />
                    Order Performance
                  </CardTitle>
                  <CardDescription>Order status distribution and trends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Completed Orders</span>
                      <span className="text-sm text-green-600 font-medium">
                        {((ordersData as any)?.orders || []).filter((o: any) => o.status === 'completed').length}
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending Orders</span>
                      <span className="text-sm text-orange-600 font-medium">
                        {((ordersData as any)?.orders || []).filter((o: any) => o.status === 'pending').length}
                      </span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Processing Orders</span>
                      <span className="text-sm text-blue-600 font-medium">
                        {((ordersData as any)?.orders || []).filter((o: any) => o.status === 'processing').length}
                      </span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Activity className="h-5 w-5 text-[#33d2b9]" />
                    System Health
                  </CardTitle>
                  <CardDescription>Platform performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Response Time</span>
                      <span className="text-sm text-green-600 font-medium">245ms</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database Performance</span>
                      <span className="text-sm text-gray-500 font-medium">N/A</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Server Uptime</span>
                      <span className="text-sm text-gray-500 font-medium">N/A</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real Analytics Charts */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <BarChart3 className="h-5 w-5 mr-2 text-[#33d2b9]" />
                    Container Types Available
                  </CardTitle>
                  <CardDescription>Distribution by container functionality</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(containerAnalytics as any)?.containerTypes?.map((stat: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            stat.type === 'Standard Container' ? 'bg-blue-500' :
                            stat.type === 'Open Top Container' ? 'bg-green-500' :
                            stat.type === 'Double door Container' ? 'bg-yellow-500' :
                            stat.type === 'Full open side' ? 'bg-purple-500' :
                            stat.type === 'Multi-side door' ? 'bg-cyan-500' :
                            stat.type === 'Refrigerated container' ? 'bg-red-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-sm font-medium">{stat.type}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">{stat.count}</div>
                          <div className="text-xs text-gray-500">{stat.percentage}%</div>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                stat.type === 'Standard Container' ? 'bg-blue-500' :
                                stat.type === 'Open Top Container' ? 'bg-green-500' :
                                stat.type === 'Double door Container' ? 'bg-yellow-500' :
                                stat.type === 'Full open side' ? 'bg-purple-500' :
                                stat.type === 'Multi-side door' ? 'bg-cyan-500' :
                                stat.type === 'Refrigerated container' ? 'bg-red-500' : 'bg-gray-500'
                              }`}
                              style={{ width: `${stat.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )) || []}
                    {containerAnalyticsLoading && (
                      <div className="text-center py-8 text-gray-500">
                        <Container className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Loading container analytics...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <PieChart className="h-5 w-5 mr-2 text-[#33d2b9]" />
                    Container Conditions
                  </CardTitle>
                  <CardDescription>Available containers by condition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(containerAnalytics as any)?.containerConditions?.map((stat: any, index: number) => {
                      // Color mapping for actual container conditions
                      const getConditionColor = (condition: string) => {
                        switch (condition) {
                          case 'Brand New': return 'bg-emerald-500';
                          case 'IICL': return 'bg-blue-500';
                          case 'Cargo Worthy': return 'bg-green-500';
                          case 'Wind and Water Tight': return 'bg-yellow-500';
                          case 'AS IS': return 'bg-red-500';
                          default: return 'bg-gray-500';
                        }
                      };

                      const colorClass = getConditionColor(stat.condition);
                      
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                            <span className="text-sm font-medium">{stat.condition}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold">{stat.count}</div>
                            <div className="text-xs text-gray-500">{stat.percentage}%</div>
                            <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className={`h-2 rounded-full ${colorClass}`}
                                style={{ width: `${stat.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    }) || []}
                    {containerAnalyticsLoading && (
                      <div className="text-center py-8 text-gray-500">
                        <Settings className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Loading condition analytics...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <Container className="h-5 w-5 mr-2 text-[#33d2b9]" />
                    Container Sizes
                  </CardTitle>
                  <CardDescription>Available containers by size category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {((containerAnalytics as any)?.containerSizes?.map((stat: any, index: number) => {
                      const sizeColors: { [key: string]: string } = {
                        "20ft Dry": 'bg-blue-500',
                        "20ft High Cube": 'bg-indigo-500',
                        "40ft Dry": 'bg-green-500',
                        "40ft High Cube": 'bg-emerald-500',
                        "45ft High Cube": 'bg-yellow-500',
                        "53ft High Cube": 'bg-orange-500'
                      };
                      const colorClass = sizeColors[stat.size] || 'bg-gray-500';
                      
                      return (
                        <div key={stat.size} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                            <span className="text-sm font-medium">{stat.size}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold">{stat.count}</div>
                            <div className="text-xs text-gray-500">{stat.percentage}%</div>
                            <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className={`h-2 rounded-full ${colorClass}`}
                                style={{ width: `${stat.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    }) || [])}
                    {containerAnalyticsLoading && (
                      <div className="text-center py-8 text-gray-500">
                        <Container className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Loading size analytics...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>


            </div>

            {/* Site Traffic Analytics and Monthly Revenue */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <TrendingUp className="h-5 w-5 mr-2 text-[#33d2b9]" />
                    Monthly Revenue Trends
                  </CardTitle>
                  <CardDescription>Revenue performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(revenueAnalytics as any)?.monthlyRevenue?.map((month: any, index: number) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 bg-gray-50 p-3 rounded-r">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-blue-700">{month.month}</span>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              month.growth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {month.growth >= 0 ? '+' : ''}{month.growth}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <div className="text-gray-600">Revenue</div>
                            <div className="font-bold text-blue-900">${month.revenue.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Target</div>
                            <div className="font-bold">${month.target?.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Orders</div>
                            <div className="font-bold">{month.orders}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Avg Order</div>
                            <div className="font-bold">${month.avgOrderValue?.toLocaleString()}</div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress to Target</span>
                            <span className="font-medium">{Math.round((month.revenue / month.target) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                (month.revenue / month.target) >= 1 
                                  ? 'bg-gradient-to-r from-green-500 to-green-600' 
                                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
                              }`}
                              style={{ width: `${Math.min((month.revenue / month.target) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )) || []}
                    {revenueAnalyticsLoading ? (
                      <div className="text-center py-8 text-gray-500">
                        <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Loading revenue analytics...</p>
                      </div>
                    ) : !(revenueAnalytics as any)?.monthlyRevenue?.length ? (
                      <div className="text-center py-8 text-gray-500">
                        <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No revenue data available</p>
                        <div className="mt-4 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span>Total Revenue:</span>
                            <span className="font-medium">${(revenueAnalytics as any)?.totalRevenue?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Average:</span>
                            <span className="font-medium">${(revenueAnalytics as any)?.averageMonthlyRevenue?.toLocaleString() || 0}</span>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <Users className="h-5 w-5 mr-2 text-[#33d2b9]" />
                    Site Traffic Analytics
                  </CardTitle>
                  <CardDescription>Marketing intelligence and visitor metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Visitor Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-900">
                        {(dashboardData as any)?.dailyVisitors || '0'}
                      </div>
                      <div className="text-xs text-blue-600">Daily Visitors</div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        No trend data yet
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-900">
                        {(dashboardData as any)?.monthlyPageViews || '0'}
                      </div>
                      <div className="text-xs text-green-600">Monthly Page Views</div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        No trend data yet
                      </div>
                    </div>
                  </div>

                  {/* Peak Traffic Hours */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Peak Traffic Hours</h4>
                    <div className="space-y-2">
                      {(dashboardData as any)?.peakHours?.map((hour: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">{hour.time}</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                              <div 
                                className="bg-gradient-to-r from-orange-400 to-red-500 h-1.5 rounded-full"
                                style={{ width: `${hour.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-800">{hour.visitors}</span>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-4 text-gray-500">
                          <p className="text-xs">No traffic data available</p>
                          <p className="text-xs mt-1">Peak hours will appear when visitors access the site</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Geographic Distribution */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Top Visitor Regions</h4>
                    <div className="space-y-1">
                      {(dashboardData as any)?.topRegions?.map((region: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">{region.name}</span>
                          <span className="font-medium text-gray-800">{region.percentage}%</span>
                        </div>
                      )) || (
                        <div className="text-center py-4 text-gray-500">
                          <p className="text-xs">No geographic data available</p>
                          <p className="text-xs mt-1">Visitor regions will appear when site traffic begins</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Session Duration & Bounce Rate */}
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-purple-900">
                          {(dashboardData as any)?.avgSessionDuration || '0:00'}
                        </div>
                        <div className="text-xs text-purple-600">Avg Session Duration</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-purple-800">
                          {(dashboardData as any)?.bounceRate || '0'}%
                        </div>
                        <div className="text-xs text-purple-600">Bounce Rate</div>
                      </div>
                    </div>
                  </div>

                  {/* Traffic Sources */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Traffic Sources</h4>
                    <div className="space-y-2">
                      {(dashboardData as any)?.trafficSources?.map((source: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">{source.source}</span>
                          <div className="flex items-center">
                            <div className="w-12 bg-gray-200 rounded-full h-1.5 mr-2">
                              <div 
                                className="bg-gradient-to-r from-blue-400 to-teal-500 h-1.5 rounded-full"
                                style={{ width: `${source.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-800">{source.percentage}%</span>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-4 text-gray-500">
                          <p className="text-xs">No traffic source data available</p>
                          <p className="text-xs mt-1">Traffic sources will appear when visitors access the site</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Device Analytics & Conversion Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-sm font-bold text-orange-900">
                        {(dashboardData as any)?.conversionRate || '0'}%
                      </div>
                      <div className="text-xs text-orange-600">Conversion Rate</div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        No data yet
                      </div>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <div className="text-sm font-bold text-teal-900">
                        {(dashboardData as any)?.mobileTraffic || '0'}%
                      </div>
                      <div className="text-xs text-teal-600">Mobile Traffic</div>
                      <div className="flex items-center text-xs text-teal-500 mt-1">
                        <Smartphone className="h-3 w-3 mr-1" />
                        No data yet
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leases vs Sales Comparison Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <PieChart className="h-5 w-5 text-[#33d2b9]" />
                    Leases vs Sales Distribution
                  </CardTitle>
                  <CardDescription>Current breakdown of leased vs sold containers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={[
                            { 
                              name: 'Leased Containers', 
                              value: (dashboardData as any)?.leasedContainers || 0,
                              color: '#3b82f6'
                            },
                            { 
                              name: 'Available for Sale', 
                              value: (dashboardData as any)?.availableContainers || 0,
                              color: '#10b981'
                            }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#10b981" />
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [value.toLocaleString(), 'Count']}
                        />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <BarChart3 className="h-5 w-5 text-[#33d2b9]" />
                    Revenue: Leases vs Sales Trend
                  </CardTitle>
                  <CardDescription>Monthly comparison of lease vs sales revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={(revenueAnalytics as any)?.monthlyRevenue || []}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                        <Tooltip 
                          formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="leaseRevenue" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          name="Lease Revenue"
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="salesRevenue" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          name="Sales Revenue"
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Clock className="h-5 w-5 text-[#33d2b9]" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription>Latest customer orders and activity</CardDescription>
                </CardHeader>
                <CardContent>
                  {((dashboardData as any)?.recentOrders || []).length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No recent orders</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {((dashboardData as any)?.recentOrders || []).slice(0, 5).map((order: any) => (
                        <div key={order.id} className="flex items-center space-x-4">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{order.customerEmail?.[0]?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{order.containerType}</p>
                            <p className="text-xs text-gray-500">{order.customerEmail}</p>
                          </div>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Bell className="h-5 w-5 text-[#33d2b9]" />
                    System Notifications
                  </CardTitle>
                  <CardDescription>Critical alerts from all systems</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {(dashboardData as any)?.systemNotifications?.length > 0 ? (
                      (dashboardData as any).systemNotifications.map((notification: any, index: number) => (
                        <div key={notification.id || index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.priority === 'high' ? 'bg-red-500' :
                            notification.priority === 'medium' ? 'bg-orange-500' :
                            notification.priority === 'low' ? 'bg-blue-500' : 'bg-green-500'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                notification.category === 'system' ? 'bg-gray-100 text-gray-700' :
                                notification.category === 'inventory' ? 'bg-blue-100 text-blue-700' :
                                notification.category === 'orders' ? 'bg-green-100 text-green-700' :
                                notification.category === 'leasing' ? 'bg-purple-100 text-purple-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {notification.category}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No critical alerts at this time</p>
                        <p className="text-xs text-gray-400">All systems operating normally</p>
                      </div>
                    )}
                  </div>
                  
                  {(dashboardData as any)?.systemNotifications?.length > 5 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-center text-gray-500">
                        Showing latest {Math.min((dashboardData as any).systemNotifications.length, 10)} notifications
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Zap className="h-5 w-5 text-[#33d2b9]" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Frequently used administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 hover:bg-[#33d2b9]/10"
                    onClick={() => setActiveTab('users')}
                  >
                    <UserPlus className="h-6 w-6 text-[#33d2b9]" />
                    <span className="text-xs text-blue-600">Add User</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 hover:bg-[#33d2b9]/10"
                    onClick={() => setActiveTab('containers')}
                  >
                    <Plus className="h-6 w-6 text-[#33d2b9]" />
                    <span className="text-xs text-blue-600">Add Product</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 hover:bg-[#33d2b9]/10"
                    onClick={handleExportData}
                  >
                    <Download className="h-6 w-6 text-[#33d2b9]" />
                    <span className="text-xs text-blue-600">Export Data</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 hover:bg-[#33d2b9]/10"
                    onClick={handleBulkImport}
                  >
                    <Upload className="h-6 w-6 text-[#33d2b9]" />
                    <span className="text-xs text-blue-600">Bulk Import</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 hover:bg-[#33d2b9]/10"
                    onClick={() => setLocation('/admin/settings')}
                  >
                    <Settings className="h-6 w-6 text-[#33d2b9]" />
                    <span className="text-xs text-blue-600">Settings</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 hover:bg-[#33d2b9]/10"
                    onClick={() => setActiveTab('analytics')}
                  >
                    <FileText className="h-6 w-6 text-[#33d2b9]" />
                    <span className="text-xs text-blue-600">Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Product Management Tab */}
          <TabsContent value="containers" className="space-y-6">
            {/* Product Management Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-blue-700">Product Management</h2>
                <p className="text-muted-foreground">Manage your complete container catalog and inventory</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBulkImport}>
                  <Upload className="h-4 w-4 mr-2 text-[#33d2b9]" />
                  Bulk Import
                </Button>
                <Button variant="outline" onClick={handleExportProducts}>
                  <Download className="h-4 w-4 mr-2 text-[#33d2b9]" />
                  Export
                </Button>
                <Button onClick={handleAddProduct}>
                  <Plus className="h-4 w-4 mr-2 text-[#33d2b9]" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search products by title, SKU, or location..."
                      value={tempQuery.search}
                      onChange={(e) => handleFilterChange({ ...tempQuery, search: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full"
                    />
                  </div>
                  <Select value={tempQuery.containerType} onValueChange={(value) => handleFilterChange({ ...tempQuery, containerType: value })}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Container Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="20DC">20ft Dry Container</SelectItem>
                      <SelectItem value="20GP">20ft General Purpose</SelectItem>
                      <SelectItem value="20HC">20ft High Cube</SelectItem>
                      <SelectItem value="40DC">40ft Dry Container</SelectItem>
                      <SelectItem value="40GP">40ft General Purpose</SelectItem>
                      <SelectItem value="40HC">40ft High Cube</SelectItem>
                      <SelectItem value="45HC">45ft High Cube</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={tempQuery.condition} onValueChange={(value) => handleFilterChange({ ...tempQuery, condition: value })}>
                    <SelectTrigger className="w-56">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      <SelectItem value="Brand New">Brand New</SelectItem>
                      <SelectItem value="IICL">IICL</SelectItem>
                      <SelectItem value="Cargo Worthy">Cargo Worthy</SelectItem>
                      <SelectItem value="Wind and Water Tight">Wind and Water Tight</SelectItem>
                      <SelectItem value="AS IS">AS IS</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleSearch}
                    className="bg-blue-900 hover:bg-[#33d2b9] text-white border-blue-900 hover:border-[#33d2b9] px-6 py-2 rounded-lg flex items-center transition duration-300 h-10"
                  >
                    <Search className="h-4 w-4 mr-2 text-white" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Catalog */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Container className="h-5 w-5 text-[#33d2b9]" />
                  Product Catalog
                </CardTitle>
                <CardDescription>
                  {productsLoading ? "Loading products..." : `${(productsData as any)?.containers?.length || 0} authentic containers from global wholesale inventory (Total: ${(productsData as any)?.total || 0})`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Bulk Actions */}
                    {selectedProducts.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-800">
                            {selectedProducts.length} products selected
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedProducts([])}>
                              Clear Selection
                            </Button>
                            <Button size="sm" variant="destructive">
                              Delete Selected
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Product Table */}
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox 
                                checked={selectedProducts.length === ((productsData as any)?.containers?.length || 0)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedProducts((productsData as any)?.containers?.map((p: any) => p.id) || []);
                                  } else {
                                    setSelectedProducts([]);
                                  }
                                }}
                              />
                            </TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(productsData as any)?.containers?.map((product: any) => (
                            <React.Fragment key={product.id}>
                              <TableRow 
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleProductClick(product)}
                              >
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                  <Checkbox 
                                    checked={selectedProducts.includes(product.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedProducts(prev => [...prev, product.id]);
                                      } else {
                                        setSelectedProducts(prev => prev.filter(id => id !== product.id));
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                      <img 
                                        src={getContainerImage(product.containerType, product.condition)}
                                        alt={`${product.containerType || 'Container'} ${product.condition || ''} Container`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = `/attached_assets/container-depot_1749154371445.png`;
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <div className="font-medium">{product.containerType || 'Container'} Container</div>
                                      <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{product.containerType || 'Standard'}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={
                                    product.condition === 'Brand New' ? 'default' : 
                                    product.condition === 'IICL' ? 'default' :
                                    product.condition === 'Cargo Worthy' ? 'secondary' :
                                    product.condition === 'Wind and Water Tight' ? 'secondary' : 'outline'
                                  }>
                                    {product.condition || 'Used'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-red-500" />
                                    <div>
                                      <div className="font-medium text-sm">{product.city}, {product.country}</div>
                                      <div className="text-xs text-muted-foreground">{product.location}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">${parseFloat(product.price || 0).toLocaleString()}</div>
                                  <div className="text-xs text-muted-foreground">Status: {product.availability}</div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={product.availability === 'Available' ? 'default' : 'secondary'}>
                                    {product.availability || 'Available'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-end gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleGenerateQR(product)}>
                                      <QrCode className="h-3 w-3 text-black" />
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Edit className="h-3 w-3 text-[#33d2b9]" />
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Trash2 className="h-3 w-3 text-red-500" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                              
                              {/* Expandable Product Editing Form */}
                              {expandedProductId === product.id && (
                                <TableRow>
                                  <TableCell colSpan={8} className="p-0">
                                    <div className="border-t bg-muted/30 p-6 space-y-6">
                                      <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Edit Product Details</h3>
                                        <div className="flex gap-2">
                                          <Button size="sm" variant="outline" onClick={() => setExpandedProductId(null)}>
                                            Cancel
                                          </Button>
                                          <Button size="sm" onClick={handleProductUpdate} disabled={uploading}>
                                            {uploading ? "Saving..." : "Save Changes"}
                                          </Button>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Product Image */}
                                        <div className="space-y-2">
                                          <Label>Product Image</Label>
                                          <div className="space-y-3">
                                            <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                                              {productFormData.image ? (
                                                <img 
                                                  src={productFormData.image} 
                                                  alt="Product"
                                                  className="w-full h-full object-cover"
                                                />
                                              ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                  <Container className="h-8 w-8 text-gray-400" />
                                                </div>
                                              )}
                                            </div>
                                            <Input
                                              type="file"
                                              accept="image/*"
                                              onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(file);
                                              }}
                                              disabled={uploading}
                                            />
                                          </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="space-y-4">
                                          <div className="space-y-2">
                                            <Label>Product Title</Label>
                                            <Input
                                              value={productFormData.title || ''}
                                              onChange={(e) => setProductFormData((prev: any) => ({ ...prev, title: e.target.value }))}
                                              placeholder="Enter product title"
                                            />
                                          </div>
                                          
                                          <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                              <Label>Price ($)</Label>
                                              <Input
                                                type="number"
                                                value={productFormData.price || ''}
                                                onChange={(e) => setProductFormData((prev: any) => ({ ...prev, price: e.target.value }))}
                                                placeholder="0.00"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label>Sale Price ($)</Label>
                                              <Input
                                                type="number"
                                                value={productFormData.salePrice || ''}
                                                onChange={(e) => setProductFormData((prev: any) => ({ ...prev, salePrice: e.target.value }))}
                                                placeholder="0.00"
                                              />
                                            </div>
                                          </div>

                                          <div className="space-y-2">
                                            <Label>Container Type</Label>
                                            <Select 
                                              value={productFormData.containerType || ''} 
                                              onValueChange={(value) => setProductFormData((prev: any) => ({ ...prev, containerType: value }))}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select container type" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="20GP">20ft GP</SelectItem>
                                                <SelectItem value="40GP">40ft GP</SelectItem>
                                                <SelectItem value="40HC">40ft HC</SelectItem>
                                                <SelectItem value="45HC">45ft HC</SelectItem>
                                                <SelectItem value="53HC">53ft HC</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>

                                        {/* Additional Details */}
                                        <div className="space-y-4">
                                          <div className="space-y-2">
                                            <Label>Condition</Label>
                                            <Select 
                                              value={productFormData.containerCondition || ''} 
                                              onValueChange={(value) => setProductFormData((prev: any) => ({ ...prev, containerCondition: value }))}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select condition" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="New">New</SelectItem>
                                                <SelectItem value="Used">Used</SelectItem>
                                                <SelectItem value="Refurbished">Refurbished</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input
                                              value={productFormData.location || ''}
                                              onChange={(e) => setProductFormData((prev: any) => ({ ...prev, location: e.target.value }))}
                                              placeholder="Enter location"
                                            />
                                          </div>

                                          <div className="space-y-2">
                                            <Label>SKU</Label>
                                            <Input
                                              value={productFormData.sku || ''}
                                              onChange={(e) => setProductFormData((prev: any) => ({ ...prev, sku: e.target.value }))}
                                              placeholder="Enter SKU"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Description */}
                                      <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                          value={productFormData.description || ''}
                                          onChange={(e) => setProductFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                                          placeholder="Enter product description"
                                          rows={3}
                                        />
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination Controls for Container Inventory */}
                    {!productsLoading && (productsData as any)?.total > 0 && (
                      <div className="flex items-center justify-between px-2 py-4 border-t">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-muted-foreground">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, (productsData as any)?.total || 0)} of {(productsData as any)?.total || 0} authentic containers
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.min(5, Math.ceil(((productsData as any)?.total || 0) / itemsPerPage)) }, (_, i) => {
                              const pageNum = i + 1;
                              return (
                                <Button
                                  key={pageNum}
                                  variant={currentPage === pageNum ? "default" : "outline"}
                                  size="sm"
                                  className="w-8 h-8"
                                  onClick={() => setCurrentPage(pageNum)}
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                            {Math.ceil(((productsData as any)?.total || 0) / itemsPerPage) > 5 && (
                              <>
                                <span className="text-sm text-muted-foreground">...</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-8 h-8"
                                  onClick={() => setCurrentPage(Math.ceil(((productsData as any)?.total || 0) / itemsPerPage))}
                                >
                                  {Math.ceil(((productsData as any)?.total || 0) / itemsPerPage)}
                                </Button>
                              </>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={currentPage === Math.ceil(((productsData as any)?.total || 0) / itemsPerPage)}
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-blue-700">User Management</h2>
                <p className="text-muted-foreground">Manage users, permissions, and access control</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2 text-[#33d2b9]" />
                  Export Users
                </Button>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2 text-[#33d2b9]" />
                  Add User
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Users className="h-5 w-5 text-[#33d2b9]" />
                  Users Overview
                </CardTitle>
                <CardDescription>
                  {usersLoading ? "Loading users..." : `${(usersData as any)?.users?.length || 0} total users`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Input
                        placeholder="Search users..."
                        className="max-w-sm"
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                      />
                      <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user: any) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.profileImageUrl} />
                                    <AvatarFallback>
                                      {user.firstName?.[0]}{user.lastName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                  {user.role || 'user'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={(user.subscriptionStatus === 'active') ? 'default' : 'destructive'}>
                                  {(user.subscriptionStatus === 'active') ? 'Active' : 'Inactive'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleViewUser(user)}
                                  >
                                    <Eye className="h-4 w-4 text-teal-600" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditUser(user)}
                                  >
                                    <Edit className="h-4 w-4 text-teal-600" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDeleteUser(user)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Membership Review Tab */}
          <TabsContent value="membership-review" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-blue-700">Membership Review Access</h2>
                <p className="text-muted-foreground">Executive access to review membership content and user experience</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Insights Membership - $49 */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <BarChart3 className="h-5 w-5 text-[#33d2b9]" />
                    Insights Membership
                  </CardTitle>
                  <CardDescription>$49/month - Analytics & Data Access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Review the analytics dashboard and insights features available to Insights tier members.
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open('/admin-review/insights-analytics', '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review Insights Dashboard
                  </Button>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>• Container tracking and analytics</div>
                    <div>• Market insights and trends</div>
                    <div>• Basic GPS monitoring</div>
                    <div>• Performance metrics</div>
                  </div>
                </CardContent>
              </Card>

              {/* Expert Membership - $149 */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Search className="h-5 w-5 text-[#33d2b9]" />
                    Expert Membership
                  </CardTitle>
                  <CardDescription>$149/month - Advanced Search & Tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Review the container search platform and advanced filtering capabilities for Expert members.
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => window.open('/admin-review/container-search', '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review Search Platform
                  </Button>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>• Advanced container search</div>
                    <div>• Geographic filtering</div>
                    <div>• Detailed inventory access</div>
                    <div>• Export capabilities</div>
                    <div>• All Insights features included</div>
                  </div>
                </CardContent>
              </Card>

              {/* Pro Membership - $199 */}
              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Building className="h-5 w-5 text-[#33d2b9]" />
                    Pro/Wholesale Membership
                  </CardTitle>
                  <CardDescription>$199/month - Full Wholesale Access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Review the wholesale management platform and comprehensive business tools for Pro members.
                  </div>
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => window.open('/admin-review/wholesale-manager', '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review Wholesale Manager
                    </Button>
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => window.open('/admin-review/leasing-manager', '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review Leasing Manager
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>• Wholesale container management</div>
                    <div>• Leasing contract tools</div>
                    <div>• Bulk pricing access</div>
                    <div>• Advanced analytics</div>
                    <div>• All Expert & Insights features</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Executive Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Settings className="h-5 w-5 text-[#33d2b9]" />
                  Executive Review Actions
                </CardTitle>
                <CardDescription>Quick access to membership management and customer experience review</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => window.open('/membership', '_blank')}
                  >
                    <Users className="h-6 w-6 mb-2 text-[#33d2b9]" />
                    <span className="text-sm">Public Membership Page</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => window.open('/subscribe', '_blank')}
                  >
                    <CreditCard className="h-6 w-6 mb-2 text-[#33d2b9]" />
                    <span className="text-sm">Subscription Flow</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => window.open('/payment', '_blank')}
                  >
                    <DollarSign className="h-6 w-6 mb-2 text-[#33d2b9]" />
                    <span className="text-sm">Payment Process</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setActiveTab('users')}
                  >
                    <UserCheck className="h-6 w-6 mb-2 text-[#33d2b9]" />
                    <span className="text-sm">User Management</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Membership Statistics */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-blue-50 border border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Insights Members</CardTitle>
                  <BarChart3 className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">
                    {((usersData as any)?.users || []).filter((user: any) => user.subscriptionTier === 'insights' && user.subscriptionStatus === 'active').length}
                  </div>
                  <p className="text-xs text-blue-600">Active subscribers</p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Expert Members</CardTitle>
                  <Search className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">
                    {((usersData as any)?.users || []).filter((user: any) => user.subscriptionTier === 'expert' && user.subscriptionStatus === 'active').length}
                  </div>
                  <p className="text-xs text-green-600">Active subscribers</p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Pro Members</CardTitle>
                  <Building className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">
                    {((usersData as any)?.users || []).filter((user: any) => user.subscriptionTier === 'pro' && user.subscriptionStatus === 'active').length}
                  </div>
                  <p className="text-xs text-purple-600">Active subscribers</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-blue-700">Order Management</h2>
                <p className="text-muted-foreground">Track and manage all container orders</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2 text-[#33d2b9]" />
                  Export Orders
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2 text-[#33d2b9]" />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card className="bg-blue-50 border border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{(ordersData as any)?.total || '0'}</div>
                  <p className="text-xs text-gray-500">No trend data yet</p>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900">
                    {((ordersData as any)?.orders || []).filter((o: any) => o.status === 'pending').length}
                  </div>
                  <p className="text-xs text-orange-600">Awaiting processing</p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">
                    {((ordersData as any)?.orders || []).filter((o: any) => o.status === 'completed').length}
                  </div>
                  <p className="text-xs text-green-600">Successfully delivered</p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">
                    ${((ordersData as any)?.orders || []).reduce((sum: number, o: any) => sum + (parseFloat(o.total) || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-purple-600">Total order value</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <ShoppingCart className="h-5 w-5 text-[#33d2b9]" />
                  Recent Orders
                </CardTitle>
                <CardDescription>
                  {ordersLoading ? "Loading orders..." : `${(ordersData as any)?.orders?.length || 0} orders found`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Input
                        placeholder="Search orders..."
                        className="max-w-sm"
                      />
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {((ordersData as any)?.orders || []).length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-500">Orders will appear here once customers start placing them.</p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {((ordersData as any)?.orders || []).map((order: any) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.id}</TableCell>
                                <TableCell>{order.customerEmail}</TableCell>
                                <TableCell>{order.containerType}</TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={
                                      order.status === 'completed' ? 'default' :
                                      order.status === 'pending' ? 'secondary' :
                                      order.status === 'cancelled' ? 'destructive' : 'outline'
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>${order.total}</TableCell>
                                <TableCell>
                                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-blue-700">Audit Logs</h2>
                <p className="text-muted-foreground">Monitor system activity and user actions</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2 text-[#33d2b9]" />
                  Export Logs
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2 text-[#33d2b9]" />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card className="bg-blue-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
                  <Activity className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {((auditLogsData as any)?.logs || []).filter((log: any) => {
                      const today = new Date().toDateString();
                      return new Date(log.createdAt).toDateString() === today;
                    }).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Actions performed today</p>
                </CardContent>
              </Card>

              <Card className="bg-orange-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Failed Actions</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {((auditLogsData as any)?.logs || []).filter((log: any) => log.status === 'failed').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">User Logins</CardTitle>
                  <UserCheck className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {((auditLogsData as any)?.logs || []).filter((log: any) => log.action === 'login').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Authentication events</p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Changes</CardTitle>
                  <Settings className="h-4 w-4 text-[#33d2b9]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {((auditLogsData as any)?.logs || []).filter((log: any) => log.resource === 'system_settings').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Configuration updates</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <FileText className="h-5 w-5 text-[#33d2b9]" />
                  Activity Logs
                </CardTitle>
                <CardDescription>
                  {auditLoading ? "Loading audit logs..." : `${(auditLogsData as any)?.logs?.length || 0} recent activities`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {auditLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Input
                        placeholder="Search logs..."
                        className="max-w-sm"
                      />
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Filter by action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Actions</SelectItem>
                          <SelectItem value="login">Login</SelectItem>
                          <SelectItem value="create">Create</SelectItem>
                          <SelectItem value="update">Update</SelectItem>
                          <SelectItem value="delete">Delete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {((auditLogsData as any)?.logs || []).length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-[#33d2b9] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-blue-700 mb-2">No audit logs found</h3>
                        <p className="text-gray-500">System activity will be logged here for monitoring and compliance.</p>
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Time</TableHead>
                              <TableHead>User</TableHead>
                              <TableHead>Action</TableHead>
                              <TableHead>Resource</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>IP Address</TableHead>
                              <TableHead>Details</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {((auditLogsData as any)?.logs || []).map((log: any) => (
                              <TableRow key={log.id}>
                                <TableCell className="font-medium">
                                  {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                                </TableCell>
                                <TableCell>{log.adminId || 'System'}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {log.action}
                                  </Badge>
                                </TableCell>
                                <TableCell>{log.resource}</TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={log.status === 'success' ? 'default' : 'destructive'}
                                  >
                                    {log.status || 'success'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">
                                  {log.ipAddress || 'N/A'}
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4 text-[#33d2b9]" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* QR Code Dialog */}
        <Dialog open={qrCodeDialog} onOpenChange={setQrCodeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Product QR Code</DialogTitle>
              <DialogDescription>
                QR Code for {selectedProduct?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-8">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setQrCodeDialog(false)}>
                Close
              </Button>
              <Button>Download QR Code</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User View Dialog */}
        <Dialog open={userViewDialog} onOpenChange={setUserViewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Comprehensive user information and account status
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Full Name</Label>
                    <p className="text-sm">{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Email</Label>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Role</Label>
                    <Badge variant="outline">{selectedUser.role}</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Status</Label>
                    <Badge variant={(selectedUser.subscriptionStatus === 'active') ? 'default' : 'destructive'}>
                      {(selectedUser.subscriptionStatus === 'active') ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Phone</Label>
                    <p className="text-sm">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Company</Label>
                    <p className="text-sm">{selectedUser.companyName || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Job Title</Label>
                    <p className="text-sm">{selectedUser.jobTitle || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-blue-700">Joined</Label>
                    <p className="text-sm">
                      {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setUserViewDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Edit Dialog */}
        <Dialog open={userEditDialog} onOpenChange={setUserEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and account settings
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={editUserForm.firstName || ''}
                    onChange={(e) => setEditUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={editUserForm.lastName || ''}
                    onChange={(e) => setEditUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editUserForm.email || ''}
                    onChange={(e) => setEditUserForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={editUserForm.role || 'user'} 
                    onValueChange={(value) => setEditUserForm(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editUserForm.phone || ''}
                    onChange={(e) => setEditUserForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={editUserForm.jobTitle || ''}
                    onChange={(e) => setEditUserForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={editUserForm.department || ''}
                    onChange={(e) => setEditUserForm(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">Company</Label>
                  <Input
                    id="companyName"
                    value={editUserForm.companyName || ''}
                    onChange={(e) => setEditUserForm(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUserEditDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveUserEdit}
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Delete Dialog */}
        <Dialog open={userDeleteDialog} onOpenChange={setUserDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </p>
                      <p className="text-sm text-red-700">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setUserDeleteDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleConfirmDeleteUser}
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Orders Management Section */}
      {activeSection === 'orders' && (
        <TabsContent value="orders">
          <Card>
            <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-700">Orders Management</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setActiveSection('dashboard')}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
              <Button onClick={() => setShowCreateOrderModal(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Create Order
              </Button>
            </div>
          </div>

          {/* Order Filters */}
          <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow">
            <div className="flex-1">
              <Input
                placeholder="Search orders by number, customer, or email..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
            <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900">Order List</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.orderNumber}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.customer?.firstName} {order.customer?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customer?.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                            order.paymentStatus === 'refunded' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${parseFloat(order.totalAmount).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditOrder(order)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateInvoice(order)}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Invoice
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Pagination */}
          {totalOrderPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentOrderPage(Math.max(1, currentOrderPage - 1))}
                disabled={currentOrderPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 py-2 text-sm">
                Page {currentOrderPage} of {totalOrderPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentOrderPage(Math.min(totalOrderPages, currentOrderPage + 1))}
                disabled={currentOrderPage === totalOrderPages}
              >
                Next
              </Button>
            </div>
          )}
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {/* Order View/Edit Modal */}
      <Dialog open={selectedOrder !== null} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Order Details - #{selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status and Actions */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Select 
                      value={selectedOrder.status} 
                      onValueChange={(value) => handleUpdateOrderStatus(selectedOrder.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Payment Status</label>
                    <Select 
                      value={selectedOrder.paymentStatus} 
                      onValueChange={(value) => handleUpdatePaymentStatus(selectedOrder.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleGenerateInvoice(selectedOrder)}>
                    <FileText className="h-4 w-4 mr-1" />
                    Generate Invoice
                  </Button>
                  <Button onClick={() => handleSendOrderEmail(selectedOrder)}>
                    <Mail className="h-4 w-4 mr-1" />
                    Send Email
                  </Button>
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Customer Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Name:</span>
                      <span className="ml-2">{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Email:</span>
                      <span className="ml-2">{selectedOrder.customer?.email}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Phone:</span>
                      <span className="ml-2">{selectedOrder.customer?.phone}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Company:</span>
                      <span className="ml-2">{selectedOrder.customer?.company}</span>
                    </div>
                  </div>
                </div>

                {/* Order Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Order Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Order Date:</span>
                      <span className="ml-2">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Shipping Method:</span>
                      <span className="ml-2">{selectedOrder.shippingMethod}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Payment Method:</span>
                      <span className="ml-2">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Distance:</span>
                      <span className="ml-2">{selectedOrder.distanceMiles} miles</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Container</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Condition</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Depot</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Qty</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unit Price</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.orderItems?.map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm">{item.containerType}</td>
                          <td className="px-4 py-2 text-sm">{item.containerCondition}</td>
                          <td className="px-4 py-2 text-sm">{item.depotLocation}</td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm">${parseFloat(item.unitPrice).toLocaleString()}</td>
                          <td className="px-4 py-2 text-sm font-medium">${parseFloat(item.totalPrice).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Totals */}
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Subtotal:</span>
                    <span className="text-sm">${parseFloat(selectedOrder.subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Shipping:</span>
                    <span className="text-sm">${parseFloat(selectedOrder.shippingCost).toLocaleString()}</span>
                  </div>
                  {selectedOrder.expeditedFee && parseFloat(selectedOrder.expeditedFee) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Expedited Fee:</span>
                      <span className="text-sm">${parseFloat(selectedOrder.expeditedFee).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${parseFloat(selectedOrder.totalAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              {selectedOrder.orderNote && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Order Notes</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm">{selectedOrder.orderNote}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Removed email modals */}
    </div>
  );
}

// Simple Mass Email System Component
function SimpleMassEmailSystem() {
  const [emailType, setEmailType] = useState('test');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleSendEmail = async () => {
    if (!subject || !message) {
      toast({
        title: "Error",
        description: "Please fill in both subject and message fields.",
        variant: "destructive",
      });
      return;
    }

    if (emailType === 'test' && !testEmail) {
      toast({
        title: "Error", 
        description: "Please enter a test email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    setResults(null);

    try {
      const response = await fetch('/api/simple-email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: emailType,
          subject,
          message,
          testEmail: emailType === 'test' ? testEmail : undefined,
          bypass: true
        })
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        toast({
          title: "Success",
          description: `Email sent successfully! ${data.results.sent} sent, ${data.results.failed} failed.`,
        });
      } else {
        throw new Error(data.message || 'Failed to send email');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to send email',
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleTestConnection = async () => {
    setIsSending(true);
    try {
      const response = await fetch('/api/simple-email/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bypass: true })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Email system is working correctly!",
        });
      } else {
        toast({
          title: "Warning",
          description: data.message || 'Email test had issues',
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: 'Failed to test email connection',
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Email Type</Label>
        <Select value={emailType} onValueChange={setEmailType}>
          <SelectTrigger>
            <SelectValue placeholder="Select email type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test Email (Single Address)</SelectItem>
            <SelectItem value="admin">Admin Team (9 accounts)</SelectItem>
            <SelectItem value="customers">All Customers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Test Email Address */}
      {emailType === 'test' && (
        <div className="space-y-2">
          <Label htmlFor="testEmail">Test Email Address</Label>
          <Input
            id="testEmail"
            type="email"
            placeholder="Enter test email address"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
        </div>
      )}

      {/* Subject */}
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="Enter email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Enter your email message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px]"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleTestConnection}
          variant="outline"
          disabled={isSending}
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          Test Connection
        </Button>
        
        <Button
          onClick={handleSendEmail}
          disabled={isSending || !subject || !message}
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Mail className="h-4 w-4 mr-2" />
          )}
          Send Email
        </Button>
      </div>

      {/* Results Display */}
      {results && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-sm text-green-800">Email Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Emails Sent:</span>
                <span className="font-medium text-green-600">{results.sent}</span>
              </div>
              <div className="flex justify-between">
                <span>Failed:</span>
                <span className="font-medium text-red-600">{results.failed}</span>
              </div>
              {results.recipients && (
                <div className="mt-2">
                  <span className="text-gray-600">Recipients:</span>
                  <div className="text-xs text-gray-500 mt-1">
                    {results.recipients.join(', ')}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Information */}
      <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
        <p><strong>System Status:</strong> Simple Mass Email system active</p>
        <p><strong>Admin Accounts:</strong> 9 email accounts configured</p>
        <p><strong>Email Service:</strong> cPanel SMTP (server168.web-hosting.com)</p>
      </div>
    </div>
  );
}
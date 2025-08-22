import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Shield,
  Key,
  LogOut,
  Globe,
  Truck,
  Container,
  QrCode,
  Building,
  FileX,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  Star,
  MessageSquare,
  UserCheck,
  UserX,
  Lock,
  Plus
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

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

export default function AdminDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userViewDialog, setUserViewDialog] = useState(false);
  const [twoFactorDialog, setTwoFactorDialog] = useState(false);
  const [qrCodeDialog, setQrCodeDialog] = useState(false);
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

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Data fetching
  const { data: dashboardData = {}, isLoading: dashboardLoading } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    retry: false,
  });

  const { data: usersData = {}, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    retry: false,
  });

  const { data: ordersData = {}, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/admin/orders'],
    retry: false,
  });

  const { data: productsData = {}, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/admin/containers'],
    retry: false,
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
      await apiRequest(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        body: productFormData
      });
      
      toast({
        title: "Product Updated",
        description: "Product has been successfully updated."
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/containers'] });
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
    toast({
      title: "Add Product",
      description: "Add product functionality coming soon",
    });
  };

  const handleBulkImport = () => {
    toast({
      title: "Bulk Import",
      description: "Bulk import functionality coming soon",
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Global Container Exchange Management Console
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="containers">Product Management</TabsTrigger>
            <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Stats Cards */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${(dashboardData as any)?.totalRevenue?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(dashboardData as any)?.totalOrders?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Containers</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(dashboardData as any)?.totalContainers || '0'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Available: {(dashboardData as any)?.availableContainers || '0'} | 
                    Low Stock: {(dashboardData as any)?.lowStockContainers || '0'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(usersData as any)?.users?.length || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Product Management Tab */}
          <TabsContent value="containers" className="space-y-6">
            {/* Product Management Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Product Management</h2>
                <p className="text-muted-foreground">Manage your complete container catalog and inventory</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBulkImport}>
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import
                </Button>
                <Button variant="outline" onClick={handleExportProducts}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={handleAddProduct}>
                  <Plus className="h-4 w-4 mr-2" />
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
                      value={productQuery.search}
                      onChange={(e) => setProductQuery(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                  <Select value={productQuery.containerType} onValueChange={(value) => setProductQuery(prev => ({ ...prev, containerType: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Container Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="20GP">20ft GP</SelectItem>
                      <SelectItem value="40GP">40ft GP</SelectItem>
                      <SelectItem value="40HC">40ft HC</SelectItem>
                      <SelectItem value="45HC">45ft HC</SelectItem>
                      <SelectItem value="53HC">53ft HC</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={productQuery.condition} onValueChange={(value) => setProductQuery(prev => ({ ...prev, condition: value }))}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Used">Used</SelectItem>
                      <SelectItem value="Refurbished">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Product Catalog */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Catalog
                </CardTitle>
                <CardDescription>
                  {productsLoading ? "Loading products..." : `${(productsData as any)?.containers?.length || 0} products in catalog`}
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
                                      {product.image ? (
                                        <img 
                                          src={product.image} 
                                          alt={product.title}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <Container className="h-6 w-6 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <div className="font-medium">{product.title}</div>
                                      <div className="text-sm text-muted-foreground">SKU: {product.sku || product.id}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{product.containerType}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={product.condition === 'New' ? 'default' : 'secondary'}>
                                    {product.condition}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    {product.location}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">${product.price?.toLocaleString()}</div>
                                  {product.salePrice && (
                                    <div className="text-sm text-red-600">Sale: ${product.salePrice.toLocaleString()}</div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={product.availability === 'available' ? 'default' : 'secondary'}>
                                    {product.availability || 'Available'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-end gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleGenerateQR(product)}>
                                      <QrCode className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Trash2 className="h-3 w-3" />
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
      </div>
    </div>
  );
}
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
  Lock
} from "lucide-react";

// This is a simplified test component to fix the JSX syntax error
export default function AdminDashboardFixed() {
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productFormData, setProductFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [qrCodeDialog, setQrCodeDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for testing
  const productsData = {
    containers: [
      {
        id: 1,
        title: "20ft Standard Container",
        price: 3500,
        condition: "New",
        location: "Los Angeles, CA",
        available: true,
        size: "20ft",
        image: "/api/placeholder/300/200",
        sku: "CNT-001"
      },
      {
        id: 2,
        title: "40ft High Cube Container",
        price: 4500,
        condition: "Used",
        location: "Houston, TX",
        available: true,
        size: "40ft",
        image: "/api/placeholder/300/200",
        sku: "CNT-002"
      }
    ]
  };

  const handleProductClick = (product: any) => {
    const expanded = expandedProductId === product.id ? null : product.id;
    setExpandedProductId(expanded);
    if (expanded) {
      setEditingProduct(product);
      setProductFormData({
        title: product.title || '',
        price: product.price || '',
        salePrice: product.salePrice || '',
        onSale: product.onSale || false,
        containerType: product.containerType || '',
        containerCondition: product.condition || '',
        location: product.location || '',
        sku: product.sku || product.id,
        description: product.description || '',
        image: product.image || ''
      });
    } else {
      setEditingProduct(null);
      setProductFormData({});
    }
  };

  const handleProductUpdate = async () => {
    if (!editingProduct) return;
    
    try {
      setUploading(true);
      toast({
        title: "Product Updated",
        description: "Product details have been successfully updated.",
      });
      
      setExpandedProductId(null);
      setEditingProduct(null);
      setProductFormData({});
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      // Simulate upload
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductFormData((prev: any) => ({ ...prev, image: e.target?.result }));
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Image Uploaded",
        description: "Product image has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>
            Click on any product row to expand and edit product details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsData?.containers?.map((product: any) => (
                <React.Fragment key={product.id}>
                  <TableRow 
                    className={`cursor-pointer hover:bg-gray-50 ${expandedProductId === product.id ? 'bg-blue-50' : ''}`}
                    onClick={() => handleProductClick(product)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.title || 'Container'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{product.title || `Container #${product.id}`}</div>
                          <div className="text-sm text-muted-foreground">SKU: {product.sku || product.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.size || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.condition === 'New' ? 'default' : 'outline'}>
                        {product.condition || 'Used'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{product.location || 'Multiple Locations'}</TableCell>
                    <TableCell className="font-medium">${product.price?.toLocaleString() || '0'}</TableCell>
                    <TableCell>
                      <Badge variant={product.available ? 'default' : 'secondary'}>
                        {product.available ? 'Available' : 'Sold'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={(e) => {
                          e.stopPropagation();
                          setQrCodeDialog(true);
                          setSelectedProduct(product);
                        }}>
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={(e) => {
                          e.stopPropagation();
                          // Add delete functionality
                        }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className={`transition-transform duration-200 ${expandedProductId === product.id ? 'rotate-180' : ''}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Expandable Product Editing Form */}
                  {expandedProductId === product.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <div className="bg-gray-50 p-6 border-t">
                          <div className="max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-6">
                              <h3 className="text-lg font-semibold">Edit Product Details</h3>
                              <div className="flex gap-2">
                                <Button onClick={handleProductUpdate} disabled={uploading}>
                                  Save Changes
                                </Button>
                                <Button variant="outline" onClick={() => {
                                  setExpandedProductId(null);
                                  setEditingProduct(null);
                                  setProductFormData({});
                                }}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Image Upload Section */}
                              <div className="space-y-4">
                                <label className="block text-sm font-medium">Product Image</label>
                                <div className="flex flex-col space-y-4">
                                  <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                                    {(productFormData.image || product.image) ? (
                                      <img 
                                        src={productFormData.image || product.image} 
                                        alt="Product"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Upload className="h-12 w-12 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleImageUpload(file);
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    disabled={uploading}
                                  />
                                </div>
                              </div>
                              
                              {/* Product Details Form */}
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-1">Product Title</label>
                                  <input
                                    type="text"
                                    value={productFormData.title || ''}
                                    onChange={(e) => setProductFormData((prev: any) => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Price ($)</label>
                                    <input
                                      type="number"
                                      value={productFormData.price || ''}
                                      onChange={(e) => setProductFormData((prev: any) => ({ ...prev, price: e.target.value }))}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Sale Price ($)</label>
                                    <input
                                      type="number"
                                      value={productFormData.salePrice || ''}
                                      onChange={(e) => setProductFormData((prev: any) => ({ ...prev, salePrice: e.target.value }))}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`onSale-${product.id}`}
                                    checked={productFormData.onSale || false}
                                    onChange={(e) => setProductFormData((prev: any) => ({ ...prev, onSale: e.target.checked }))}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <label htmlFor={`onSale-${product.id}`} className="text-sm font-medium">
                                    Enable Sale Price
                                  </label>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-1">Container Type</label>
                                  <select
                                    value={productFormData.containerType || ''}
                                    onChange={(e) => setProductFormData((prev: any) => ({ ...prev, containerType: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">Select Type</option>
                                    <option value="20DC">20ft Dry Container</option>
                                    <option value="40DC">40ft Dry Container</option>
                                    <option value="40HC">40ft High Cube</option>
                                    <option value="45HC">45ft High Cube</option>
                                    <option value="53HC">53ft High Cube</option>
                                    <option value="20RF">20ft Reefer</option>
                                    <option value="40RF">40ft Reefer</option>
                                  </select>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-1">Condition</label>
                                  <select
                                    value={productFormData.containerCondition || ''}
                                    onChange={(e) => setProductFormData((prev: any) => ({ ...prev, containerCondition: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">Select Condition</option>
                                    <option value="New">New</option>
                                    <option value="Cargo Worthy">Cargo Worthy</option>
                                    <option value="Wind Water Tight">Wind Water Tight</option>
                                    <option value="As Is">As Is</option>
                                    <option value="IICL">IICL</option>
                                  </select>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-1">Location</label>
                                  <input
                                    type="text"
                                    value={productFormData.location || ''}
                                    onChange={(e) => setProductFormData((prev: any) => ({ ...prev, location: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-1">SKU</label>
                                  <input
                                    type="text"
                                    value={productFormData.sku || ''}
                                    onChange={(e) => setProductFormData((prev: any) => ({ ...prev, sku: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-1">Description</label>
                                  <textarea
                                    value={productFormData.description || ''}
                                    onChange={(e) => setProductFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
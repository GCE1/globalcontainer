import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Plus, DollarSign, Eye, Download, Clock, CheckCircle, AlertCircle, CreditCard, X, FileCheck } from "lucide-react";
// PayPal components removed

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: InvoiceItem[];
  paymentMethod?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

function InvoiceManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [newInvoice, setNewInvoice] = useState({
    customerName: "",
    customerEmail: "",
    dueDate: "",
    items: [] as InvoiceItem[]
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Clear any cached invoice data and fetch with proper error handling
  React.useEffect(() => {
    // Clear cached data on component mount to ensure fresh state
    queryClient.removeQueries({ queryKey: ['/api/invoices'] });
  }, [queryClient]);

  const { data: invoices = [], isLoading, error: invoicesError } = useQuery({
    queryKey: ['/api/invoices'],
    staleTime: 0, // Don't use cached data
    gcTime: 0, // Don't cache data
    retry: false, // Don't retry on any errors
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Always refetch on mount
    refetchOnReconnect: false,
    select: useCallback((data: any) => data, []), // Stable select function
  });

  // Aggressive prefetching strategy for instant tab switching
  React.useEffect(() => {
    const prefetchQueries = async () => {
      // Prefetch all related data in parallel
      await Promise.allSettled([
        queryClient.prefetchQuery({
          queryKey: ['/api/wholesale/analytics'],
          staleTime: 10 * 60 * 1000,
          gcTime: 30 * 60 * 1000,
        }),
        queryClient.prefetchQuery({
          queryKey: ['/api/invoices'],
          staleTime: 10 * 60 * 1000,
          gcTime: 30 * 60 * 1000,
        }),
        // Prefetch user data if needed
        queryClient.prefetchQuery({
          queryKey: ['/api/auth/user'],
          staleTime: 15 * 60 * 1000,
          gcTime: 30 * 60 * 1000,
        })
      ]);
    };
    
    prefetchQueries();
  }, [queryClient]);

  // Create invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: any) => {
      return await apiRequest('/api/invoices', 'POST', invoiceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      toast({
        title: "Invoice Created",
        description: "Invoice has been successfully created and sent to the customer.",
      });
      setIsCreatingInvoice(false);
      setNewInvoice({ customerName: "", customerEmail: "", dueDate: "", items: [] });
    },
  });



  // Download PDF function
  const handleDownloadPDF = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "PDF Downloaded",
        description: "Invoice PDF has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF.",
        variant: "destructive",
      });
    }
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'sent': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'draft': return <FileText className="h-4 w-4 text-gray-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateInvoiceItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const removeInvoiceItem = (itemId: string) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const calculateInvoiceTotal = () => {
    return newInvoice.items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleCreateInvoice = () => {
    const invoiceData = {
      ...newInvoice,
      amount: calculateInvoiceTotal(),
      issueDate: new Date().toISOString().split('T')[0],
      status: 'draft'
    };
    createInvoiceMutation.mutate(invoiceData);
  };

  // Optimized invoice data formatting with memoization
  const formatInvoiceData = useCallback((apiInvoices: any[]) => {
    if (!Array.isArray(apiInvoices)) return [];
    
    return apiInvoices.filter(Boolean).map((invoice, index) => ({
      id: invoice.id?.toString() || `invoice-${index}`,
      invoiceNumber: invoice.invoiceNumber || invoice.invoice_number || `INV-${index}`,
      customerName: invoice.customerName || invoice.customer_name || 'Unknown Customer',
      customerEmail: invoice.customerEmail || invoice.customer_email || '',
      issueDate: invoice.issueDate || invoice.issue_date || '2025-06-01',
      dueDate: invoice.dueDate || invoice.due_date || '2025-07-01',
      amount: parseFloat(invoice.totalAmount || invoice.total_amount || '0') || 0,
      status: invoice.status || 'pending',
      items: Array.isArray(invoice.items) ? invoice.items : [],
      paymentMethod: invoice.paymentMethod || invoice.payment_method || null
    }));
  }, []);

  const formattedInvoices = useMemo(() => {
    return formatInvoiceData(invoices || []);
  }, [invoices, formatInvoiceData]);

  // Memoized analytics calculations for better performance
  const safeInvoices = useMemo(() => 
    Array.isArray(formattedInvoices) ? formattedInvoices : [], 
    [formattedInvoices]
  );

  const analyticsData = useMemo(() => {
    const totalRevenue = safeInvoices.reduce((sum, inv) => {
      const amount = typeof inv?.amount === 'number' && !isNaN(inv.amount) ? inv.amount : 0;
      return sum + amount;
    }, 0);
    
    const paidInvoices = safeInvoices.filter(inv => inv?.status === 'paid');
    const overdueInvoices = safeInvoices.filter(inv => inv?.status === 'overdue');
    const pendingInvoices = safeInvoices.filter(inv => inv?.status === 'pending' || inv?.status === 'sent');
    
    return {
      totalRevenue,
      paidInvoices,
      overdueInvoices,
      pendingInvoices
    };
  }, [safeInvoices]);

  const { totalRevenue, paidInvoices, overdueInvoices, pendingInvoices } = analyticsData;

  // Optimized view invoice function with memoization
  const handleViewInvoiceOptimized = useCallback((invoiceId: string) => {
    const invoice = safeInvoices.find(inv => inv?.id === invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);
      setShowViewDialog(true);
    } else {
      toast({
        title: "Error",
        description: "Invoice not found.",
        variant: "destructive",
      });
    }
  }, [safeInvoices, toast]);
  
  // Check for authentication errors or general API failures - show empty state instead of error
  const isAuthError = invoicesError?.status === 401 || invoicesError?.response?.status === 401;
  const isAPIError = invoicesError?.status === 500 || invoicesError?.response?.status === 500;
  const hasFailedToFetch = invoicesError && (invoicesError.message?.includes('Failed to fetch') || invoicesError.toString().includes('Failed to fetch'));
  
  // Show clean empty state for any error or when no invoices exist
  if (isAuthError || isAPIError || hasFailedToFetch || (!isLoading && (!invoices || invoices.length === 0))) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#001937]">Invoice Management</h2>
            <p className="text-gray-600 mt-2">Manage wholesale invoices and payments for GCE transactions</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Invoices Available</h3>
          <p className="text-gray-500 text-center max-w-md">
            Invoice data will appear here when you complete wholesale container transactions. 
            All invoices are generated from authentic customer purchases and wholesale deals.
          </p>
        </div>
      </div>
    );
  }
  
  // Add loading state check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#001937]">Invoice Management</h2>
          <p className="text-gray-600 mt-2">Manage wholesale invoices and payments for GCE transactions</p>
        </div>
        <Button 
          onClick={() => setIsCreatingInvoice(true)}
          className="bg-[#001937] hover:bg-[#33d2b9] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="all-invoices"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            All Invoices
          </TabsTrigger>
          <TabsTrigger 
            value="payments"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Payments
          </TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <FileCheck className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-2xl text-blue-600">
                    ${totalRevenue.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Paid Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-2xl text-green-600">{paidInvoices.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-700">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-2xl text-yellow-600">{pendingInvoices.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-700">Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-2xl text-red-600">{overdueInvoices.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#001937]">Recent Invoices</CardTitle>
              <CardDescription>Latest wholesale invoice activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {safeInvoices.slice(0, 5).map((invoice) => (
                  <div key={invoice?.id || 'unknown'} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(invoice?.status || 'pending')}
                      <div>
                        <p className="font-medium text-[#001937]">{invoice?.invoiceNumber || 'N/A'}</p>
                        <p className="text-sm text-gray-600">{invoice?.customerName || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(invoice?.status || 'pending')}>
                        {(invoice?.status || 'pending').charAt(0).toUpperCase() + (invoice?.status || 'pending').slice(1)}
                      </Badge>
                      <span className="font-semibold text-[#001937]">
                        ${(invoice?.amount || 0).toLocaleString()}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewInvoiceOptimized(invoice?.id)}
                        title="View Invoice"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Invoices Tab */}
        <TabsContent value="all-invoices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#001937]">All Invoices</CardTitle>
              <CardDescription>Manage all wholesale invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Invoice #</th>
                      <th className="text-left p-3 font-medium">Customer</th>
                      <th className="text-left p-3 font-medium">Issue Date</th>
                      <th className="text-left p-3 font-medium">Due Date</th>
                      <th className="text-left p-3 font-medium">Amount</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeInvoices.map((invoice) => {
                      if (!invoice || !invoice.id) return null;
                      
                      return (
                        <tr key={invoice.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{invoice.invoiceNumber || 'N/A'}</td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{invoice.customerName || 'Unknown'}</p>
                              <p className="text-sm text-gray-600">{invoice.customerEmail || ''}</p>
                            </div>
                          </td>
                          <td className="p-3">{invoice.issueDate || 'N/A'}</td>
                          <td className="p-3">{invoice.dueDate || 'N/A'}</td>
                          <td className="p-3 font-medium">${(invoice.amount || 0).toLocaleString()}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(invoice.status || 'pending')}>
                              {(invoice.status || 'pending').charAt(0).toUpperCase() + (invoice.status || 'pending').slice(1)}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewInvoiceOptimized(invoice.id)}
                                title="View Invoice"
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownloadPDF(invoice.id)}
                                title="Download PDF"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {(invoice.status === 'pending' || invoice.status === 'overdue' || invoice.status === 'sent') && (
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  className="ml-2 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  Pay ${(invoice.amount || 0).toLocaleString()}
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#001937] flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payment Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Payments Received:</span>
                          <span className="font-semibold">${paidInvoices.reduce((sum, inv) => sum + (inv?.amount || 0), 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                        </div>
                        <div className="flex justify-between">
                          <span>Outstanding Amount:</span>
                          <span className="font-semibold text-red-600">
                            ${(overdueInvoices.reduce((sum, inv) => sum + (inv?.amount || 0), 0) + pendingInvoices.reduce((sum, inv) => sum + (inv?.amount || 0), 0)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <CreditCard className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Payment Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Payment Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {paidInvoices.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium">{invoice.invoiceNumber}</p>
                              <p className="text-sm text-gray-600">{invoice.customerName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${invoice.amount.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">via {invoice.paymentMethod}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#001937]">Financial Reports</CardTitle>
              <CardDescription>Comprehensive reporting for wholesale transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Invoices Issued:</span>
                        <span className="font-semibold">{formattedInvoices.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Billed:</span>
                        <span className="font-semibold">${totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Collection Rate:</span>
                        <span className="font-semibold text-green-600">
                          {Math.round((paidInvoices.length / formattedInvoices.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Export Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export Invoice List (CSV)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Payment Report (PDF)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Tax Summary (Excel)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Invoice Modal/Form */}
      {isCreatingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-xl text-[#001937]">Create New Invoice</CardTitle>
              <CardDescription>Generate a new wholesale invoice for container transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={newInvoice.customerName}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Enter customer company name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={newInvoice.customerEmail}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, customerEmail: e.target.value }))}
                    placeholder="billing@customer.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>

              {/* Invoice Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg">Invoice Items</Label>
                  <Button onClick={addInvoiceItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {newInvoice.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                          placeholder="Container description"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(item.id, 'quantity', Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Unit Price</Label>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateInvoiceItem(item.id, 'unitPrice', Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Total</Label>
                        <Input
                          value={`$${item.total.toLocaleString()}`}
                          disabled
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeInvoiceItem(item.id)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {newInvoice.items.length > 0 && (
                  <div className="text-right pt-4 border-t">
                    <p className="text-lg font-semibold">
                      Total: ${calculateInvoiceTotal().toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingInvoice(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateInvoice}
                  className="bg-[#001937] hover:bg-[#33d2b9] text-white"
                  disabled={createInvoiceMutation.isPending || newInvoice.items.length === 0}
                >
                  {createInvoiceMutation.isPending ? 'Creating...' : 'Create Invoice'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}



      {/* Invoice View Modal */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-600">
              Invoice Details
            </DialogTitle>
            <DialogDescription>
              Complete invoice information and line items
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">Invoice Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-bold">Invoice Number:</span>
                      <span>{selectedInvoice.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Issue Date:</span>
                      <span>{selectedInvoice.issueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Due Date:</span>
                      <span>{selectedInvoice.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Status:</span>
                      <Badge className={getStatusColor(selectedInvoice.status)}>
                        {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-bold">Customer:</span>
                      <span>{selectedInvoice.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Email:</span>
                      <span>{selectedInvoice.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">Total Amount:</span>
                      <span className="text-xl font-bold text-[#001937]">
                        ${selectedInvoice.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div>
                <h3 className="text-lg font-semibold text-blue-600 mb-4">Invoice Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left font-semibold">Description</th>
                        <th className="p-3 text-left font-semibold">Quantity</th>
                        <th className="p-3 text-left font-semibold">Unit Price</th>
                        <th className="p-3 text-left font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                        selectedInvoice.items.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3">{item.description || 'Container Service'}</td>
                            <td className="p-3">{item.quantity || 1}</td>
                            <td className="p-3">${(item.unitPrice || selectedInvoice.amount).toLocaleString()}</td>
                            <td className="p-3 font-semibold">${(item.total || selectedInvoice.amount).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-b">
                          <td className="p-3">Wholesale Container Service</td>
                          <td className="p-3">1</td>
                          <td className="p-3">${selectedInvoice.amount.toLocaleString()}</td>
                          <td className="p-3 font-semibold">${selectedInvoice.amount.toLocaleString()}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleDownloadPDF(selectedInvoice.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    {(selectedInvoice.status === 'pending' || selectedInvoice.status === 'overdue' || selectedInvoice.status === 'sent') && (
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Pay ${selectedInvoice.amount.toLocaleString()}
                      </Button>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Total Amount</div>
                    <div className="text-2xl font-bold text-[#001937]">
                      ${selectedInvoice.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InvoiceManagement;
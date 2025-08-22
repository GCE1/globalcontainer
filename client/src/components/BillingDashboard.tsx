import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  CreditCard, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  Users,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

interface BillingStats {
  totalInvoicesThisMonth: number;
  totalAmountThisMonth: number;
  paidInvoices: number;
  pendingInvoices: number;
  failedInvoices: number;
}

interface PaymentMethod {
  id: number;
  type: string;
  isDefault: boolean;
  isActive: boolean;
  cardLast4?: string;
  cardBrand?: string;
  cardExpiryMonth?: number;
  cardExpiryYear?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PerDiemInvoice {
  id: number;
  invoiceNumber: string;
  billingDate: Date;
  dueDate: Date;
  totalAmount: string;
  perDiemRate: string;
  daysOverdue: number;
  containerCount: number;
  status: string;
  retryCount: number;
  lastFailureReason?: string;
  paidAt?: Date;
  createdAt: Date;
}

interface DunningCampaign {
  id: number;
  campaignType: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  nextActionDate: Date;
  emailsSent: number;
  callsMade: number;
  noticesSent: number;
}

export default function BillingDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddPaymentMethodOpen, setIsAddPaymentMethodOpen] = useState(false);

  // Fetch billing statistics
  const { data: billingStats, isLoading: statsLoading } = useQuery<{ success: boolean; stats: BillingStats }>({
    queryKey: ["/api/billing-stats"],
    enabled: true
  });

  // Fetch payment methods
  const { data: paymentMethodsData, isLoading: paymentMethodsLoading } = useQuery<{ success: boolean; paymentMethods: PaymentMethod[] }>({
    queryKey: ["/api/payment-methods"],
    enabled: true
  });

  // Fetch per diem invoices
  const { data: invoicesData, isLoading: invoicesLoading } = useQuery<{ success: boolean; invoices: PerDiemInvoice[] }>({
    queryKey: ["/api/per-diem-invoices"],
    enabled: true
  });

  // Fetch dunning campaigns
  const { data: campaignsData, isLoading: campaignsLoading } = useQuery<{ success: boolean; campaigns: DunningCampaign[] }>({
    queryKey: ["/api/dunning-campaigns"],
    enabled: true
  });

  // Add payment method mutation
  const addPaymentMethodMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to add payment method");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      setIsAddPaymentMethodOpen(false);
      toast({ title: "Payment method added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add payment method", variant: "destructive" });
    }
  });

  // Delete payment method mutation
  const deletePaymentMethodMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/payment-methods/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete payment method");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({ title: "Payment method deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete payment method", variant: "destructive" });
    }
  });

  const handleAddPaymentMethod = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      type: formData.get("type") as string,
      isDefault: formData.get("isDefault") === "on",
      isActive: true
    };
    addPaymentMethodMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = billingStats?.stats;
  const paymentMethods = paymentMethodsData?.paymentMethods || [];
  const invoices = invoicesData?.invoices || [];
  const campaigns = campaignsData?.campaigns || [];

  if (statsLoading || paymentMethodsLoading || invoicesLoading || campaignsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Billing Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Invoices</p>
                <p className="text-3xl font-bold">{stats?.totalInvoicesThisMonth || 0}</p>
                <p className="text-blue-100 text-xs mt-1">This Month</p>
              </div>
              <FileText className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Amount</p>
                <p className="text-3xl font-bold">${stats?.totalAmountThisMonth?.toFixed(2) || '0.00'}</p>
                <p className="text-green-100 text-xs mt-1">This Month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pending Invoices</p>
                <p className="text-3xl font-bold">{stats?.pendingInvoices || 0}</p>
                <p className="text-yellow-100 text-xs mt-1">Awaiting Payment</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Failed Payments</p>
                <p className="text-3xl font-bold">{stats?.failedInvoices || 0}</p>
                <p className="text-red-100 text-xs mt-1">Require Action</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Rate Progress */}
      {stats && stats.totalInvoicesThisMonth > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Payment Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Successful Payments</span>
                <span>{stats.paidInvoices} / {stats.totalInvoicesThisMonth}</span>
              </div>
              <Progress 
                value={(stats.paidInvoices / stats.totalInvoicesThisMonth) * 100} 
                className="h-2"
              />
              <p className="text-sm text-muted-foreground">
                {((stats.paidInvoices / stats.totalInvoicesThisMonth) * 100).toFixed(1)}% success rate this month
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoices">Per Diem Invoices</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="campaigns">Dunning Campaigns</TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Per Diem Invoices</CardTitle>
              <CardDescription>
                Automated billing for containers past their free days ($5 per day per container)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Per diem invoices will appear here when containers exceed their free days.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Billing Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Containers</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{format(new Date(invoice.billingDate), "MMM dd, yyyy")}</TableCell>
                        <TableCell>${parseFloat(invoice.totalAmount).toFixed(2)}</TableCell>
                        <TableCell>{invoice.containerCount}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment methods for automated per diem billing
                  </CardDescription>
                </div>
                <Dialog open={isAddPaymentMethodOpen} onOpenChange={setIsAddPaymentMethodOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Payment Method</DialogTitle>
                      <DialogDescription>
                        Add a new payment method for automated billing
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Payment Type</Label>
                        <Select name="type" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="email"
                          placeholder="your-email@example.com"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="isDefault" name="isDefault" />
                        <Label htmlFor="isDefault">Set as default payment method</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsAddPaymentMethodOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={addPaymentMethodMutation.isPending}>
                          {addPaymentMethodMutation.isPending ? "Adding..." : "Add Payment Method"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No payment methods</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add a payment method to enable automated per diem billing.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Default</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentMethods.map((method) => (
                      <TableRow key={method.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                          </div>
                        </TableCell>
                        <TableCell>
                        </TableCell>
                        <TableCell>
                          <Badge variant={method.isActive ? "default" : "secondary"}>
                            {method.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {method.isDefault && <Badge variant="outline">Default</Badge>}
                        </TableCell>
                        <TableCell>{format(new Date(method.createdAt), "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deletePaymentMethodMutation.mutate(method.id)}
                              disabled={deletePaymentMethodMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dunning Campaigns Tab */}
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Dunning Campaigns</CardTitle>
              <CardDescription>
                Automated collection campaigns for failed payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No active campaigns</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Dunning campaigns will appear here when payments fail and require collection efforts.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Next Action</TableHead>
                      <TableHead>Emails Sent</TableHead>
                      <TableHead>Calls Made</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="capitalize">{campaign.campaignType}</TableCell>
                        <TableCell>
                          <Badge variant={campaign.status === 'active' ? "default" : "secondary"}>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(campaign.startDate), "MMM dd, yyyy")}</TableCell>
                        <TableCell>{format(new Date(campaign.nextActionDate), "MMM dd, yyyy")}</TableCell>
                        <TableCell>{campaign.emailsSent}</TableCell>
                        <TableCell>{campaign.callsMade}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
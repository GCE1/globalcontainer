import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Container, FileText, BarChart3, Settings, Calendar, ShoppingCart, Search, TrendingUp, Clock, MapPin, Activity, DollarSign, Mail, Users, ChevronDown, ChevronRight } from "lucide-react";
import { LuContainer } from 'react-icons/lu';
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import CartModal from "@/components/CartModal";
import AddToCartConfirmModal from "@/components/AddToCartConfirmModal";
import { ContractCalendar } from "@/components/ContractCalendar";
import { ContractActivationModal } from "@/components/ContractActivationModal";
import { ContainerPickupModal } from "@/components/ContainerPickupModal";
import { ContainerTrackingList } from "@/components/ContainerTrackingList";
import BillingDashboard from "@/components/BillingDashboard";
import ContainerManagement from "@/components/ContainerManagement";
import EmployeeManagement from "@/components/EmployeeManagement";
import OrganizationalSettings from "@/pages/OrganizationalSettings";
import { useSimpleCart } from '@/hooks/useSimpleCart';

export default function LeasingManager() {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [selectedContractForPickup, setSelectedContractForPickup] = useState<any>(null);
  const [showAddToCartConfirm, setShowAddToCartConfirm] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<any>(null);
  
  // Leasing search state
  const [originSearch, setOriginSearch] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const activateContractMutation = useMutation({
    mutationFn: async (contractData: any) => {
      const response = await fetch('/api/leasing-contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
      });
      if (!response.ok) {
        throw new Error('Failed to activate contract');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leasing-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      setShowContractModal(false);
      toast({
        title: "Contract Activated",
        description: "Your leasing contract has been successfully activated",
      });
    },
    onError: () => {
      toast({
        title: "Activation Failed",
        description: "Failed to activate contract. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: userAnalytics } = useQuery({
    queryKey: ["/api/user/analytics"],
    refetchInterval: 30000,
  });

  const { data: originsData } = useQuery({
    queryKey: ["/api/origins", destinationSearch],
    queryFn: () => {
      const params = new URLSearchParams();
      if (destinationSearch.trim()) {
        params.append('destination', destinationSearch);
      }
      return fetch(`/api/origins?${params}`).then(res => res.json());
    },
  });

  const { data: destinationsData } = useQuery({
    queryKey: ["/api/destinations", originSearch],
    queryFn: () => {
      const params = new URLSearchParams();
      if (originSearch.trim()) {
        params.append('origin', originSearch);
      }
      return fetch(`/api/destinations?${params}`).then(res => res.json());
    },
  });

  // Use simple localStorage cart
  const { cartItems: simpleCartItems, cartCount, addToCart: addToSimpleCart } = useSimpleCart();

  const { data: contractsData } = useQuery({
    queryKey: ["/api/leasing-contracts"],
    refetchInterval: 30000,
  });

  const origins = Array.isArray(originsData) ? originsData : [];
  const destinations = Array.isArray(destinationsData) ? destinationsData : [];
  const cartItemCount = cartCount;
  const userContracts = Array.isArray(contractsData) ? contractsData : [];

  const handleSearchLeasingRates = async () => {
    if (!originSearch.trim() && !destinationSearch.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter at least an origin or destination port",
        variant: "destructive",
      });
      return;
    }

    setSearchLoading(true);
    try {
      const params = new URLSearchParams();
      if (originSearch.trim()) params.append('origin', originSearch.trim());
      if (destinationSearch.trim()) params.append('destination', destinationSearch.trim());
      
      const response = await fetch(`/api/leasing-rates?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch leasing rates');
      }
      
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
      
      toast({
        title: "Search Complete",
        description: `Found ${Array.isArray(data) ? data.length : 0} leasing rates`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search leasing rates. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const getValueFromRate = (rate: any, field: string) => {
    if (!rate) return '';
    
    const fieldMap: { [key: string]: string } = {
      'origin': 'origin',
      'destination': 'destination', 
      'container size': 'containerSize',
      'price': 'price',
      'free days': 'freeDays',
      'per diem': 'perDiem'
    };
    
    const mappedField = fieldMap[field.toLowerCase()] || field;
    return rate[mappedField] || '';
  };

  const addToCartMutation = useMutation({
    mutationFn: async (leaseData: any) => {
      try {
        console.log('=== FRONTEND CART ADD DEBUG ===');
        console.log('Sending cart request with credentials');
        console.log('Document cookies:', document.cookie);
        console.log('Navigator cookieEnabled:', navigator.cookieEnabled);
        console.log('Document domain:', document.domain);
        console.log('Window location:', window.location.href);
        
        // Import SessionManager for cookie-free operation
        const { SessionManager } = await import('@/utils/sessionManager');
        const sessionInfo = SessionManager.getSessionInfo();
        console.log('Session info:', sessionInfo);
        
        // If cookies are disabled, use localStorage-based cart
        if (!sessionInfo.cookiesEnabled) {
          console.log('🎯 COOKIES DISABLED - Using localStorage cart solution');
          
          const newItem = addToSimpleCart({
            leasingRecordId: leaseData.leasingRecordId,
            origin: leaseData.origin,
            destination: leaseData.destination,
            containerSize: leaseData.containerSize,
            price: leaseData.price,
            freeDays: leaseData.freeDays,
            perDiem: leaseData.perDiem,
            quantity: leaseData.quantity
          });
          
          console.log('✅ Item added to simple cart');
          return {
            success: true,
            cartItem: newItem,
            usingLocalStorage: true
          };
        }
        
        const response = await fetch('/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // CRITICAL FIX: Include session cookies
          body: JSON.stringify(leaseData)
        });
        
        console.log('Response headers:', Array.from(response.headers.entries()));
        console.log('Response cookies after request:', document.cookie);
        
        // Check for Set-Cookie header
        const setCookieHeader = response.headers.get('set-cookie');
        console.log('Set-Cookie header:', setCookieHeader);
        
        // Test manual cookie setting
        if (setCookieHeader) {
          console.log('Attempting manual cookie setting...');
          // Try to extract and set the session cookie manually
          const cookieMatch = setCookieHeader.match(/(gce\.sid|connect\.sid)=([^;]+)/);
          if (cookieMatch) {
            document.cookie = `${cookieMatch[1]}=${cookieMatch[2]}; path=/`;
            console.log('Manual cookie set:', document.cookie);
          }
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Cart API Error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Cart is already updated via the simple cart hook
      console.log('🎯 Simple cart updated successfully');
      
      setShowAddToCartConfirm(true);
    },
    onError: (error: any) => {
      console.error('Lease error:', error);
      const errorMessage = error?.message || "Failed to add container to cart. Please try again.";
      toast({
        title: "Add to Cart Failed", 
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const handleAddToCart = async (rate: any) => {
    const leaseData = {
      leasingRecordId: rate.id || `${rate.origin}-${rate.destination}-${rate.containerSize}` || 'temp-id',
      origin: rate.origin || originSearch,
      destination: rate.destination || destinationSearch,
      containerSize: rate.containerSize || rate['container size'] || '',
      price: rate.price,
      freeDays: rate.freeDays || rate['free days'] || 0,
      perDiem: rate.perDiem || rate['per diem'] || '',
      quantity: 1
    };

    setPendingCartItem(leaseData);
    addToCartMutation.mutate(leaseData);
  };

  const handleProceedToCart = () => {
    setShowAddToCartConfirm(false);
    setPendingCartItem(null);
    setShowCartModal(true);
  };

  const handleContinueShopping = () => {
    setShowAddToCartConfirm(false);
    setPendingCartItem(null);
  };

  const handleLeaseNow = async (rate: any) => {
    const leaseData = {
      leasingRecordId: rate.id || `${rate.origin}-${rate.destination}-${rate.containerSize}` || 'temp-id',
      origin: rate.origin || originSearch,
      destination: rate.destination || destinationSearch,
      containerSize: rate.containerSize || rate['container size'] || '',
      price: rate.price,
      freeDays: rate.freeDays || rate['free days'] || 0,
      perDiem: rate.perDiem || rate['per diem'] || '',
      quantity: 1
    };

    addToCartMutation.mutate(leaseData);
  };

  const handleSectionChange = (section: string) => {
    if (section === activeSection) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSection(section);
      setContentKey(prev => prev + 1);
      setIsTransitioning(false);
    }, 150);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
          </div>
        );

      case 'analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-[#001937]">Analytics Dashboard</CardTitle>
              <CardDescription>Container leasing performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-teal-50 border-teal-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Container className="w-5 h-5 text-[#33d2b9]" />
                      <h3 className="font-semibold">Total Containers</h3>
                    </div>
                    <p className="text-2xl font-bold text-[#33d2b9] mt-2">
                      {(userAnalytics as any)?.totalContainers || 0}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold">Revenue</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      ${(userAnalytics as any)?.totalValue || '0.00'}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold">Active Leases</h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {(userAnalytics as any)?.activeLeases || 0}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#001937]">Contract Calendar</CardTitle>
                    <CardDescription>Track your leasing contracts and important dates</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setShowContractModal(true)}
                    className="bg-[#001937] hover:bg-[#002851] text-white"
                  >
                    Activate Contract
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ContractCalendar contracts={userContracts} />
              </CardContent>
            </Card>
          </div>
        );

      case 'tracking':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#001937]">Container Pickup & Tracking</CardTitle>
                    <CardDescription>Track individual containers from depot pickup through return</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userContracts.length > 0 ? (
                    userContracts.map((contract: any) => (
                      <Card key={contract.id} className="border-l-4 border-l-blue-600">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">Contract #{contract.contractNumber}</CardTitle>
                              <CardDescription>
                                {contract.origin} → {contract.destination} | {contract.containerSize} | Status: {contract.status}
                              </CardDescription>
                            </div>
                            <Button 
                              onClick={() => {
                                setSelectedContractForPickup(contract);
                                setShowPickupModal(true);
                              }}
                              className="bg-[#001937] hover:bg-[#002851] text-white"
                            >
                              Add Container
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ContainerTrackingList contractId={contract.id} />
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Container className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Contracts</h3>
                        <p className="text-gray-600 mb-4">You need active contracts to track containers</p>
                        <Button 
                          onClick={() => setActiveSection('calendar')}
                          className="bg-[#001937] hover:bg-[#002851] text-white"
                        >
                          View Calendar
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#001937]">Automated Per Diem Billing</CardTitle>
                <CardDescription>
                  Manage automated billing for containers past their free days ($5 per day per container)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BillingDashboard />
              </CardContent>
            </Card>
          </div>
        );

      case 'management':
        return <ContainerManagement />;

      case 'reports':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#001937]">Leasing Reports</CardTitle>
                <CardDescription>Generate and download comprehensive leasing reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="w-8 h-8 text-blue-600" />
                        <h3 className="font-semibold text-lg">Revenue Report</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Monthly and yearly revenue analysis with profit margins</p>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Container className="w-8 h-8 text-green-600" />
                        <h3 className="font-semibold text-lg">Container Utilization</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Track container usage rates and efficiency metrics</p>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-8 h-8 text-purple-600" />
                        <h3 className="font-semibold text-lg">Contract Summary</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Detailed breakdown of active and expired contracts</p>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-8 h-8 text-orange-600" />
                        <h3 className="font-semibold text-lg">Overdue Returns</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Containers pending return with penalty calculations</p>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <MapPin className="w-8 h-8 text-teal-600" />
                        <h3 className="font-semibold text-lg">Geographic Analysis</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Regional performance and depot utilization stats</p>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-8 h-8 text-red-600" />
                        <h3 className="font-semibold text-lg">Custom Report</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Build custom reports with selected metrics and filters</p>
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Create Custom
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#001937]">Document Management</CardTitle>
                <CardDescription>Manage contracts, invoices, and leasing documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Document Categories */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Document Categories</h3>
                    
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-blue-600" />
                            <div>
                              <h4 className="font-medium">Lease Contracts</h4>
                              <p className="text-sm text-gray-600">No contracts yet</p>
                            </div>
                          </div>
                          <Badge variant="outline">Empty</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-green-600" />
                            <div>
                              <h4 className="font-medium">Invoices</h4>
                              <p className="text-sm text-gray-600">No invoices yet</p>
                            </div>
                          </div>
                          <Badge variant="outline">Empty</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-purple-600" />
                            <div>
                              <h4 className="font-medium">Insurance Documents</h4>
                              <p className="text-sm text-gray-600">No policies yet</p>
                            </div>
                          </div>
                          <Badge variant="outline">Empty</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-orange-600" />
                            <div>
                              <h4 className="font-medium">Compliance Reports</h4>
                              <p className="text-sm text-gray-600">No reports yet</p>
                            </div>
                          </div>
                          <Badge variant="outline">Empty</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Documents */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Recent Documents</h3>
                    
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <h4 className="font-medium mb-2">No Documents Available</h4>
                      <p className="text-sm mb-4">
                        Documents will appear here when you complete container lease transactions, create contracts, and process invoices.
                      </p>
                      <p className="text-xs text-gray-400">
                        • Lease contracts from activated agreements<br/>
                        • Invoices from billing cycles<br/>
                        • Insurance documents from policy activations<br/>
                        • Compliance reports from audits
                      </p>
                    </div>

                    <Button className="w-full bg-[#001937] hover:bg-[#002851] text-white">
                      Upload New Document
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#001937]">Email Management</CardTitle>
                <CardDescription>Send notifications and manage email communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Email Templates */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Email Templates</h3>
                    
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <h4 className="font-medium">Contract Renewal Notice</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Automated reminder for upcoming contract renewals</p>
                        <Button size="sm" variant="outline">Use Template</Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <h4 className="font-medium">Overdue Return Alert</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Notification for containers past return date</p>
                        <Button size="sm" variant="outline">Use Template</Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <h4 className="font-medium">Payment Confirmation</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Receipt and confirmation of payment received</p>
                        <Button size="sm" variant="outline">Use Template</Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <h4 className="font-medium">Welcome Message</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">New customer onboarding and welcome email</p>
                        <Button size="sm" variant="outline">Use Template</Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Compose Email */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Compose Email</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email-to">To</Label>
                        <Input id="email-to" placeholder="recipient@example.com" />
                      </div>
                      
                      <div>
                        <Label htmlFor="email-subject">Subject</Label>
                        <Input id="email-subject" placeholder="Email subject" />
                      </div>
                      
                      <div>
                        <Label htmlFor="email-body">Message</Label>
                        <textarea 
                          id="email-body"
                          className="w-full p-3 border border-gray-300 rounded-md resize-none"
                          rows={8}
                          placeholder="Type your message here..."
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-[#33d2b9] hover:bg-[#2bc4a8] text-white">
                          Send Email
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Save Draft
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Email Activity */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Recent Email Activity</h3>
                  <div className="text-center py-6 text-gray-500">
                    <Mail className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <h4 className="font-medium mb-2">No Email Activity</h4>
                    <p className="text-sm text-gray-400">
                      Email communications will appear here when you send contract notices, renewal alerts, and payment confirmations to customers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return <OrganizationalSettings />;

      case 'employee-management':
        return <EmployeeManagement />;

      default:
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-[#001937] mb-4">
                Section Not Found
              </h3>
              <p className="text-gray-600">
                The requested section is not available.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'tracking', label: 'Container Tracking', icon: MapPin },
    { id: 'billing', label: 'Automated Billing', icon: DollarSign },
    { id: 'management', label: 'Container Management', icon: Container },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'documents', label: 'Documents', icon: LuContainer },
    { id: 'email', label: 'Email', icon: Mail },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      hasSubmenu: true,
      submenu: [
        { id: 'settings', label: 'Organization Settings', icon: Settings },
        { id: 'employee-management', label: 'Employee Management', icon: Users }
      ]
    }
  ];

  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        


        {/* Hero Section - Always shown first */}
        <section 
          className="relative text-white py-16 px-6 lg:px-8 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 25, 55, 0.7), rgba(0, 25, 55, 0.7)), url('/attached_assets/Leasing Manager_1749838164409.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            boxShadow: '0 3px 15px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Leasing Manager
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Comprehensive container leasing management platform with advanced analytics, automated contract tracking and intelligent billing systems.
              </p>
            </div>
          </div>
        </section>

        {/* Navigation and Content Layout */}
        <section className="py-4 sm:py-8">
          <div className="container mx-auto px-3 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
              {/* Mobile: Horizontal Navigation */}
              <div 
                className="block lg:hidden w-full p-4 rounded-xl shadow-lg mb-4"
                style={{
                  background: 'linear-gradient(135deg, #001937 0%, #4a90e2 100%)'
                }}
              >
                <h2 className="text-base font-semibold text-white mb-3">Navigation</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {navigationTabs.map((tab, index) => {
                    const iconColors = [
                      'text-yellow-300', 'text-green-300', 'text-blue-300', 'text-cyan-300',
                      'text-red-300', 'text-purple-300', 'text-orange-300', 'text-indigo-300',
                      'text-emerald-300', 'text-pink-300'
                    ];
                    
                    const IconComponent = tab.icon;
                    const isActive = activeSection === tab.id;
                    const iconColor = iconColors[index % iconColors.length];
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleSectionChange(tab.id)}
                        className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-center transition-all duration-200 ${
                          isActive 
                            ? 'bg-white/20 text-white shadow-md' 
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <IconComponent className={`h-4 w-4 ${iconColor}`} />
                        <span className="text-xs font-medium leading-tight">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Desktop: Vertical Navigation */}
              <div 
                className="hidden lg:block w-64 p-6 rounded-2xl shadow-lg flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #001937 0%, #4a90e2 100%)'
                }}
              >
                <h2 className="text-lg font-semibold text-white mb-4">Navigation</h2>
                <nav className="space-y-2">
                  {navigationTabs.map((tab, index) => {
                    const iconColors = [
                      'text-yellow-300', // Dashboard - yellow
                      'text-green-300',  // Analytics - green
                      'text-blue-300',   // Calendar - blue
                      'text-cyan-300',   // Container Tracking - cyan
                      'text-red-300',    // Automated Billing - red
                      'text-purple-300', // Container Management - purple
                      'text-orange-300', // Reports - orange
                      'text-indigo-300', // Documents - indigo
                      'text-emerald-300', // Email - emerald
                      'text-pink-300'    // Settings - pink
                    ];
                    
                    const IconComponent = tab.icon;
                    const isActive = activeSection === tab.id;
                    const iconColor = iconColors[index % iconColors.length];
                    const isExpanded = expandedMenus.includes(tab.id);
                    const hasSubmenu = tab.hasSubmenu && tab.submenu;
                    
                    return (
                      <div key={tab.id}>
                        <button
                          onClick={() => {
                            if (hasSubmenu) {
                              if (isExpanded) {
                                setExpandedMenus(prev => prev.filter(id => id !== tab.id));
                              } else {
                                setExpandedMenus(prev => [...prev, tab.id]);
                              }
                            } else {
                              handleSectionChange(tab.id);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                            isActive
                              ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                              : 'text-white/80 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent className={`w-4 h-4 ${iconColor}`} />
                            <span className="text-sm font-medium">{tab.label}</span>
                          </div>
                          {hasSubmenu && (
                            <div className="transition-transform duration-200">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-white/60" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-white/60" />
                              )}
                            </div>
                          )}
                        </button>
                        
                        {hasSubmenu && isExpanded && (
                          <div className="ml-4 mt-2 space-y-1">
                            {tab.submenu.map((subItem) => {
                              const SubIconComponent = subItem.icon;
                              const isSubActive = activeSection === subItem.id;
                              
                              return (
                                <button
                                  key={subItem.id}
                                  onClick={() => handleSectionChange(subItem.id)}
                                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 text-left ${
                                    isSubActive
                                      ? 'bg-white/15 text-white shadow-md backdrop-blur-sm'
                                      : 'text-white/70 hover:bg-white/8 hover:text-white'
                                  }`}
                                >
                                  <SubIconComponent className={`w-3 h-3 ${iconColor}`} />
                                  <span className="text-xs font-medium">{subItem.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Right: Content Area */}
              <div className="flex-1">
                {/* Dashboard Analytics and Search - Only show when dashboard is active */}
                {activeSection === 'dashboard' && (
                  <div className="space-y-6">
                    {/* Dashboard Analytics - 5 Key Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-blue-600">Total Containers</p>
                              <p className="text-xl font-bold text-blue-900">
                                {(userAnalytics as any)?.totalContainers || 0}
                              </p>
                            </div>
                            <Container className="w-6 h-6 text-blue-600" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-green-600">Active Leases</p>
                              <p className="text-xl font-bold text-green-900">
                                {(userAnalytics as any)?.activeLeases || 0}
                              </p>
                            </div>
                            <FileText className="w-6 h-6 text-green-600" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-purple-600">Revenue</p>
                              <p className="text-xl font-bold text-purple-900">
                                ${((userAnalytics as any)?.totalValue || 0).toLocaleString()}
                              </p>
                            </div>
                            <DollarSign className="w-6 h-6 text-purple-600" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-orange-600">Pending Returns</p>
                              <p className="text-xl font-bold text-orange-900">
                                {(userAnalytics as any)?.pendingReturns || 0}
                              </p>
                            </div>
                            <Clock className="w-6 h-6 text-orange-600" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-teal-600">Global Depots</p>
                              <p className="text-xl font-bold text-teal-900">410</p>
                              <p className="text-xs text-teal-500">89 Countries</p>
                            </div>
                            <MapPin className="w-6 h-6 text-teal-600" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Dynamic Marketing Ad Copy Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 my-6">
                      <div className="text-center max-w-4xl mx-auto">
                        {(() => {
                          const getSectionContent = () => {
                            switch (activeSection as string) {
                              case 'dashboard':
                                return {
                                  title: "Dashboard - Your Container Leasing Command Center",
                                  description: "The Leasing Manager provides a comprehensive overview of your container leasing operations, featuring real-time analytics, contract performance metrics, and actionable insights. Monitor your active leases, track revenue streams, and identify optimization opportunities across your global container portfolio.",
                                  action: "Use the search tools below to find competitive leasing rates and expand your container network across our 410 global depots in 89 countries."
                                };
                              case 'analytics':
                                return {
                                  title: "Analytics - Data-Driven Container Intelligence",
                                  description: "The Analytics section transforms your container leasing data into powerful business insights. Generate detailed reports on revenue trends, container utilization rates, geographic performance, and contract summaries to make informed strategic decisions.",
                                  action: "Access comprehensive reporting tools and leverage advanced analytics to optimize your container leasing strategy with up to 35% cost savings."
                                };
                              case 'documents':
                                return {
                                  title: "Documents - Centralized Contract Management",
                                  description: "The Documents section provides secure, organized access to all your container leasing paperwork including lease agreements, invoices, insurance policies, and compliance reports. Streamline document workflows and maintain audit-ready records.",
                                  action: "Manage your document library efficiently while discovering new leasing opportunities through our global marketplace search below."
                                };
                              case 'settings':
                                return {
                                  title: "Settings - Platform Configuration & Team Management",
                                  description: "The Settings section allows you to customize your leasing platform experience, manage employee access with role-based permissions, configure billing preferences, and maintain account security. Control every aspect of your container leasing operations.",
                                  action: "Configure your platform settings and explore new container leasing opportunities to maximize your operational efficiency across global trade routes."
                                };
                              default:
                                return {
                                  title: "Container Leasing Management Platform",
                                  description: "Access the world's most comprehensive container leasing network with real-time pricing from over 410 global depots across 89 countries. Our advanced platform provides instant market insights, automated tracking, and streamlined management.",
                                  action: "Discover competitive leasing rates tailored to your specific trade routes and unlock the power of data-driven container logistics."
                                };
                            }
                          };
                          
                          const content = getSectionContent();
                          
                          return (
                            <>
                              <h3 className="text-xl font-bold text-[#001937] mb-3 flex items-center justify-center gap-3">
                                {(() => {
                                  const iconColors = [
                                    'text-yellow-500', // Dashboard - yellow
                                    'text-green-500',  // Analytics - green
                                    'text-blue-500',   // Calendar - blue
                                    'text-cyan-500',   // Container Tracking - cyan
                                    'text-red-500',    // Reports - red
                                    'text-purple-500', // Documents - purple
                                    'text-orange-500', // Email - orange
                                    'text-pink-500'    // Settings - pink
                                  ];
                                  
                                  const icons = [
                                    BarChart3,     // Dashboard
                                    Activity,      // Analytics
                                    Calendar,      // Calendar
                                    LuContainer,   // Container Tracking
                                    FileText,      // Reports
                                    FileText,      // Documents
                                    Mail,          // Email
                                    Settings       // Settings
                                  ];
                                  
                                  const sectionIndex = ['dashboard', 'analytics', 'calendar', 'tracking', 'reports', 'documents', 'email', 'settings'].indexOf(activeSection);
                                  const IconComponent = icons[sectionIndex] || BarChart3;
                                  const iconColor = iconColors[sectionIndex] || 'text-yellow-500';
                                  
                                  return <IconComponent className={`w-6 h-6 ${iconColor}`} />;
                                })()}
                                {content.title}
                              </h3>
                              <div className="text-gray-700 space-y-3">
                                <p className="leading-relaxed">
                                  {content.description}
                                </p>
                                <p className="leading-relaxed">
                                  {content.action}
                                </p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Container Leasing Search Section */}
                    <Card className="bg-gradient-to-br from-[#001937] to-[#4a90e2] text-white">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Container Leasing Search</CardTitle>
                        <CardDescription className="text-blue-100">
                          Find available container leasing rates by specifying origin and destination ports. 
                          <br className="hidden sm:block" />
                          <span className="text-sm opacity-80">Note: Destination options update automatically based on selected origin port.</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                          <div>
                            <Label htmlFor="origin-search" className="text-[#33d2b9] font-medium text-sm">Origin Port</Label>
                            <Select
                              value={originSearch}
                              onValueChange={(value) => setOriginSearch(value)}
                            >
                              <SelectTrigger className="bg-white text-black text-sm">
                                <SelectValue placeholder="Select origin port" />
                              </SelectTrigger>
                              <SelectContent>
                                {origins.map((origin: string) => (
                                  <SelectItem key={origin} value={origin}>
                                    {origin}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="destination-search" className="text-[#33d2b9] font-medium text-sm">Destination Port</Label>
                            <Select
                              value={destinationSearch}
                              onValueChange={(value) => setDestinationSearch(value)}
                            >
                              <SelectTrigger className="bg-white text-black text-sm">
                                <SelectValue placeholder={
                                  originSearch ? 
                                    `${destinations.length} destinations available` : 
                                    "Select destination port"
                                } />
                              </SelectTrigger>
                              <SelectContent>
                                {destinations.map((destination: string) => (
                                  <SelectItem key={destination} value={destination}>
                                    {destination}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="md:col-span-2 flex items-end">
                            <Button 
                              onClick={handleSearchLeasingRates}
                              disabled={searchLoading}
                              className="bg-[#33d2b9] hover:bg-[#2bc4a8] text-white w-full"
                              size="sm"
                            >
                              {searchLoading ? (
                                <>
                                  <Search className="w-4 h-4 mr-2 animate-spin" />
                                  Searching...
                                </>
                              ) : (
                                <>
                                  <Search className="w-4 h-4 mr-2" />
                                  Search Leasing Rates
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Search Results Display */}
                        {searchResults.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-lg font-semibold text-white mb-4">
                              Search Results ({searchResults.length} found)
                            </h4>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {searchResults.map((rate: any, index: number) => (
                                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                                  <CardContent className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                                      <div>
                                        <p className="text-xs text-blue-200">Origin</p>
                                        <p className="font-medium text-white">{rate.origin || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-blue-200">Destination</p>
                                        <p className="font-medium text-white">{rate.destination || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-blue-200">Container Size</p>
                                        <p className="font-medium text-white">{rate.containerSize || rate['container size'] || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-blue-200">Price</p>
                                        <p className="font-medium text-[#33d2b9]">{rate.price?.toString().startsWith('$') ? rate.price : `$${rate.price}` || 'N/A'}</p>
                                        <p className="text-xs text-blue-200">
                                          {rate.freeDays || rate['free days'] || 0} free days
                                        </p>
                                      </div>
                                      <div className="flex justify-end">
                                        <Button
                                          onClick={() => handleAddToCart(rate)}
                                          disabled={addToCartMutation.isPending}
                                          className="bg-[#33d2b9] hover:bg-[#2bc4a8] text-white"
                                          size="sm"
                                        >
                                          {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchResults.length === 0 && searchLoading === false && (originSearch || destinationSearch) && (
                          <div className="mt-6 text-center">
                            <p className="text-blue-200">No leasing rates found for your search criteria. Try different ports or check spelling.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Other sections content */}
                {activeSection !== 'dashboard' && (
                  <div 
                    key={contentKey}
                    className={`transition-all duration-300 ${
                      isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                    }`}
                  >
                    {renderContent()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
        
        <CartModal 
          isOpen={showCartModal} 
          onClose={() => setShowCartModal(false)} 
          mode="b2b"
        />

        <AddToCartConfirmModal
          isOpen={showAddToCartConfirm}
          onClose={() => setShowAddToCartConfirm(false)}
          onProceedToCart={handleProceedToCart}
          onContinueShopping={handleContinueShopping}
          item={pendingCartItem}
        />
        
        <ContractActivationModal
          cartItems={simpleCartItems}
          isOpen={showContractModal}
          onClose={() => setShowContractModal(false)}
        />
        
        {selectedContractForPickup && (
          <ContainerPickupModal
            isOpen={showPickupModal}
            onClose={() => {
              setShowPickupModal(false);
              setSelectedContractForPickup(null);
            }}
            contractId={selectedContractForPickup.id}
            contractNumber={selectedContractForPickup.contractNumber}
          />
        )}
      </div>
  );
}
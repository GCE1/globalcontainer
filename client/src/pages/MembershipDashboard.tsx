import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Settings, LogOut, Calendar, CreditCard, Shield, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubscriptionManager from '@/components/SubscriptionManager';

export default function MembershipDashboard() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (userData && token) {
      setUser(JSON.parse(userData));
    } else {
      // Redirect to payment if no user data
      setLocation('/payment');
    }

    // Check for payment success notification
    const paymentSuccessFlag = localStorage.getItem('showPaymentSuccess');
    const paymentDetailsData = localStorage.getItem('paymentDetails');
    
    if (paymentSuccessFlag === 'true' && paymentDetailsData) {
      setShowPaymentSuccess(true);
      setPaymentDetails(JSON.parse(paymentDetailsData));
      
      // Clear the flags
      localStorage.removeItem('showPaymentSuccess');
      localStorage.removeItem('paymentDetails');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    setLocation('/');
  };

  const handleAccessService = (service: string) => {
    toast({
      title: "Access Granted",
      description: `Redirecting to ${service}...`,
    });
    
    // Redirect to appropriate service
    switch (service) {
      case 'Container Search':
        setLocation('/');
        break;
      case 'Leasing Manager':
        setLocation('/leasing');
        break;
      case 'Wholesale Manager':
        setLocation('/wholesale');
        break;
      default:
        setLocation('/');
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'pro':
        return 'bg-purple-100 text-purple-800';
      case 'expert':
        return 'bg-blue-100 text-blue-800';
      case 'insights':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierServices = (tier: string) => {
    switch (tier) {
      case 'pro':
        return ['Wholesale Manager', 'Leasing Manager', 'Container Search'];
      case 'expert':
        return ['Wholesale Manager', 'Leasing Manager', 'Container Search'];
      case 'insights':
        return []; // Container Search removed from insights tier per user request
      default:
        return [];
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your membership...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Payment Success Alert */}
          {showPaymentSuccess && paymentDetails && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <strong className="text-green-800">Payment Successful!</strong>
                  <p className="text-green-700 mt-1">
                    Your {paymentDetails.tier} membership ($${paymentDetails.amount}/month) has been activated successfully.
                    <br />
                    <span className="text-sm font-mono">Payment ID: {paymentDetails.paymentId}</span>
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowPaymentSuccess(false)}
                  className="text-green-600 hover:text-green-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome, {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getTierBadgeColor(user.subscriptionTier)}>
                      {user.subscriptionTier} Membership
                    </Badge>
                    <Badge variant="secondary">
                      {user.subscriptionStatus}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Services Grid - Only show if user has actual paid membership services */}
          {getTierServices(user.subscriptionTier).length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {getTierServices(user.subscriptionTier).map((service) => (
                <Card key={service} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span>{service}</span>
                    </CardTitle>
                    <CardDescription>
                      Access your {service.toLowerCase()} features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleAccessService(service)}
                      className="w-full"
                    >
                      Access Service
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Message for users without paid services (like after cart purchases) */}
          {getTierServices(user.subscriptionTier).length === 0 && (
            <Card className="mb-6">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Welcome to Global Container Exchange!</h3>
                <p className="text-gray-600 mb-4">
                  Your account has been created successfully. To access additional services like Wholesale Manager, 
                  Leasing Manager, and Container Search, please consider upgrading to one of our membership plans.
                </p>
                <Button 
                  onClick={() => setLocation('/membership')}
                  className="bg-[#001937] hover:bg-[#42d1bd]"
                >
                  View Membership Plans
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Subscription Management */}
          <SubscriptionManager className="mb-6" />

          {/* Account Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Account Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{user.firstName} {user.lastName}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Membership</label>
                  <p className="text-gray-900 capitalize">{user.subscriptionTier}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Billing Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-gray-900 capitalize">{user.subscriptionStatus}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Next Billing</label>
                  <p className="text-gray-900">Monthly billing active</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Billing
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ErrorHandler } from "@/lib/errorHandler";


import Navbar from "@/components/Navbar";
import PayPalButton from "@/components/PayPalButton";
import PaymentSuccess from "@/components/PaymentSuccess";
import EmailLogin from "@/components/EmailLogin";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

interface CustomerData {
  customerId: number | null;
  tier: string;
  price: number;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  token?: string | null;
}

// Account creation form schema
const accountFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  companyName: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Payment() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<string>("insights");
  const [monthlyPrice, setMonthlyPrice] = useState<number>(49);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [showAccountForm, setShowAccountForm] = useState(true);
  const [paymentId, setPaymentId] = useState<string>('');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);
  
  // Initialize error handler
  const errorHandler = ErrorHandler.getInstance();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tier = params.get('tier') || 'insights';
    setSelectedTier(tier);
    
    const prices = { insights: 49, pro: 199, expert: 149 };
    setMonthlyPrice(prices[tier as keyof typeof prices] || 49);

    // Check if customer data is already provided
    const customerParam = params.get('customer');
    if (customerParam) {
      try {
        const data = JSON.parse(decodeURIComponent(customerParam));
        setCustomerData(data);
        setShowAccountForm(false);
      } catch (error) {
        console.error('Error parsing customer data:', error);
        errorHandler.logError(error as Error, 'customer-data-parsing');
      }
    }
  }, []);

  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      phone: "",
    },
  });

  const createAccountMutation = useMutation({
    mutationFn: async (data: z.infer<typeof accountFormSchema>) => {
      const { confirmPassword, ...accountData } = data;
      
      console.log('Collecting customer data:', accountData);
      
      // Collect customer data for payment processing (no authentication yet)
      const customerResponse = await apiRequest("POST", "/api/auth/register", {
        email: accountData.email,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        tier: selectedTier,
        price: monthlyPrice
      });
      
      if (!customerResponse.ok) {
        const errorData = await customerResponse.text();
        console.error('Customer data collection error:', errorData);
        throw new Error(`Data collection failed: ${errorData}`);
      }
      
      return customerResponse.json();
    },
    onSuccess: (data) => {
      const newCustomerData = {
        customerId: null, // Will be set after payment
        tier: selectedTier,
        price: monthlyPrice,
        email: data.customerData.email,
        name: `${data.customerData.firstName} ${data.customerData.lastName}`,
        firstName: data.customerData.firstName,
        lastName: data.customerData.lastName,
        token: null // Will be set after payment
      };
      
      setCustomerData(newCustomerData);
      setShowAccountForm(false);
      
      toast({
        title: "Information Collected",
        description: "Please proceed with payment to activate your membership.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Information Collection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getTierDisplayName = (tier: string) => {
    const names = {
      insights: "Insights",
      pro: "Professional",
      expert: "Expert"
    };
    return names[tier as keyof typeof names] || "Insights";
  };

  const mapTierToMembershipTier = (tier: string): 'insights' | 'expert' | 'pro' => {
    if (tier === 'pro') return 'pro';
    if (tier === 'expert') return 'expert';
    return 'insights';
  };

  const getTierFeatures = (tier: string) => {
    const features = {
      insights: [
        "Advanced search filters",
        "Price analytics and trends",
        "Export functionality",
        "Email support"
      ],
      pro: [
        "All Insights features",
        "Bulk operations",
        "Wholesale Manager access",
        "Priority support",
        "API access"
      ],
      expert: [
        "All Professional features", 
        "Leasing Manager (exclusive)",
        "Custom reporting",
        "Dedicated account manager",
        "White-label options"
      ]
    };
    return features[tier as keyof typeof features] || features.insights;
  };

  const handlePaymentSuccess = (paymentIdResult: string) => {
    setPaymentId(paymentIdResult);
    setShowPaymentSuccess(true);
  };

  const handleAuthSuccess = (userData: any) => {
    setAuthenticatedUser(userData);
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('token', userData.token);
  };

  // Show payment success screen
  if (showPaymentSuccess && customerData) {
    return (
      <PaymentSuccess
        customerData={{
          email: customerData.email,
          firstName: customerData.firstName || '',
          lastName: customerData.lastName || '',
          tier: customerData.tier,
          price: customerData.price
        }}
        paymentId={paymentId}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  if (showAccountForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Create Your Account</CardTitle>
                <CardDescription>
                  Create an account to access your {getTierDisplayName(selectedTier)} membership (${monthlyPrice}/month)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => createAccountMutation.mutate(data))} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={createAccountMutation.isPending}
                    >
                      {createAccountMutation.isPending ? "Collecting Information..." : "Save Information & Continue"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!customerData) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Complete Your Payment
              </CardTitle>
              <CardDescription className="text-center text-lg">
                {getTierDisplayName(customerData.tier)} Subscription - ${customerData.price}/month
              </CardDescription>
            </CardHeader>
          </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Plan:</span>
                <span>{getTierDisplayName(customerData.tier)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Customer:</span>
                <span>{customerData.firstName} {customerData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{customerData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Billing:</span>
                <span>Monthly</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${customerData.price}/month</span>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Plan Features:</h4>
                <ul className="space-y-2">
                  {getTierFeatures(customerData.tier).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Complete Your Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Payment</CardTitle>
              <CardDescription>
                Choose your payment method to activate your membership
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Terms and Conditions Checkbox */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Checkbox
                  id="payment-terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  className="mt-1"
                />
                <label
                  htmlFor="payment-terms"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  I agree to the{" "}
                  <a href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  . My subscription will begin immediately and will auto-renew monthly until cancelled.
                </label>
              </div>

              {/* Payment Methods Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Payment Methods</h3>
                <div className="p-4 bg-white rounded-lg border">
                  {acceptedTerms ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">Choose your preferred payment method:</p>
                        
                        {/* PayPal Payment */}
                        <PayPalButton 
                          customerData={{
                            email: customerData.email,
                            firstName: customerData.firstName || '',
                            lastName: customerData.lastName || '',
                            tier: customerData.tier,
                            price: customerData.price
                          }}
                          onPaymentSuccess={handlePaymentSuccess}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-100 rounded-lg text-center">
                      <p className="text-gray-600">Please accept the Terms of Service and Privacy Policy to view payment options.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-600 text-center mt-4">
                <p>✓ Secure 256-bit SSL encryption</p>
                <p>✓ Cancel anytime</p>
                <p>✓ 30-day money-back guarantee</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="w-full border-2 bg-[#001937] hover:bg-[#33d2b9] text-white hover:text-white border-[#001937] hover:border-[#33d2b9] px-4 py-2 rounded-lg flex items-center transition duration-300 h-auto group justify-center"
              >
                Back to Subscription Plans
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
      <Footer />
    </div>
    </ErrorBoundary>
  );
}
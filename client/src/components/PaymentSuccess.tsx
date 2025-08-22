import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';

interface PaymentSuccessProps {
  customerData: {
    email: string;
    firstName: string;
    lastName: string;
    tier: string;
    price: number;
  };
  paymentId: string;
  onAuthSuccess: (userData: any) => void;
}

export default function PaymentSuccess({ customerData, paymentId, onAuthSuccess }: PaymentSuccessProps) {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  
  const createAccountMutation = useMutation({
    mutationFn: async () => {
      console.log('Creating account after payment:', { customerData, paymentId });
      
      const response = await apiRequest("POST", "/api/payment/create-account", {
        email: customerData.email,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        tier: customerData.tier,
        paymentId,
        amount: customerData.price
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Payment registration error:', errorData);
        throw new Error(`Account creation failed: ${errorData}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Account created successfully:', data);
      
      // Store auth token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('token', data.token);
      
      // Store success flag for dashboard notification
      localStorage.setItem('showPaymentSuccess', 'true');
      localStorage.setItem('paymentDetails', JSON.stringify({
        tier: customerData.tier,
        amount: customerData.price,
        paymentId: paymentId
      }));
      
      // Call success callback
      onAuthSuccess(data);
      
      // Redirect immediately to membership dashboard
      setLocation('/membership-dashboard');
    },
    onError: (error: Error) => {
      console.error('Account creation error:', error);
      toast({
        title: "Account Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  useEffect(() => {
    // Create account after successful payment
    createAccountMutation.mutate();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {createAccountMutation.isPending ? (
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            ) : (
              <CheckCircle className="w-16 h-16 text-green-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {createAccountMutation.isPending ? 'Processing Payment' : 'Payment Successful!'}
          </CardTitle>
          <CardDescription>
            {createAccountMutation.isPending 
              ? 'Creating your account and activating your membership...'
              : 'Your membership has been activated successfully.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{customerData.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Plan:</span>
              <span>{customerData.tier}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span>${customerData.price}/month</span>
            </div>
            <div className="flex justify-between">
              <span>Payment ID:</span>
              <span className="font-mono text-xs">{paymentId}</span>
            </div>
          </div>
          
          {createAccountMutation.isSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">
                Redirecting to your membership dashboard...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
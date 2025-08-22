import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign, AlertTriangle } from 'lucide-react';
import { ErrorHandler } from '@/lib/errorHandler';

interface PaymentSimulatorProps {
  customerData: {
    email: string;
    firstName: string;
    lastName: string;
    tier: string;
    price: number;
  };
  onPaymentSuccess: (paymentId: string) => void;
}

export default function PaymentSimulator({ customerData, onPaymentSuccess }: PaymentSimulatorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const errorHandler = ErrorHandler.getInstance();
  
  useEffect(() => {
    // Suppress MetaMask connection errors during payment
    errorHandler.suppressError('MetaMask');
    errorHandler.suppressError('chrome-extension');
  }, []);
  
  const simulatePayment = async () => {
    try {
      setIsProcessing(true);
      setHasError(false);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock payment ID
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      setIsProcessing(false);
      onPaymentSuccess(paymentId);
    } catch (error) {
      setIsProcessing(false);
      setHasError(true);
      errorHandler.logError(error as Error, 'payment-processing');
      console.error('Payment simulation failed:', error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Method
        </CardTitle>
        <CardDescription>
          Complete your payment to activate your membership
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold text-blue-900 mb-2">Payment Summary</h3>
          <div className="space-y-1 text-sm text-blue-800">
            <div className="flex justify-between">
              <span>Plan:</span>
              <span className="font-medium">{customerData.tier}</span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Price:</span>
              <span className="font-medium">${customerData.price}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-medium">{customerData.firstName} {customerData.lastName}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            <strong>Demo Mode:</strong> Payment processing is simulated. In production, this would integrate with PayPal, Stripe, or other payment providers.
          </p>
        </div>
        
        {hasError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-4 h-4" />
              <p className="text-sm">
                <strong>Error:</strong> Payment processing failed. Please try again.
              </p>
            </div>
          </div>
        )}
        
        <Button 
          onClick={simulatePayment} 
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              Pay ${customerData.price}/month
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
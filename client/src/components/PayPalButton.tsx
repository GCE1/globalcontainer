import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons, FUNDING } from '@paypal/react-paypal-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';

interface PayPalButtonProps {
  customerData: {
    email: string;
    firstName: string;
    lastName: string;
    tier: string;
    price: number;
  };
  onPaymentSuccess: (paymentId: string) => void;
}

export default function PayPalButton({ customerData, onPaymentSuccess }: PayPalButtonProps) {
  const [clientId, setClientId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox');

  useEffect(() => {
    // Get PayPal client configuration
    const fetchClientConfig = async () => {
      try {
        const response = await fetch('/api/paypal/config');
        const data = await response.json();
        
        if (data.success) {
          setClientId(data.clientId);
          setEnvironment(data.environment);
          setIsLoading(false);
        } else {
          setError('PayPal configuration unavailable');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('PayPal config error:', err);
        setError('Failed to load PayPal configuration');
        setIsLoading(false);
      }
    };

    fetchClientConfig();
  }, []);

  const createOrder = async () => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: customerData.price,
          description: `${customerData.tier} Membership - ${customerData.firstName} ${customerData.lastName}`
        })
      });
      
      const data = await response.json();

      if (data.success) {
        return data.orderId;
      } else {
        throw new Error(data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Create order error:', error);
      setError('Failed to create payment order');
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      const response = await fetch(`/api/paypal/capture-order/${data.orderID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerData: {
            tier: customerData.tier,
            email: customerData.email,
            firstName: customerData.firstName,
            lastName: customerData.lastName
          }
        })
      });
      
      const result = await response.json();

      if (result.success) {
        onPaymentSuccess(result.captureId || data.orderID);
      } else {
        throw new Error(result.error || 'Payment capture failed');
      }
    } catch (error) {
      console.error('Payment capture error:', error);
      setError('Payment processing failed');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading payment options...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !clientId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="w-5 h-5" />
            Payment Temporarily Unavailable
          </CardTitle>
          <CardDescription>
            {error || 'PayPal integration is currently being configured.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-md mb-4">
            <h3 className="font-semibold text-orange-900 mb-2">Alternative Payment Options</h3>
            <p className="text-sm text-orange-800 mb-3">
              Please contact us directly to complete your subscription:
            </p>
            <div className="space-y-1 text-sm text-orange-800">
              <p><strong>Email:</strong> support@globalcontainerexchange.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </div>
          <Button 
            className="w-full"
            onClick={() => window.location.href = 'mailto:support@globalcontainerexchange.com?subject=Membership Subscription&body=I would like to subscribe to the ' + customerData.tier + ' membership plan ($' + customerData.price + '/month).'}
          >
            Contact Support
          </Button>
        </CardContent>
      </Card>
    );
  }

  const paypalOptions = {
    clientId: clientId,
    currency: 'USD',
    intent: 'capture',
    dataClientToken: undefined,
    environment: environment
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Complete Payment
        </CardTitle>
        <CardDescription>
          {environment === 'production' ? (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              Live Payment Processing
            </span>
          ) : (
            <span className="text-orange-600">
              Sandbox Mode - Test Payments Only
            </span>
          )}
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

        <PayPalScriptProvider options={paypalOptions}>
          <PayPalButtons
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal',
              height: 50
            }}
            fundingSource={FUNDING.PAYPAL}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={(err) => {
              console.error('PayPal Button Error:', err);
              setError('Payment processing error occurred');
            }}
          />
        </PayPalScriptProvider>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
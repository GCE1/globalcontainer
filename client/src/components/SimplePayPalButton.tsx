import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    paypal: any;
  }
}

interface SimplePayPalButtonProps {
  amount: string;
  currency: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

export default function SimplePayPalButton({
  amount,
  currency,
  onSuccess,
  onError,
  onCancel,
}: SimplePayPalButtonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isDestroyed = false;
    
    const loadPayPal = async () => {
      try {
        if (isDestroyed) return;
        setIsLoading(true);
        
        // Get PayPal client ID from backend
        const response = await fetch('/api/paypal/setup');
        if (!response.ok) {
          throw new Error('Failed to get PayPal setup');
        }
        
        const { clientId } = await response.json();
        
        // Load PayPal SDK
        if (!window.paypal) {
          const script = document.createElement('script');
          script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
          script.async = true;
          
          script.onload = () => {
            if (!isDestroyed) renderButton();
          };
          
          script.onerror = () => {
            if (!isDestroyed) {
              setError('Failed to load PayPal');
              setIsLoading(false);
            }
          };
          
          document.head.appendChild(script);
        } else {
          if (!isDestroyed) renderButton();
        }
      } catch (err) {
        if (!isDestroyed) {
          console.error('PayPal loading error:', err);
          setError('Failed to initialize PayPal');
          setIsLoading(false);
        }
      }
    };

    const renderButton = () => {
      if (isDestroyed || !window.paypal || !paypalRef.current) return;
      
      // Clear existing button
      paypalRef.current.innerHTML = '';
      
      window.paypal.Buttons({
        createOrder: async () => {
          try {
            const response = await fetch('/api/paypal/order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [{
                  amount: {
                    currency_code: currency,
                    value: amount,
                  },
                  description: 'Membership Subscription',
                }],
              }),
            });
            
            if (!response.ok) {
              throw new Error('Failed to create order');
            }
            
            const order = await response.json();
            return order.id;
          } catch (err) {
            console.error('Order creation error:', err);
            if (onError) onError(err);
            throw err;
          }
        },
        
        onApprove: async (data: any) => {
          try {
            const response = await fetch(`/api/paypal/order/${data.orderID}/capture`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (!response.ok) {
              throw new Error('Failed to capture order');
            }
            
            const result = await response.json();
            if (onSuccess) onSuccess(result);
            return result;
          } catch (err) {
            console.error('Order capture error:', err);
            if (onError) onError(err);
            throw err;
          }
        },
        
        onError: (err: any) => {
          console.error('PayPal error:', err);
          if (onError) onError(err);
        },
        
        onCancel: () => {
          if (onCancel) onCancel();
        },
        
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
        },
      }).render(paypalRef.current);
      
      setIsLoading(false);
    };

    loadPayPal();
    
    return () => {
      isDestroyed = true;
    };
  }, [amount, currency]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setIsLoading(true);
          }}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
          <span className="text-gray-600">Loading PayPal...</span>
        </div>
      )}
      <div ref={paypalRef} className={`paypal-container ${isLoading ? 'hidden' : ''}`} style={{ minHeight: '45px' }}></div>
      {!isLoading && !error && (
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">Secure payment powered by PayPal</p>
        </div>
      )}
    </div>
  );
}
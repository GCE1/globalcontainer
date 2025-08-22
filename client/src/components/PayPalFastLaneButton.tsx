import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    paypal: any;
  }
}

interface PayPalFastLaneButtonProps {
  amount: string;
  currency: string;
  intent: string;
  description?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  items?: Array<{
    name: string;
    quantity: string;
    unit_amount: {
      currency_code: string;
      value: string;
    };
  }>;
  style?: {
    layout?: "vertical" | "horizontal";
    color?: "gold" | "blue" | "silver" | "white" | "black";
    shape?: "rect" | "pill";
    label?: "paypal" | "checkout" | "buynow" | "pay";
    tagline?: boolean;
    height?: number;
  };
}

export default function PayPalFastLaneButton({
  amount,
  currency,
  intent,
  description,
  onSuccess,
  onError,
  onCancel,
  items,
  style = {
    layout: "vertical",
    color: "gold",
    shape: "rect",
    label: "paypal",
    tagline: false,
    height: 40,
  },
}: PayPalFastLaneButtonProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paypalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const createOrder = async () => {
    try {
      const orderPayload = {
        amount: amount,
        currency: currency,
        intent: intent,
        items: items || [],
      };
      
      const response = await fetch("/api/paypal/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const order = await response.json();
      return order.id;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      setError("Failed to create payment order");
      if (onError) onError(error);
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      const response = await fetch(`/api/paypal/order/${data.orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const orderData = await response.json();
      
      if (onSuccess) {
        onSuccess(orderData);
      }
      
      return orderData;
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      setError("Failed to capture payment");
      if (onError) onError(error);
      throw error;
    }
  };

  const onErrorHandler = (error: any) => {
    console.error("PayPal error:", error);
    setError("Payment failed");
    if (onError) onError(error);
  };

  const onCancelHandler = () => {
    console.log("Payment cancelled");
    if (onCancel) onCancel();
  };

  useEffect(() => {
    const initPayPal = async () => {
      try {
        // Get PayPal configuration from backend
        const setupResponse = await fetch("/api/paypal/setup");
        if (!setupResponse.ok) {
          throw new Error("Failed to get PayPal configuration");
        }
        
        const { clientId } = await setupResponse.json();
        
        // Load PayPal SDK if not already loaded
        if (!window.paypal) {
          const script = document.createElement("script");
          script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&intent=capture`;
          script.async = true;
          
          script.onload = () => {
            renderPayPalButton();
          };
          
          script.onerror = () => {
            setError("Failed to load PayPal SDK");
            setIsLoading(false);
          };
          
          document.head.appendChild(script);
        } else {
          renderPayPalButton();
        }
      } catch (error) {
        console.error("Error initializing PayPal:", error);
        setError("Failed to initialize PayPal");
        setIsLoading(false);
      }
    };

    const renderPayPalButton = () => {
      if (window.paypal && paypalRef.current) {
        // Clear any existing buttons
        paypalRef.current.innerHTML = '';
        
        window.paypal.Buttons({
          createOrder: async () => {
            const response = await fetch("/api/paypal/order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount,
                    },
                    description: description,
                  },
                ],
              }),
            });

            if (!response.ok) {
              throw new Error("Failed to create order");
            }

            const orderData = await response.json();
            return orderData.id;
          },
          onApprove: async (data: any) => {
            const response = await fetch(`/api/paypal/order/${data.orderID}/capture`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              throw new Error("Failed to capture order");
            }

            const orderData = await response.json();
            if (onSuccess) {
              onSuccess(orderData);
            }
            return orderData;
          },
          onError: onErrorHandler,
          onCancel: onCancelHandler,
          style: style,
        }).render(paypalRef.current);
        
        setIsLoading(false);
      }
    };

    initPayPal();
  }, [amount, currency, intent]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setIsLoading(true);
          }}
          className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
          <span className="text-gray-600">Loading PayPal...</span>
        </div>
      )}
      <div ref={paypalRef} className={`paypal-button-container ${isLoading ? "hidden" : ""}`} style={{ minHeight: "50px" }}></div>
    </div>
  );
}
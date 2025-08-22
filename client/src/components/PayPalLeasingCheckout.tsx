import React from "react";
import PayPalFastLaneButton from "./PayPalFastLaneButton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

interface CartItem {
  id: number;
  leasingRecordId: string;
  origin: string;
  destination: string;
  containerSize: string;
  price: string;
  freeDays: number;
  perDiem: string;
  quantity: number;
}

interface PayPalLeasingCheckoutProps {
  cartItems: CartItem[];
  totalAmount: number;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

export default function PayPalLeasingCheckout({
  cartItems,
  totalAmount,
  onSuccess,
  onError,
  onCancel
}: PayPalLeasingCheckoutProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      // Create leasing contracts for each cart item
      for (const item of cartItems) {
        const contractStartDate = new Date().toISOString();
        
        await apiRequest("POST", "/api/contracts/create", {
          orderId: paymentData.id,
          leasingRecordId: item.leasingRecordId,
          origin: item.origin,
          destination: item.destination,
          containerSize: item.containerSize,
          price: item.price,
          freeDays: item.freeDays,
          perDiem: item.perDiem,
          quantity: item.quantity,
          contractStartDate,
          paymentId: paymentData.id
        });
      }

      // Clear cart after successful payment
      await apiRequest("POST", "/api/cart/clear");

      toast({
        title: "Payment Successful",
        description: "Your leasing contracts have been activated with automated billing.",
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error processing leasing payment:", error);
      toast({
        title: "Processing Error",
        description: "Payment successful but contract creation failed. Please contact support.",
        variant: "destructive",
      });
      
      if (onError) {
        onError(error);
      }
    }
  };

  const handlePaymentError = (error: any) => {
    console.error("Leasing payment error:", error);
    toast({
      title: "Payment Failed",
      description: "There was an error processing your leasing payment. Please try again.",
      variant: "destructive",
    });
    
    if (onError) {
      onError(error);
    }
  };

  const handlePaymentCancel = () => {
    toast({
      title: "Payment Cancelled",
      description: "You cancelled the leasing payment process.",
    });
    
    if (onCancel) {
      onCancel();
    }
  };

  // Create items array for PayPal
  const paypalItems = cartItems.map((item) => ({
    name: `${item.containerSize} Container: ${item.origin} → ${item.destination}`,
    quantity: item.quantity.toString(),
    unit_amount: {
      currency_code: "USD",
      value: (parseFloat(item.price.replace(/[$,]/g, '')) / item.quantity).toFixed(2),
    },
  }));

  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Container Leasing Summary</h3>
        <div className="space-y-2 text-sm text-blue-800">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.containerSize} - {item.origin} → {item.destination}</span>
              <span>${(parseFloat(item.price.replace(/[$,]/g, '')) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 font-semibold">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <PayPalFastLaneButton
        amount={totalAmount.toFixed(2)}
        currency="USD"
        intent="CAPTURE"
        description="Container Leasing - Global Container Exchange"
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        onCancel={handlePaymentCancel}
        items={paypalItems}
        style={{
          layout: "horizontal",
          color: "gold",
          shape: "rect",
          label: "paypal",
          tagline: false,
          height: 45,
        }}
      />
    </div>
  );
}
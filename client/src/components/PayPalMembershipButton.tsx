import React from "react";
import PayPalFastLaneButton from "./PayPalFastLaneButton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

interface PayPalMembershipButtonProps {
  planId: string;
  planName: string;
  price: number;
  onSuccess?: () => void;
}

export default function PayPalMembershipButton({
  planId,
  planName,
  price,
  onSuccess
}: PayPalMembershipButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      // Activate the membership after successful payment
      await apiRequest("POST", "/api/membership/activate", {
        planId,
        paymentId: paymentData.id
      });

      toast({
        title: "Membership Activated",
        description: `Your ${planName} membership has been successfully activated!`,
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/membership/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/roles"] });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error activating membership:", error);
      toast({
        title: "Activation Error",
        description: "Payment successful but membership activation failed. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error);
    toast({
      title: "Payment Failed",
      description: "There was an error processing your payment. Please try again.",
      variant: "destructive",
    });
  };

  const handlePaymentCancel = () => {
    toast({
      title: "Payment Cancelled",
      description: "You cancelled the payment process.",
    });
  };

  return (
    <div className="w-full">
      <PayPalFastLaneButton
        amount={price.toString()}
        currency="USD"
        intent="CAPTURE"
        description={`${planName} Membership - Global Container Exchange`}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        onCancel={handlePaymentCancel}
        items={[
          {
            name: `${planName} Membership`,
            quantity: "1",
            unit_amount: {
              currency_code: "USD",
              value: price.toString(),
            },
          },
        ]}
        style={{
          layout: "horizontal",
          color: "blue",
          shape: "rect",
          label: "paypal",
          tagline: false,
          height: 45,
        }}
      />
    </div>
  );
}
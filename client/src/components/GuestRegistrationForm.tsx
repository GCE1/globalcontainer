import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import PaymentMethodSelector from "./PaymentMethodSelector";

const guestRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type GuestRegistrationForm = z.infer<typeof guestRegistrationSchema>;

interface GuestRegistrationFormProps {
  planId: string;
  planName: string;
  amount: string;
  onSuccess: (userData: any) => void;
  onCancel: () => void;
}

export function GuestRegistrationForm({ 
  planId, 
  planName, 
  amount, 
  onSuccess, 
  onCancel 
}: GuestRegistrationFormProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<GuestRegistrationForm>({
    resolver: zodResolver(guestRegistrationSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: GuestRegistrationForm) => {
    try {
      // Create guest payment session
      const response = await fetch('/api/guest/membership/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          amount,
          currency: 'USD',
          customerInfo: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment session');
      }

      const result = await response.json();
      setSessionId(result.sessionId);
      setShowPayment(true);

      toast({
        title: "Registration Info Saved",
        description: "Please complete your payment to activate your membership.",
      });

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      if (!sessionId) {
        throw new Error('No session ID available');
      }

      // Complete payment and create user account
      const response = await fetch('/api/guest/membership/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          paymentData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete payment');
      }

      const result = await response.json();
      
      toast({
        title: `Welcome ${result.user.firstName}!`,
        description: `Your ${planName} membership is now active. Account created successfully.`,
      });

      onSuccess(result.user);

    } catch (error) {
      console.error('Payment completion error:', error);
      toast({
        title: "Payment Completion Failed",
        description: error instanceof Error ? error.message : "Please contact support.",
        variant: "destructive",
      });
    }
  };

  if (showPayment && sessionId) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>
            Finish your {planName} membership purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-lg font-semibold">${amount}/month</div>
            <div className="text-sm text-gray-600">{planName} Membership</div>
          </div>
          
          <PaymentMethodSelector
            amount={amount}
            currency="USD"
            intent="sale"
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={(error) => {
              toast({
                title: "Payment Error",
                description: error.message,
                variant: "destructive",
              });
            }}
          />
          
          <Button
            variant="outline"
            onClick={() => setShowPayment(false)}
            className="w-full"
          >
            Back to Registration
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>
          Register for {planName} membership (${amount}/month)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
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
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Continue to Payment
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
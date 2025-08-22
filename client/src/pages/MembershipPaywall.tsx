import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, TrendingUp, Building2, BarChart3 } from "lucide-react";

import { useMembership } from "@/hooks/useMembership";
import { useToast } from "@/hooks/use-toast";

const MembershipPaywall = () => {
  const [, setLocation] = useLocation();



  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get membership status
  const { membership, isLoading: membershipLoading } = useMembership();

  // Get available plans from API
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['/api/membership/plans'],
  });

  // Membership activation mutation
  const activateMembership = useMutation({
    mutationFn: async ({ planId, paymentId }: { planId: string; paymentId: string }) => {
      const response = await fetch('/api/membership/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, paymentId }),
      });
      if (!response.ok) throw new Error('Failed to activate membership');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/membership/status'] });
      toast({
        title: "Membership Activated!",
        description: "Your membership has been successfully activated.",
      });
      setLocation('/');
    },
    onError: (error) => {
      toast({
        title: "Activation Failed",
        description: "There was an error activating your membership. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle payment success
  const handlePaymentSuccess = (paymentData: any) => {
    if (selectedPlan) {
      activateMembership.mutate({
        planId: selectedPlan,
        paymentId: paymentData.orderId || paymentData.id || 'DEMO_PAYMENT_ID',
      });
    }
  };

  const handlePlanSelect = async (planId: string) => {
    const plan = membershipPlans.find(p => p.id === planId);
    if (!plan) return;
    
    try {
      const response = await fetch("/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.price,
          currency: "USD",
          intent: "CAPTURE",
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create payment order");
      }
      
      const orderData = await response.json();
      const approvalUrl = orderData.links?.find((link: any) => link.rel === "approve")?.href;
      
      if (approvalUrl) {
        // Store plan selection in localStorage for when user returns
        localStorage.setItem('selectedPlan', planId);
        window.location.href = approvalUrl;
      } else {
        throw new Error("No approval URL found");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "Failed to start payment process. Please try again.",
        variant: "destructive",
      });
    }
  };



  // Check if user already has an active membership
  if (membershipLoading || plansLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading membership plans...</p>
        </div>
      </div>
    );
  }

  // If user already has an active membership, redirect them
  if (membership?.isActive) {
    setLocation('/');
    return null;
  }

  // Display plans with UI icons - only use real data from API
  const membershipPlans = plans ? Object.values(plans).map((plan: any) => ({
    ...plan,
    icon: plan.id === 'insights' ? BarChart3 : plan.id === 'expert' ? Building2 : Crown,
    color: plan.id === 'insights' ? 'bg-blue-500' : plan.id === 'expert' ? 'bg-green-500' : 'bg-purple-500',
    popular: plan.id === 'expert'
  })) : [];

  const selectedPlanData = membershipPlans.find(plan => plan.id === selectedPlan);

  // If no plans available from API, show error message
  if (!plans || membershipPlans.length === 0) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Membership Plans Available</h2>
          <p className="text-gray-600">Please contact support to set up membership plans.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">
            Choose Your Membership
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          </p>
          <div className="mt-6">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            </Badge>
          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {membershipPlans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`relative transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-blue-700">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-gray-600">
                    {plan.subtitle}
                  </CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-blue-700">${plan.price}</span>
                    <span className="text-gray-500">/{plan.duration}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-3">
                    {plan.description}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="p-4 bg-gray-100 rounded-lg text-center">
                    <p className="text-gray-600">Payment processing temporarily unavailable</p>
                    <p className="text-sm text-gray-500 mt-2">Please contact support for membership activation</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Security Notice */}
        <div className="mt-12 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🛡️ Secure & Protected
            </h3>
            <p className="text-green-700">
              You can cancel or modify your subscription at any time through your account settings.
            </p>
          </div>
        </div>
        
        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Questions about membership plans?{" "}
            <Button variant="link" className="text-blue-600 p-0">
              Contact our sales team
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MembershipPaywall;
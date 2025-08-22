import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { insertCustomerSchema, type InsertCustomer } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useEffect, useState } from "react";
import { z } from "zod";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface CustomerInfoProps {
  selectedTier?: string;
  monthlyPrice?: number;
}

export default function CustomerInfo() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<string>("insights");
  const [monthlyPrice, setMonthlyPrice] = useState<number>(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tier = params.get('tier') || 'insights';
    setSelectedTier(tier);
    
    const prices = { insights: 1, professional: 199, expert: 149 };
    setMonthlyPrice(prices[tier as keyof typeof prices] || 1);
  }, []);

  // Extended schema with password validation
  const customerFormSchema = insertCustomerSchema.extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      companyType: "individual",
      industry: "",
      companySize: "",
      website: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      businessDescription: "",
      expectedUsage: "",
      subscriptionTier: selectedTier,
      monthlyPrice: monthlyPrice.toString(),
      paymentMethod: "credit_card",
      password: "",
      confirmPassword: "",
    },
  });

  const customerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof customerFormSchema>) => {
      // Separate password fields from customer data
      const { password, confirmPassword, ...customerData } = data;
      
      // Create user account
      const userResponse = await apiRequest("POST", "/api/auth/register", {
        email: customerData.email,
        password: password,
        firstName: customerData.firstName,
        lastName: customerData.lastName
      });
      
      // Create customer profile
      const response = await apiRequest("POST", "/api/customers", customerData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Information Submitted!",
        description: "Redirecting to payment...",
      });
      // Redirect directly to payment with customer data
      const customerData = encodeURIComponent(JSON.stringify({
        customerId: data.id,
        tier: selectedTier,
        price: monthlyPrice,
        email: data.email,
        name: `${data.firstName} ${data.lastName}`
      }));
      navigate(`/payment?customer=${customerData}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getTierDisplayName = (tier: string) => {
    const names = {
      insights: "Insights",
      professional: "Professional", 
      expert: "Expert"
    };
    return names[tier as keyof typeof names] || "Insights";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-[#001937] relative overflow-hidden p-4">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#33d2b9] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="max-w-4xl mx-auto">
          <Card className="mb-6" style={{backgroundColor: '#eef4ff'}}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-blue-600">
                Complete Your {getTierDisplayName(selectedTier)} Subscription
              </CardTitle>
              <CardDescription className="text-center text-lg">
                <span className="font-bold text-green-600 text-2xl">${monthlyPrice}/month</span> - <span className="text-black">Please provide your information to continue</span>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card style={{backgroundColor: '#eef4ff'}}>
            <CardHeader>
              <CardTitle className="text-blue-600">Customer Information</CardTitle>
              <CardDescription className="text-black">
                Please fill out all required fields to complete your subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => customerMutation.mutate(data))} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-600">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-600">First Name *</FormLabel>
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
                            <FormLabel className="text-red-600">Last Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-600">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-600">Email *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john.doe@company.com" {...field} />
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
                            <FormLabel className="text-red-600">Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Account Setup */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-600">Account Setup</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-600">Password *</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a secure password" {...field} />
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
                          <FormLabel className="text-red-600">Confirm Password *</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-600">Business Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Company Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="companyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select company type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="individual">Individual</SelectItem>
                                <SelectItem value="small_business">Small Business</SelectItem>
                                <SelectItem value="corporation">Corporation</SelectItem>
                                <SelectItem value="llc">LLC</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <FormControl>
                              <Input placeholder="Logistics, Manufacturing, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Size</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select company size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-10">1-10 employees</SelectItem>
                                <SelectItem value="11-50">11-50 employees</SelectItem>
                                <SelectItem value="51-200">51-200 employees</SelectItem>
                                <SelectItem value="201-1000">201-1000 employees</SelectItem>
                                <SelectItem value="1000+">1000+ employees</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.yourcompany.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-red-600">Street Address *</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main Street" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-600">City *</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-600">State/Province *</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-600">ZIP/Postal Code *</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-600">Country *</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Business Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-600">Business Details</h3>
                  <FormField
                    control={form.control}
                    name="businessDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe your business and how you plan to use our platform..."
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expectedUsage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Platform Usage</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How do you plan to use the Global Container Exchange platform?"
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6 pt-6">
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate("/memberships")}
                    >
                      Back to Plans
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={customerMutation.isPending}
                      variant="outline"
                      className="border-2 bg-[#001937] hover:bg-[#33d2b9] text-white hover:text-white border-[#001937] hover:border-[#33d2b9] px-4 py-2 rounded-lg flex items-center transition duration-300 h-auto group justify-center"
                    >
                      {customerMutation.isPending ? "Submitting..." : "Save Information & Continue"}
                    </Button>
                  </div>


                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
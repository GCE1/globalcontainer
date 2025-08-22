import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { UserCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      console.log('Login attempt with:', data);
      const response = await apiRequest("POST", "/api/auth/login", data);
      console.log('Login response status:', response.status);
      const result = await response.json();
      console.log('Login result:', result);
      return result;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      const user = data.user;
      
      // Check if user has any active roles
      const hasActiveRoles = user.roles && user.roles.length > 0 && 
        user.roles.some((role: any) => role.subscription_status === 'active');
      
      if (hasActiveRoles) {
        // User has active membership(s), redirect to membership dashboard
        const activeRole = user.roles.find((role: any) => role.subscription_status === 'active');
        const roleType = activeRole.role_type;
        
        const tierMessage = `Welcome back to your ${roleType.charAt(0).toUpperCase() + roleType.slice(1)} membership!`;
        
        toast({
          title: "Successfully Signed In",
          description: tierMessage,
        });
        
        // Redirect to membership page where they can access their dashboards
        navigate("/membership");
      } else {
        // No active membership, redirect to subscription page
        const tierMessage = user.subscriptionTier 
          ? `Welcome back! Your subscription needs renewal.`
          : "Welcome back!";
        
        toast({
          title: "Successfully Signed In",
          description: tierMessage,
        });
        
        navigate("/membership");
      }
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-[#001937] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#33d2b9] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 min-h-full flex items-center justify-center p-4 py-20">
          <Card className="w-full max-w-lg shadow-2xl border-0 backdrop-blur-sm" style={{backgroundColor: '#eef4ff'}}>
            <CardHeader className="space-y-2 text-center pb-8">
              <CardTitle className="text-xl font-semibold text-blue-600 flex items-center justify-center gap-2">
                <UserCheck className="h-5 w-5" />
                Member Sign-In
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Access your <span className="text-black font-semibold">Global Container Exchange</span> membership
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#001937] font-medium">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@company.com"
                            className="h-12 border-gray-300 focus:border-[#33d2b9] focus:ring-[#33d2b9]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#001937] font-medium">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            className="h-12 border-gray-300 focus:border-[#33d2b9] focus:ring-[#33d2b9]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  <Button
                    type="submit"
                    className="w-full h-10 bg-[#001937] hover:bg-[#33d2b9] text-white font-medium text-sm transition-all duration-300"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In to Membership"}
                  </Button>
                </form>
              </Form>

              {/* Social Login Options */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-sm uppercase">
                    <span className="bg-white px-4 text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-12 border-2 hover:bg-gray-50"
                    onClick={() => {
                      toast({
                        title: "Google Sign-In",
                        description: "Google authentication will be available after configuration.",
                      });
                    }}
                  >
                    <FaGoogle className="mr-2 h-5 w-5 text-red-500" />
                    <span className="font-medium">Google</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-12 border-2 hover:bg-gray-50"
                    onClick={() => {
                      toast({
                        title: "Facebook Sign-In",
                        description: "Facebook authentication will be available after configuration.",
                      });
                    }}
                  >
                    <FaFacebook className="mr-2 h-5 w-5 text-blue-600" />
                    <span className="font-medium">Facebook</span>
                  </Button>
                </div>
              </div>

              <div className="mt-8 text-center space-y-4">
                <p className="text-gray-600">
                  Don't have a membership?{" "}
                  <Link href="/memberships" className="text-[#001937] hover:text-[#33d2b9] font-semibold hover:underline transition-colors">
                    View Plans & Subscribe
                  </Link>
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm text-gray-500">
                  <span>
                    Need help?{" "}
                    <Link href="/register" className="text-[#001937] hover:text-[#33d2b9] font-medium hover:underline transition-colors">
                      Create Account
                    </Link>
                  </span>
                  <span className="hidden sm:inline">|</span>
                  <span>
                    <Link href="/forgot-password" className="text-[#001937] hover:text-[#33d2b9] font-medium hover:underline transition-colors">
                      Forgot Password?
                    </Link>
                  </span>
                </div>

                {/* Terms & Privacy Notice */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    By continuing, you agree to Global Container Exchange's{" "}
                    <Link href="/terms-conditions" className="text-[#001937] hover:text-[#33d2b9] font-medium hover:underline transition-colors">
                      Terms & Conditions
                    </Link>
                    {" "}and{" "}
                    <Link href="/privacy-policy" className="text-[#001937] hover:text-[#33d2b9] font-medium hover:underline transition-colors">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { passwordResetSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, CheckCircle, Key } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { z } from "zod";

type ResetPasswordData = z.infer<typeof passwordResetSchema>;

export default function ResetPassword() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    // Extract token from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    if (resetToken) {
      setToken(resetToken);
    } else {
      toast({
        title: "Invalid Reset Link",
        description: "This password reset link is invalid or expired.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [navigate, toast]);

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      token: "",
      password: "",
    },
  });

  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const response = await apiRequest("POST", "/api/auth/reset-password", data);
      return response.json();
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      toast({
        title: "Password Reset Successful",
        description: data.message,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Reset Failed",
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
              <div className="flex items-center justify-center mb-4">
                {isSuccess ? (
                  <CheckCircle className="h-12 w-12 text-green-600" />
                ) : (
                  <Key className="h-12 w-12 text-blue-600" />
                )}
              </div>
              <CardTitle className="text-3xl font-bold text-blue-600">
                {isSuccess ? "Password Updated!" : "Set New Password"}
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                {isSuccess 
                  ? "Your password has been successfully updated. You can now sign in with your new password."
                  : "Enter your new password below to complete the reset process"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              {!isSuccess ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => resetPasswordMutation.mutate(data))} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#001937] font-medium">New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your new password"
                              className="h-12 border-gray-300 focus:border-[#33d2b9] focus:ring-[#33d2b9]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500 mt-1">
                            Password must be at least 6 characters long
                          </p>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-12 bg-[#001937] hover:bg-[#33d2b9] text-white font-semibold text-base transition-all duration-300"
                      disabled={resetPasswordMutation.isPending}
                    >
                      {resetPasswordMutation.isPending ? "Updating Password..." : "Update Password"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 text-sm">
                      Your password has been successfully updated. You can now sign in to your account.
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full h-12 bg-[#001937] hover:bg-[#33d2b9] text-white font-semibold"
                  >
                    Continue to Sign In
                  </Button>
                </div>
              )}

              {!isSuccess && (
                <div className="mt-8 text-center">
                  <Link href="/login" className="inline-flex items-center text-[#001937] hover:text-[#33d2b9] font-medium hover:underline transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
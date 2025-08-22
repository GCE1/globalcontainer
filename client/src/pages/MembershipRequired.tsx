import { Link } from "wouter";
import { Shield, CheckCircle, ArrowRight, Users, BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MembershipRequired() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001937] to-[#004d7a] flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-[#33d2b9]" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Membership Required
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Access to our container trading platform requires an active membership. 
              Choose the plan that best fits your business needs.
            </p>
          </div>

          {/* Membership Plans */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Insights Plan */}
            <Card className="border-2 border-gray-600 bg-gray-800/50 backdrop-blur-sm hover:border-[#33d2b9] transition-colors">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <BarChart3 className="h-8 w-8 text-[#33d2b9]" />
                </div>
                <CardTitle className="text-white text-xl">Insights</CardTitle>
                <CardDescription className="text-gray-300">
                  Perfect for market analysis and insights
                </CardDescription>
                <div className="text-3xl font-bold text-white mt-2">
                  $49.99<span className="text-lg font-normal text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">Market analytics and trends</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">Price tracking and reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">Basic container search</span>
                </div>
                <Button asChild className="w-full mt-4 bg-[#33d2b9] hover:bg-[#2ab8a0] text-black">
                  <Link href="/membership">Choose Insights</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Expert Plan */}
            <Card className="border-2 border-[#33d2b9] bg-gray-800/50 backdrop-blur-sm relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#33d2b9] text-black">
                Most Popular
              </Badge>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-8 w-8 text-[#33d2b9]" />
                </div>
                <CardTitle className="text-white text-xl">Expert</CardTitle>
                <CardDescription className="text-gray-300">
                  Ideal for leasing and container management
                </CardDescription>
                <div className="text-3xl font-bold text-white mt-2">
                  $149.99<span className="text-lg font-normal text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">Everything in Insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">Leasing management tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">Advanced container search</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">Contract management</span>
                </div>
                <Button asChild className="w-full mt-4 bg-[#33d2b9] hover:bg-[#2ab8a0] text-black">
                  <Link href="/membership">Choose Expert</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-gray-600 bg-gray-800/50 backdrop-blur-sm hover:border-[#33d2b9] transition-colors">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-[#33d2b9]" />
                </div>
                <CardTitle className="text-white text-xl">Pro</CardTitle>
                <CardDescription className="text-gray-300">
                  Complete wholesale trading platform
                </CardDescription>
                <div className="text-3xl font-bold text-white mt-2">
                  $199.99<span className="text-lg font-normal text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">Everything in Expert</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">Wholesale trading access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">Bulk purchase tools</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">Priority support</span>
                </div>
                <Button asChild className="w-full mt-4 bg-[#33d2b9] hover:bg-[#2ab8a0] text-black">
                  <Link href="/membership">Choose Pro</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-gray-300 mb-6">
              Already have an account? Sign in to access your membership benefits.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline" className="border-[#33d2b9] text-[#33d2b9] hover:bg-[#33d2b9] hover:text-black">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-[#33d2b9] hover:bg-[#2ab8a0] text-black">
                <Link href="/membership">
                  View All Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
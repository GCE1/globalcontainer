import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock, CheckCircle, FileText, Calculator } from 'lucide-react';
import gceRepImage from '@assets/GCE-Male-Rep_1749489976355.png';

const quoteFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  company: z.string().optional(),
  location: z.string().min(2, 'Please enter your location'),
  serviceType: z.string().min(1, 'Please select service type'),
  containerType: z.string().min(1, 'Please select a container type'),
  containerSize: z.string().min(1, 'Please select a container size'),
  containerCondition: z.string().min(1, 'Please select a container condition'),
  quantity: z.string().min(1, 'Please enter quantity'),
  deliveryLocation: z.string().min(2, 'Please enter delivery location'),
  timeframe: z.string().min(1, 'Please select a timeframe'),
  // Leasing specific fields
  originPort: z.string().optional(),
  destinationPort: z.string().optional(),
  leaseDuration: z.string().optional(),
  freeDaysPreference: z.string().optional(),
  additionalRequirements: z.string().optional(),
  budgetRange: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

export default function RequestQuote() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.title = 'Request a Quote - Global Container Exchange';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get a personalized quote for your shipping container needs. Fast response within 24 hours with competitive pricing and flexible solutions.');
    }
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      location: '',
      serviceType: '',
      containerType: '',
      containerSize: '',
      containerCondition: '',
      quantity: '',
      deliveryLocation: '',
      timeframe: '',
      originPort: '',
      destinationPort: '',
      leaseDuration: '',
      freeDaysPreference: '',
      additionalRequirements: '',
      budgetRange: '',
    },
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/quote-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Quote request submitted successfully:', result.messageId);
        setIsSubmitted(true);
        toast({
          title: "Quote Request Submitted",
          description: "We'll get back to you within 24 hours with a detailed quote.",
        });
      } else {
        throw new Error(result.message || 'Failed to submit quote request');
      }
    } catch (error: any) {
      console.error('Quote request error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit quote request. Please try again or contact support at support@globalcontainerexchange.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold text-blue-600 mb-4">
                Quote Request Submitted Successfully!
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Thank you for your interest in our containers. Our team will review your requirements and get back to you within 24 hours with a comprehensive quote.
              </p>
            </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Review & Analysis</h3>
                  <p className="text-gray-600">Our experts will analyze your requirements and check container availability.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Custom Quote Preparation</h3>
                  <p className="text-gray-600">We'll prepare a detailed quote including pricing, delivery options, and terms.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Personal Follow-up</h3>
                  <p className="text-gray-600">Our representative will contact you to discuss the quote and answer any questions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center mt-8">
            <Button 
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="mr-4"
            >
              Submit Another Quote
            </Button>
            <Button 
              onClick={() => window.location.href = '/container-sales'}
            >
              Browse Containers
            </Button>
          </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              Request a Custom Quote
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get a personalized quote for your container needs. Our experts will provide competitive pricing 
              and flexible solutions tailored to your specific requirements.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <FileText className="h-5 w-5" />
                    Quote Request Form
                  </CardTitle>
                  <CardDescription>
                    Please fill out all required fields to help us provide the most accurate quote.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">
                          Contact Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name *</FormLabel>
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
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
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
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your Company" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Location *</FormLabel>
                              <FormControl>
                                <Input placeholder="City, State/Province" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Service Type */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">
                        Service Type
                      </h3>
                      <FormField
                        control={form.control}
                        name="serviceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Required *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select service type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="purchase">Container Purchase</SelectItem>
                                <SelectItem value="leasing">Container Leasing</SelectItem>
                                <SelectItem value="transport">Container Transport</SelectItem>
                                <SelectItem value="storage">Container Storage</SelectItem>
                                <SelectItem value="modifications">Container Modifications</SelectItem>
                                <SelectItem value="tracking">Container Tracking</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Container Requirements */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">
                        Container Requirements
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="containerType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Container Type *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="standard">Standard Container</SelectItem>
                                  <SelectItem value="high-cube">High Cube</SelectItem>
                                  <SelectItem value="open-top">Open Top</SelectItem>
                                  <SelectItem value="flat-rack">Flat Rack</SelectItem>
                                  <SelectItem value="refrigerated">Refrigerated</SelectItem>
                                  <SelectItem value="double-door">Double Door</SelectItem>
                                  <SelectItem value="side-door">Side Door</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="containerSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Container Size *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="20ft">20ft</SelectItem>
                                  <SelectItem value="40ft">40ft</SelectItem>
                                  <SelectItem value="45ft">45ft</SelectItem>
                                  <SelectItem value="53ft">53ft</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="containerCondition"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Condition *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select condition" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="new">Brand New</SelectItem>
                                  <SelectItem value="cargo-worthy">Cargo Worthy</SelectItem>
                                  <SelectItem value="wwt">Wind & Water Tight</SelectItem>
                                  <SelectItem value="iicl">IICL</SelectItem>
                                  <SelectItem value="as-is">As Is</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity *</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="1" min="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="timeframe"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Timeframe *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="When do you need it?" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="asap">ASAP (Within 1 week)</SelectItem>
                                  <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                                  <SelectItem value="1-month">Within 1 month</SelectItem>
                                  <SelectItem value="2-months">Within 2 months</SelectItem>
                                  <SelectItem value="flexible">Flexible timeline</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="deliveryLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Location *</FormLabel>
                            <FormControl>
                              <Input placeholder="Street address, City, State/Province, Postal Code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="budgetRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget Range (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select budget range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="under-5k">Under $5,000</SelectItem>
                                <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                                <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                                <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                                <SelectItem value="over-50k">Over $50,000</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Leasing Specific Fields */}
                      {form.watch('serviceType') === 'leasing' && (
                        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border">
                          <h4 className="text-md font-semibold text-blue-700">
                            Leasing Requirements
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="originPort"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Origin Port</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Shanghai, Yantian, Rotterdam" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="destinationPort"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Destination Port</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Los Angeles, Hamburg, Dubai" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="leaseDuration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Lease Duration</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select duration" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="route-based">Route-Based (One-way)</SelectItem>
                                      <SelectItem value="3-months">3 Months</SelectItem>
                                      <SelectItem value="6-months">6 Months</SelectItem>
                                      <SelectItem value="12-months">12 Months</SelectItem>
                                      <SelectItem value="24-months">24 Months</SelectItem>
                                      <SelectItem value="custom">Custom Duration</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="freeDaysPreference"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Free Days Preference</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select free days" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="60-days">60 Free Days (Standard)</SelectItem>
                                      <SelectItem value="75-days">75 Free Days (Premium)</SelectItem>
                                      <SelectItem value="custom">Custom Free Days</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {/* Transport Specific Fields */}
                      {form.watch('serviceType') === 'transport' && (
                        <div className="space-y-4 p-4 bg-orange-50 rounded-lg border">
                          <h4 className="text-md font-semibold text-orange-700">
                            Transport Requirements
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="originPort"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Pickup Location</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Los Angeles, Houston, Miami" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="destinationPort"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Drop-off Location</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., New York, Chicago, Atlanta" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="leaseDuration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Transport Method</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select method" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="truck">Truck Transport (1-4 containers)</SelectItem>
                                      <SelectItem value="rail">Rail Transport (50+ containers)</SelectItem>
                                      <SelectItem value="ocean">Ocean Freight (1000+ containers)</SelectItem>
                                      <SelectItem value="intermodal">Intermodal (Combined methods)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="freeDaysPreference"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Service Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select service" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="door-to-door">Door-to-Door Delivery (From $350)</SelectItem>
                                      <SelectItem value="port-to-port">Port-to-Port Shipping (From $180)</SelectItem>
                                      <SelectItem value="domestic">Domestic Transport (From $200)</SelectItem>
                                      <SelectItem value="expedited">Expedited Delivery (From $500)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {/* Storage Specific Fields */}
                      {form.watch('serviceType') === 'storage' && (
                        <div className="space-y-4 p-4 bg-purple-50 rounded-lg border">
                          <h4 className="text-md font-semibold text-purple-700">
                            Storage Requirements
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="originPort"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Storage Location Preference</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select facility type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="port-terminal">Port Terminal Facility (2,500 containers)</SelectItem>
                                      <SelectItem value="inland-depot">Inland Storage Depot (1,800 containers)</SelectItem>
                                      <SelectItem value="climate-controlled">Climate-Controlled Facility (800 containers)</SelectItem>
                                      <SelectItem value="distribution-center">Distribution Center (1,200 containers)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="destinationPort"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Security Level Required</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select security level" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="level-4">Level 4 Security (Standard)</SelectItem>
                                      <SelectItem value="level-5">Level 5 Security (Premium)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="leaseDuration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Storage Duration</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select duration" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="short-term">Short-Term (1-30 days) - From $8/day</SelectItem>
                                      <SelectItem value="medium-term">Medium-Term (1-12 months) - From $180/month</SelectItem>
                                      <SelectItem value="long-term">Long-Term (1+ years) - From $120/month</SelectItem>
                                      <SelectItem value="climate-controlled">Climate-Controlled (Any duration) - From $280/month</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="freeDaysPreference"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Additional Services</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select services" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="inspection">Container Inspection & Maintenance</SelectItem>
                                      <SelectItem value="tracking">Inventory Tracking & Reporting</SelectItem>
                                      <SelectItem value="loading">Loading & Unloading Services</SelectItem>
                                      <SelectItem value="cleaning">Container Cleaning & Sanitization</SelectItem>
                                      <SelectItem value="pickup-delivery">Container Pickup & Delivery</SelectItem>
                                      <SelectItem value="emergency-access">Emergency Access 24/7</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {/* Modifications Specific Fields */}
                      {form.watch('serviceType') === 'modifications' && (
                        <div className="space-y-4 p-4 bg-amber-50 rounded-lg border">
                          <h4 className="text-md font-semibold text-amber-700">
                            Modification Requirements
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="originPort"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Modification Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select modification type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="office-conversion">Office Conversions (From $8,500)</SelectItem>
                                      <SelectItem value="residential-units">Residential Units (From $15,000)</SelectItem>
                                      <SelectItem value="retail-spaces">Retail Spaces (From $12,000)</SelectItem>
                                      <SelectItem value="specialized-storage">Specialized Storage (From $6,500)</SelectItem>
                                      <SelectItem value="mobile-restaurant">Mobile Restaurant (From $18,500)</SelectItem>
                                      <SelectItem value="workshop-garage">Workshop & Garage (From $9,200)</SelectItem>
                                      <SelectItem value="medical-facility">Medical Facility (From $22,000)</SelectItem>
                                      <SelectItem value="data-center">Data Center (From $16,800)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="destinationPort"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Project Timeline</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select timeline" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="2-4-weeks">2-4 weeks (Basic Storage Modifications)</SelectItem>
                                      <SelectItem value="4-6-weeks">4-6 weeks (Retail Pop-Up Store)</SelectItem>
                                      <SelectItem value="6-10-weeks">6-10 weeks (Residential Tiny Home)</SelectItem>
                                      <SelectItem value="8-12-weeks">8-12 weeks (Modern Office Complex)</SelectItem>
                                      <SelectItem value="10-14-weeks">10-14 weeks (Mobile Restaurant)</SelectItem>
                                      <SelectItem value="12-16-weeks">12-16 weeks (Medical/Data Center Facility)</SelectItem>
                                      <SelectItem value="16-20-weeks">16-20 weeks (Complex Multi-Unit Projects)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="leaseDuration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Custom Features Needed</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select features" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="electrical-hvac">Electrical Systems & HVAC Integration</SelectItem>
                                      <SelectItem value="plumbing-kitchen">Plumbing Systems & Kitchen Installation</SelectItem>
                                      <SelectItem value="insulation-finishing">Insulation & Interior Finishing</SelectItem>
                                      <SelectItem value="security-branding">Security Systems & Custom Branding</SelectItem>
                                      <SelectItem value="climate-ventilation">Climate Control & Ventilation</SelectItem>
                                      <SelectItem value="windows-doors">Windows, Doors & Access Modifications</SelectItem>
                                      <SelectItem value="flooring-lighting">Flooring Systems & LED Lighting</SelectItem>
                                      <SelectItem value="solar-panels">Solar Panel Installation & Power Systems</SelectItem>
                                      <SelectItem value="partition-walls">Partition Walls & Interior Layout</SelectItem>
                                      <SelectItem value="fire-safety">Fire Safety Systems & Emergency Exits</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="freeDaysPreference"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Compliance Requirements</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select compliance needs" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="building-code">Building Code Compliance (IBC/IRC)</SelectItem>
                                      <SelectItem value="electrical-safety">Electrical Safety Standards (NEC/CEC)</SelectItem>
                                      <SelectItem value="plumbing-code">Plumbing Code Certification (IPC/UPC)</SelectItem>
                                      <SelectItem value="fire-safety">Fire Safety Compliance (NFPA/IFC)</SelectItem>
                                      <SelectItem value="ada-accessibility">ADA Accessibility Standards</SelectItem>
                                      <SelectItem value="environmental">Environmental Regulations (EPA/DOT)</SelectItem>
                                      <SelectItem value="structural-engineering">Structural Engineering Certification</SelectItem>
                                      <SelectItem value="hvac-mechanical">HVAC & Mechanical Code Compliance</SelectItem>
                                      <SelectItem value="energy-efficiency">Energy Efficiency Standards (ASHRAE)</SelectItem>
                                      <SelectItem value="health-safety">Health & Safety Regulations (OSHA)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name="additionalRequirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Requirements or Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please describe any special requirements, modifications, or additional services needed..."
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting Quote Request...
                        </>
                      ) : (
                        <>
                          <Calculator className="mr-2 h-4 w-4" />
                          Submit Quote Request
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">Why Choose Our Quotes?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Competitive Pricing</h4>
                    <p className="text-sm text-gray-600">Best market rates with transparent pricing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Fast Response</h4>
                    <p className="text-sm text-gray-600">Quote within 24 hours guaranteed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Flexible Terms</h4>
                    <p className="text-sm text-gray-600">Customized payment and delivery options</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Expert Support</h4>
                    <p className="text-sm text-gray-600">Dedicated account manager assigned</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-sm text-gray-600">1-(249) 879-0355</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Email Us</p>
                    <p className="text-sm text-gray-600">quotes@globalcontainer.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-sm text-gray-600">7 Days a Week, 24hrs a Day</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Bulk Discounts Available</h3>
              <p className="text-sm text-blue-700">
                Planning to purchase multiple containers? Ask about our volume pricing for orders of 5+ units.
              </p>
              <Badge variant="secondary" className="mt-2">
                Save up to 15%
              </Badge>
            </div>

            {/* GCE Representative Image */}
            <div className="text-center">
              <img 
                src={gceRepImage} 
                alt="GCE Customer Representative" 
                className="w-48 h-auto mx-auto rounded-lg shadow-lg border-2 border-blue-100"
              />
              <p className="text-sm text-gray-600 mt-2">Our dedicated team is ready to help</p>
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
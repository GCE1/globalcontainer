import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Phone, Mail, Linkedin, Twitter, Facebook, Youtube, Send, CheckCircle } from "lucide-react";
import contactImage from "@assets/Contact Us image.png";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      setTimeout(() => setIsSubmitted(false), 5000);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Headquarters",
      details: ["1 Marina Boulevard", "Singapore 018989"],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+65 6234 5678"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["contact@globaltrade.com"],
    },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/global-container-exchange-6b5a54339/", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/GCEenterprise", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to transform your container logistics?
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {/* Professional Contact Image Section */}
          <div className="lg:col-span-1 flex">
            <Card className="w-full shadow-2xl border-0 flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="relative mb-4 flex-shrink-0">
                  <img 
                    src={contactImage} 
                    alt="Professional customer service representative ready to help" 
                    className="w-full h-48 rounded-xl shadow-xl object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-xl"></div>
                </div>
                <div className="text-center lg:text-left flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Expert Support Team</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    Our dedicated professionals are ready to assist you with container logistics solutions. With over 20 years of combined experience in maritime trade and global shipping, our support team understands the complexities of container logistics like no other.
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Whether you're managing a single container shipment or coordinating thousands of units across multiple routes, we provide personalized guidance tailored to your business needs. From real-time tracking support to complex route optimization, our experts are here to ensure your cargo moves efficiently and cost-effectively.
                  </p>
                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                      <div className="p-1.5 bg-blue-100 rounded-full">
                        <Phone className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-medium text-xs">24/7 Support Available</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                      <div className="p-1.5 bg-green-100 rounded-full">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium text-xs">Quick Response Guaranteed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form Section */}
          <div className="lg:col-span-1 flex">
            {/* Contact Form */}
            <Card className="contact-form shadow-2xl border-0 w-full flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                <h4 className="text-lg font-bold mb-4 text-blue-600">Send us a Message</h4>
                
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for reaching out. We'll respond within 24 hours.</p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold">First Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="border-2 focus:border-blue-500" />
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
                              <FormLabel className="font-semibold">Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="border-2 focus:border-blue-500" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} className="border-2 focus:border-blue-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Company</FormLabel>
                            <FormControl>
                              <Input {...field} className="border-2 focus:border-blue-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Subject</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-2 focus:border-blue-500">
                                  <SelectValue placeholder="Select a topic..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                                <SelectItem value="platform">Platform Demo</SelectItem>
                                <SelectItem value="support">Technical Support</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Message</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={5}
                                placeholder="Tell us about your container logistics needs..."
                                className="border-2 focus:border-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full stats-gradient hover:opacity-90 btn-hover"
                        disabled={contactMutation.isPending}
                      >
                        {contactMutation.isPending ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information Section */}
          <div className="lg:col-span-1 flex">
            <Card className="contact-form shadow-2xl border-0 w-full flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                <h4 className="text-lg font-bold mb-4 text-blue-600">Contact Information</h4>
                
                <div className="space-y-4 flex-1">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-1.5 bg-blue-100 rounded-full">
                          <IconComponent className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h6 className="font-semibold text-gray-800 mb-1 text-sm">{info.title}</h6>
                          {info.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-gray-600 text-xs">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Map Placeholder */}
                <div className="mt-4">
                  <h6 className="font-semibold text-gray-800 mb-3 text-sm">Our Location</h6>
                  <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center text-gray-500">
                      <MapPin className="h-8 w-8 mx-auto mb-1" />
                      <p className="text-xs">Interactive Map</p>
                      <p className="text-xs">Google Maps Integration</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-auto pt-2">
                  <h6 className="font-semibold text-gray-800 mb-3 text-sm">Follow Us</h6>
                  <div className="flex space-x-3">
                    {socialLinks.map((social, index) => {
                      const IconComponent = social.icon;
                      return (
                        <a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-gray-100 rounded-full hover:bg-blue-100 social-icon"
                          aria-label={social.label}
                        >
                          <IconComponent className="h-4 w-4 text-gray-600" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

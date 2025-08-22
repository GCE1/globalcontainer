import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      service: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission would go here in a real implementation
    console.log("Form submitted:", formData);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start gap-12">
          {/* Left side content */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-primary mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Have questions about our container services? Fill out the form and our team will get back to you within 24 hours.
            </p>
            
            {/* Contact info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-map-marker-alt text-secondary"></i>
                </div>
                <div>
                  <h4 className="font-medium text-primary">Office Location</h4>
                  <p className="text-gray-600">Available Worldwide</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-phone-alt text-secondary"></i>
                </div>
                <div>
                  <h4 className="font-medium text-primary">Phone Number</h4>
                  <p className="text-gray-600">1-(249) 879-0355</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-envelope text-secondary"></i>
                </div>
                <div>
                  <h4 className="font-medium text-primary">Email Address</h4>
                  <p className="text-gray-600">support@globalcontainerexchange.com</p>
                </div>
              </div>
            </div>
            
            {/* Social media */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-secondary transition duration-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://x.com/GCEenterprise" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-secondary transition duration-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.linkedin.com/in/global-container-exchange-6b5a54339/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-secondary transition duration-300">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-secondary transition duration-300">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          {/* Right side form */}
          <div className="md:w-1/2 bg-gray-50 rounded-lg shadow-md p-8 mt-8 md:mt-0 w-full">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    type="tel" 
                    id="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service">Service Interested In</Label>
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="container-sales">Container Sales</SelectItem>
                      <SelectItem value="container-leasing">Container Leasing</SelectItem>
                      <SelectItem value="container-transport">Container Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  rows={4} 
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                />
              </div>
              
              <Button 
                type="submit" 
                className="bg-secondary hover:bg-opacity-80 text-white px-8 py-3 rounded-full transition duration-300 w-full"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

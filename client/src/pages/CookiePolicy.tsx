import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Cookie, Settings, Shield, Eye, Database, Globe } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Cookie Policy Header */}
        <section 
          className="text-white py-16 relative overflow-hidden"
          style={{
            backgroundImage: `url(/attached_assets/Cookie%20Policy.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <Cookie className="h-16 w-16 text-secondary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                This Cookie Policy explains how Global Container Exchange uses cookies and 
                similar technologies to enhance your browsing experience and improve our services.
              </p>
              <p className="text-sm opacity-75 mt-4">
                Last updated: January 6, 2025
              </p>
            </div>
          </div>
        </section>

        {/* Cookie Policy Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              
              {/* What Are Cookies */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Cookie className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">What Are Cookies?</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Cookies are small text files that are stored on your device when you visit our website. 
                  They contain information that helps us recognize your device and remember your preferences, 
                  making your experience more efficient and personalized.
                </p>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">How Cookies Work</h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>Cookies are created when your browser loads our website</li>
                  <li>They store small amounts of data about your visit and preferences</li>
                  <li>The information is sent back to our server on subsequent visits</li>
                  <li>This allows us to recognize you and customize your experience</li>
                  <li>Cookies cannot access personal files or install malware on your device</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Types of Cookies We Use</h3>
                <p className="text-gray-600">
                  We use both first-party cookies (set by our website) and third-party cookies 
                  (set by external services we integrate with) to provide you with the best 
                  possible experience on our platform.
                </p>
              </div>

              {/* Essential Cookies */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Shield className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">Essential Cookies</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  These cookies are necessary for our website to function properly and cannot be 
                  disabled. They enable core functionality such as security, network management, 
                  and accessibility.
                </p>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Essential Cookie Categories</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">Session Management</h4>
                      <p className="text-gray-600">
                        Enable user authentication, shopping cart functionality, and secure transactions
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700">Security</h4>
                      <p className="text-gray-600">
                        Protect against fraud, ensure secure connections, and verify user identity
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700">Load Balancing</h4>
                      <p className="text-gray-600">
                        Distribute server load to ensure optimal website performance
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700">Accessibility</h4>
                      <p className="text-gray-600">
                        Remember your accessibility preferences and settings
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Cookies */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Database className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">Performance and Analytics Cookies</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  These cookies help us understand how visitors interact with our website by 
                  collecting and reporting information anonymously. This data helps us improve 
                  our website's performance and user experience.
                </p>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">What We Track</h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>Page views and popular content areas</li>
                  <li>User navigation patterns and click behavior</li>
                  <li>Search queries and container preferences</li>
                  <li>Time spent on different pages and sections</li>
                  <li>Technical information like browser type and screen resolution</li>
                  <li>Error messages and technical issues</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Third-Party Analytics</h3>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Google Analytics</h4>
                  <p className="text-gray-600 mb-4">
                    We use Google Analytics to understand website usage patterns and improve 
                    our services. Google Analytics uses cookies to track user interactions 
                    and generate reports about website activity.
                  </p>
                  <p className="text-gray-600">
                    You can opt out of Google Analytics by installing the 
                    <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary underline ml-1" target="_blank" rel="noopener noreferrer">
                      Google Analytics Opt-out Browser Add-on
                    </a>.
                  </p>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Settings className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">Functional Cookies</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  These cookies enable enhanced functionality and personalization features. 
                  They may be set by us or by third-party providers whose services we use 
                  on our website.
                </p>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Personalization Features</h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>Remember your container search preferences and filters</li>
                  <li>Save your location for shipping cost calculations</li>
                  <li>Store your preferred language and currency settings</li>
                  <li>Remember items in your shopping cart between sessions</li>
                  <li>Maintain your login status across pages</li>
                  <li>Customize the interface based on your preferences</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Third-Party Services</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-semibold text-gray-700">Google Maps Integration</h4>
                    <p className="text-gray-600">
                      Used for location services, depot mapping, and shipping cost calculations
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-gray-600">
                      Enables secure payment processing and transaction management
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-semibold text-gray-700">Live Chat Support</h4>
                    <p className="text-gray-600">
                      Powers our customer support chat functionality
                    </p>
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Globe className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">Marketing and Advertising Cookies</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  These cookies are used to make advertising messages more relevant to you and 
                  your interests. They also perform functions like preventing the same ad from 
                  continuously reappearing and ensuring ads are properly displayed.
                </p>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">How We Use Marketing Cookies</h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>Show you relevant container and logistics advertisements</li>
                  <li>Measure the effectiveness of our advertising campaigns</li>
                  <li>Limit the number of times you see the same advertisement</li>
                  <li>Track conversions and sales attribution</li>
                  <li>Create custom audiences for targeted marketing</li>
                  <li>Personalize content based on your browsing behavior</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Advertising Partners</h3>
                <p className="text-gray-600 mb-4">
                  We work with trusted advertising partners who may place cookies on your device 
                  to show you relevant ads across the internet. These partners include:
                </p>
                
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <ul className="text-gray-600 space-y-2">
                    <li>Google Ads and Google Display Network</li>
                    <li>Facebook and Instagram advertising platforms</li>
                    <li>LinkedIn business advertising</li>
                    <li>Industry-specific logistics and shipping platforms</li>
                  </ul>
                </div>
              </div>

              {/* Managing Cookies */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Settings className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">Managing Your Cookie Preferences</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  You have several options for managing cookies on our website. You can control 
                  which cookies are set and delete existing cookies through your browser settings 
                  or our cookie preference center.
                </p>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Browser Settings</h3>
                <p className="text-gray-600 mb-4">
                  Most web browsers allow you to control cookies through their settings preferences. 
                  Here's how to manage cookies in popular browsers:
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-semibold text-gray-700 mb-2">Google Chrome</h4>
                    <p className="text-sm text-gray-600">
                      Settings → Privacy and Security → Cookies and other site data
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-semibold text-gray-700 mb-2">Mozilla Firefox</h4>
                    <p className="text-sm text-gray-600">
                      Options → Privacy & Security → Cookies and Site Data
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-semibold text-gray-700 mb-2">Safari</h4>
                    <p className="text-sm text-gray-600">
                      Preferences → Privacy → Manage Website Data
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded">
                    <h4 className="font-semibold text-gray-700 mb-2">Microsoft Edge</h4>
                    <p className="text-sm text-gray-600">
                      Settings → Site permissions → Cookies and site data
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Cookie Preference Center</h3>
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <p className="text-gray-600 mb-4">
                    We provide a cookie preference center where you can manage your cookie 
                    settings without affecting essential website functionality. You can:
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>Accept or reject specific categories of cookies</li>
                    <li>View detailed information about each cookie type</li>
                    <li>Change your preferences at any time</li>
                    <li>Access our cookie policy and privacy information</li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Impact of Disabling Cookies</h3>
                <div className="bg-red-50 p-6 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    Disabling certain cookies may affect your website experience:
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>Some features may not work properly or at all</li>
                    <li>You may need to re-enter information on each visit</li>
                    <li>Personalized content and recommendations may not appear</li>
                    <li>Shopping cart contents may not be saved between sessions</li>
                  </ul>
                </div>
              </div>

              {/* Data Protection */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Shield className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">Data Protection and Security</h2>
                </div>
                
                <h3 className="text-lg font-semibold text-blue-600 mb-4">How We Protect Cookie Data</h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>All cookies are transmitted over secure HTTPS connections</li>
                  <li>Sensitive data is encrypted before being stored in cookies</li>
                  <li>We regularly audit our cookie usage and third-party integrations</li>
                  <li>Cookie data is automatically deleted based on expiration dates</li>
                  <li>We comply with GDPR, CCPA, and other privacy regulations</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Data Retention</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">Session Cookies</h4>
                      <p className="text-gray-600">Deleted when you close your browser</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700">Persistent Cookies</h4>
                      <p className="text-gray-600">Remain for a specified period (typically 30 days to 2 years)</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700">Analytics Cookies</h4>
                      <p className="text-gray-600">Automatically expire after 24 months</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Updates to Policy */}
              <div className="mb-12">
                <h2 className="text-xl font-bold text-blue-600 mb-6">Updates to This Cookie Policy</h2>
                
                <p className="text-gray-600 mb-6">
                  We may update this Cookie Policy from time to time to reflect changes in 
                  technology, legal requirements, or our business practices. When we make 
                  significant changes, we will notify you through:
                </p>

                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>A prominent notice on our website</li>
                  <li>Email notifications to registered users</li>
                  <li>Updates to this page with a new "last updated" date</li>
                  <li>Pop-up notifications about cookie preference changes</li>
                </ul>

                <p className="text-gray-600">
                  We encourage you to review this Cookie Policy periodically to stay informed 
                  about how we use cookies and protect your privacy.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Eye className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">Contact Us About Cookies</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  If you have questions about our use of cookies or this Cookie Policy, 
                  please contact us:
                </p>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Protection Officer</h3>
                  <p className="text-gray-600 mb-2">Global Container Exchange</p>
                  <p className="text-gray-600 mb-2">Email: privacy@globalcontainerexchange.com</p>
                  <p className="text-gray-600 mb-2">Phone: 1-(249) 879-0355</p>
                  <p className="text-gray-600 mb-4">
                    Address: 123 Maritime Plaza, Suite 500, Seattle, WA 98101, USA
                  </p>
                  
                  <h4 className="font-semibold text-gray-700 mb-2">Cookie-Specific Inquiries</h4>
                  <p className="text-gray-600">Email: cookies@globalcontainerexchange.com</p>
                </div>

                <p className="text-gray-600 mt-6">
                  We are committed to addressing your cookie-related concerns promptly and 
                  will respond to your inquiry within 30 days.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
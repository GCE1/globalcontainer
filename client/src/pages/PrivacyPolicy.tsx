import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Eye, Lock, Users, FileText, Mail, Calendar, Globe } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Privacy Policy Header */}
        <section 
          className="text-white py-16 relative overflow-hidden"
          style={{
            backgroundImage: `url(/attached_assets/Privacy%20policy.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <Shield className="h-16 w-16 text-secondary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Your privacy is important to us. This policy explains how Global Container Exchange 
                collects, uses, and protects your personal information.
              </p>
              <p className="text-sm opacity-75 mt-4">
                Last updated: January 6, 2025
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-lg shadow-lg p-8 mb-8" style={{backgroundColor: '#eef4ff'}}>
                <h2 className="text-xl font-bold text-blue-600 mb-4">Your Privacy Matters</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  At <strong>Global Container Exchange</strong>, we are committed to protecting your privacy and maintaining the highest standards of data security. 
                  This comprehensive privacy policy explains how we collect, use, protect, and share your information when you use our platform. 
                  We believe in transparency and want you to understand exactly how your data is handled in our global container marketplace.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our privacy practices comply with international data protection regulations including GDPR, CCPA, and other applicable privacy laws. 
                  We regularly review and update our policies to ensure they reflect current best practices and legal requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              
              {/* Information We Collect */}
              <div className="border border-gray-200 rounded-lg shadow-sm p-8 mb-8" style={{backgroundColor: '#eef4ff'}}>
                <div className="flex items-center mb-6">
                  <Eye className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">Information We Collect</h2>
                </div>
                
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  To provide you with the best possible container marketplace experience, we collect various types of information. 
                  This data enables us to process your orders, recommend suitable containers, ensure secure transactions, and continuously 
                  improve our platform. All information is collected lawfully and with appropriate consent where required.
                </p>
                
                <h3 className="text-lg font-semibold text-blue-600 mb-4">Personal Information</h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>Name, email address, and contact information</li>
                  <li>Company name and business details</li>
                  <li>Shipping addresses and location data</li>
                  <li>Account credentials and preferences</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Usage Information</h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>Container search queries and preferences</li>
                  <li>Website usage patterns and interaction data</li>
                  <li>Device information and browser type</li>
                  <li>IP address and geographic location</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Business Information</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Container specifications and requirements</li>
                  <li>Purchase history and transaction records</li>
                  <li>Communication preferences and marketing consent</li>
                  <li>Feedback and customer service interactions</li>
                </ul>
              </div>

              {/* How We Use Information */}
              <div className="border border-gray-200 rounded-lg shadow-sm p-8 mb-8" style={{backgroundColor: '#eef4ff'}}>
                <div className="flex items-center mb-6">
                  <Users className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">How We Use Your Information</h2>
                </div>
                
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Your information is used exclusively to enhance your container trading experience and provide exceptional service. 
                  We process your data for legitimate business purposes including order fulfillment, customer support, platform 
                  improvement, and regulatory compliance. We never use your information for purposes beyond what is necessary 
                  to deliver our services or what you have explicitly consented to.
                </p>
                
                <h3 className="text-lg font-semibold text-blue-600 mb-4">Service Delivery</h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>Process container orders and manage transactions</li>
                  <li>Provide personalized container recommendations</li>
                  <li>Calculate shipping costs and delivery logistics</li>
                  <li>Generate invoices and manage payments</li>
                  <li>Provide customer support and technical assistance</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Communication</h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>Send order confirmations and shipping updates</li>
                  <li>Provide industry insights and market analysis</li>
                  <li>Share product updates and new container availability</li>
                  <li>Send promotional offers (with your consent)</li>
                  <li>Respond to inquiries and support requests</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Platform Improvement</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Develop new features and services</li>
                  <li>Improve search algorithms and recommendations</li>
                  <li>Conduct market research and trend analysis</li>
                  <li>Ensure platform security and prevent fraud</li>
                </ul>
              </div>

              {/* Information Sharing */}
              <div className="border border-gray-200 rounded-lg shadow-sm p-8 mb-8" style={{backgroundColor: '#eef4ff'}}>
                <div className="flex items-center mb-6">
                  <FileText className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">Information Sharing</h2>
                </div>
                
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  We maintain strict data sharing policies to protect your privacy. We do not sell, rent, or trade your personal 
                  information to third parties for marketing purposes. Information sharing is limited to essential business operations, 
                  legal compliance, and service delivery. All third-party partners are carefully vetted and bound by confidentiality 
                  agreements that ensure your data receives the same level of protection we provide.
                </p>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Service Providers</h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>Shipping and logistics partners for container delivery</li>
                  <li>Cloud hosting providers for data storage and processing</li>
                  <li>Email service providers for communication delivery</li>
                  <li>Analytics providers for website performance monitoring</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Legal Requirements</h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>Compliance with applicable laws and regulations</li>
                  <li>Response to legal process or government requests</li>
                  <li>Protection of our rights and property</li>
                  <li>Prevention of fraud and security threats</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Business Transfers</h3>
                <p className="text-gray-600">
                  In the event of a merger, acquisition, or sale of assets, your information 
                  may be transferred as part of the business transaction, subject to equivalent 
                  privacy protections.
                </p>
              </div>

              {/* Data Security */}
              <div className="border border-gray-200 rounded-lg shadow-sm p-8 mb-8" style={{backgroundColor: '#eef4ff'}}>
                <div className="flex items-center mb-6">
                  <Lock className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">Data Security</h2>
                </div>
                
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Data security is fundamental to our operations and your trust. We employ enterprise-grade security measures 
                  including advanced encryption, secure infrastructure, regular security assessments, and comprehensive access controls. 
                  Our security framework follows industry best practices and is regularly audited to ensure the highest level of 
                  protection for your sensitive information.
                </p>

                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>SSL/TLS encryption for all data transmission</li>
                  <li>Secure database storage with access controls</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Employee training on data protection best practices</li>
                  <li>Multi-factor authentication for administrative access</li>
                  <li>Regular data backups and disaster recovery procedures</li>
                </ul>

                <p className="text-gray-600">
                  While we strive to protect your information, no method of transmission over 
                  the internet is 100% secure. We cannot guarantee absolute security but are 
                  committed to maintaining industry-standard protection measures.
                </p>
              </div>

              {/* Your Rights */}
              <div className="border border-gray-200 rounded-lg shadow-sm p-8 mb-8" style={{backgroundColor: '#eef4ff'}}>
                <div className="flex items-center mb-6">
                  <Users className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">Your Rights and Choices</h2>
                </div>
                
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  You have comprehensive control over your personal information and how it's used on our platform. We respect your 
                  privacy rights and provide multiple ways to access, modify, or delete your data. Our commitment to data 
                  transparency means you can always understand what information we have and how it's being used to serve you better.
                </p>
                
                <h3 className="text-lg font-semibold text-blue-600 mb-4">Access and Control</h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>Access and update your personal information through your account</li>
                  <li>Request a copy of the personal data we hold about you</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your data in a portable format</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Communication Preferences</h3>
                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>Opt out of marketing communications at any time</li>
                  <li>Manage notification preferences in your account settings</li>
                  <li>Unsubscribe from newsletters using the provided links</li>
                  <li>Update your contact preferences</li>
                </ul>

                <h3 className="text-lg font-semibold text-blue-600 mb-4">Cookies and Tracking</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Manage cookie preferences through your browser settings</li>
                  <li>Opt out of analytics tracking where technically feasible</li>
                  <li>Control targeted advertising preferences</li>
                </ul>
              </div>

              {/* Data Retention */}
              <div className="border border-gray-200 rounded-lg shadow-sm p-8 mb-8" style={{backgroundColor: '#eef4ff'}}>
                <div className="flex items-center mb-6">
                  <Calendar className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">Data Retention</h2>
                </div>
                
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  We maintain responsible data retention practices that balance business needs with privacy protection. 
                  Your information is kept only as long as necessary for legitimate business purposes, legal compliance, 
                  and service delivery. We regularly review and purge unnecessary data to minimize our data footprint.
                </p>
                
                <p className="text-gray-600 mb-6">
                  We retain your personal information for as long as necessary to:
                </p>

                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>Provide our services and maintain your account</li>
                  <li>Comply with legal obligations and regulatory requirements</li>
                  <li>Resolve disputes and enforce our agreements</li>
                  <li>Maintain business records for tax and accounting purposes</li>
                </ul>

                <p className="text-gray-600">
                  When you delete your account, we will remove or anonymize your personal 
                  information within 30 days, except where we are required to retain certain 
                  records for legal compliance.
                </p>
              </div>

              {/* International Transfers */}
              <div className="border border-gray-200 rounded-lg shadow-sm p-8 mb-8" style={{backgroundColor: '#eef4ff'}}>
                <div className="flex items-center mb-6">
                  <Globe className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">International Data Transfers</h2>
                </div>
                
                <p className="text-gray-600 mb-4">
                  <strong>Global Container Exchange</strong> operates internationally. Your personal information 
                  may be transferred to and processed in countries other than your residence, 
                  including the United States and other jurisdictions where our service providers 
                  are located.
                </p>

                <p className="text-gray-600">
                  We ensure that international transfers are conducted in accordance with 
                  applicable data protection laws and include appropriate safeguards to 
                  protect your information.
                </p>
              </div>

              {/* Children's Privacy */}
              <div className="mb-12">
                <h2 className="text-xl font-bold text-blue-600 mb-6">Children's Privacy</h2>
                
                <p className="text-gray-600">
                  Our services are intended for business use and are not directed to individuals 
                  under the age of 18. We do not knowingly collect personal information from 
                  children under 18. If you believe we have inadvertently collected such 
                  information, please contact us immediately.
                </p>
              </div>

              {/* Policy Updates */}
              <div className="mb-12">
                <h2 className="text-xl font-bold text-blue-600 mb-6">Policy Updates</h2>
                
                <p className="text-gray-600 mb-4">
                  We may update this Privacy Policy periodically to reflect changes in our 
                  practices or applicable laws. We will notify you of material changes by:
                </p>

                <ul className="text-gray-600 space-y-2 mb-6">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending email notifications to registered users</li>
                  <li>Displaying prominent notices on our platform</li>
                </ul>

                <p className="text-gray-600">
                  Continued use of our services after policy updates constitutes acceptance 
                  of the revised terms.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Mail className="h-8 w-8 text-primary mr-3" />
                  <h2 className="text-xl font-bold text-blue-600 m-0">Contact Us</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  If you have questions about this Privacy Policy or our data practices, 
                  please contact us:
                </p>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy Officer</h3>
                  <p className="text-gray-600 mb-2"><strong>Global Container Exchange</strong></p>
                  <p className="text-gray-600 mb-2"><strong>Email:</strong> support@globalcontainerexchange.com</p>
                  <p className="text-gray-600 mb-2"><strong>Phone:</strong> 1-(249) 879-0355</p>
                  <p className="text-gray-600">
                    <strong>Address:</strong> 2-289 walford rd, Sudbury, Ontario, P3E2G8, Canada
                  </p>
                </div>

                <p className="text-gray-600 mt-6">
                  <strong>We are committed to resolving privacy concerns promptly and will respond 
                  to your inquiry within 30 days.</strong>
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
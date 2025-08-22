import { Linkedin, Twitter, Facebook, Youtube } from "lucide-react";
import gceLogo from "@assets/GCE-logo.png";
import { Link } from "wouter";

export default function FooterSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "Pricing", href: "/#search-section" },
        { label: "Memberships", href: "/#memberships-section" },
        { label: "Container Guide", href: "/container-guide" },
        { label: "About Us", href: "/history" },
        { label: "Contact Us", href: "/contact-us" },
        { label: "Industry Insights", href: "/blogs" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Container Trading", href: "#" },
        { label: "Logistics Platform", href: "#" },
        { label: "Global Shipping", href: "#" },
        { label: "Smart Tracking", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#" },
        { label: "Documentation", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "Status Page", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "Compliance", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/global-container-exchange-6b5a54339/", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/GCEenterprise", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="text-white" style={{backgroundColor: "#001937"}}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Link href="/">
                <img 
                  src={gceLogo} 
                  alt="Global Container Exchange" 
                  className="h-[4.2rem] w-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Connecting global trade through innovative container solutions since 2017. 
              Transforming logistics with technology and sustainability.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h6 className="font-semibold text-white mb-4">{section.title}</h6>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {'action' in link ? (
                      <button
                        onClick={link.action}
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-left"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-8 border-gray-600" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 mb-4 md:mb-0">
            © 2025 Global Container Exchange. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 social-icon"
                  aria-label={social.label}
                >
                  <IconComponent className="h-6 w-6" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

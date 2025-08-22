import { Link, useLocation } from "wouter";

export default function Footer() {
  const [location, setLocation] = useLocation();

  const handleContainerGuideClick = () => {
    setLocation('/container-guide');
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 50);
  };

  const handleHomeClick = () => {
    setLocation('/');
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 50);
  };

  const handlePricingClick = () => {
    if (location === '/') {
      // On main page, scroll to section
      const element = document.getElementById("search-section");
      if (element) {
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - 100;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    } else {
      // Navigate to home page first, then scroll
      setLocation('/');
      setTimeout(() => {
        const element = document.getElementById("search-section");
        if (element) {
          const elementPosition = element.offsetTop;
          const offsetPosition = elementPosition - 100;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 50);
    }
  };

  const handleMembershipsClick = () => {
    if (location === '/') {
      // On main page, scroll to section
      const element = document.getElementById("memberships-section");
      if (element) {
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - 100;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    } else {
      // Navigate to home page first, then scroll
      setLocation('/');
      setTimeout(() => {
        const element = document.getElementById("memberships-section");
        if (element) {
          const elementPosition = element.offsetTop;
          const offsetPosition = elementPosition - 100;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 50);
    }
  };

  const handleServiceClick = (path: string) => {
    setLocation(path);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 50);
  };

  const handleAboutUsClick = () => {
    setLocation('/history');
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 50);
  };

  const handleContactUsClick = () => {
    setLocation('/contact-us');
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 50);
  };

  const handleBlogsClick = () => {
    setLocation('/blogs');
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 50);
  };



  const handlePrivacyPolicyClick = () => {
    setLocation('/privacy-policy');
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 50);
  };

  const handleTermsConditionsClick = () => {
    setLocation('/terms-conditions');
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 50);
  };

  const handleCookiePolicyClick = () => {
    setLocation('/cookie-policy');
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 50);
  };
  return (
    <footer className="header-bg text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-4">
            <div className="flex items-center mb-6">
              <Link href="/">
                <img 
                  src="/images/gce-logo.png" 
                  alt="Global Container Exchange Logo" 
                  className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity rounded-md"
                  style={{ 
                    imageRendering: 'auto',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden'
                  }}
                />
              </Link>
            </div>
            <p className="text-gray-300 mb-6">
              The world's premier container marketplace connecting buyers and sellers across 83 countries. We deliver wholesale pricing, quality-assured containers, and comprehensive logistics solutions with 24/7 customer support.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-secondary transition duration-300">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://x.com/GCEenterprise" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary transition duration-300">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.linkedin.com/in/global-container-exchange-6b5a54339/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-secondary transition duration-300">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-secondary transition duration-300">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-2 md:pl-8">
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><button onClick={handleHomeClick} className="text-gray-300 hover:text-secondary transition duration-300 text-left">Home</button></li>
              <li><button onClick={handlePricingClick} className="text-gray-300 hover:text-secondary transition duration-300 text-left">Pricing</button></li>
              <li><button onClick={handleMembershipsClick} className="text-gray-300 hover:text-secondary transition duration-300 text-left">Memberships</button></li>
              <li><button onClick={handleContainerGuideClick} className="text-gray-300 hover:text-secondary transition duration-300 text-left">Container Guide</button></li>

              <li><button onClick={handleAboutUsClick} className="text-gray-300 hover:text-secondary transition duration-300 text-left">About Us</button></li>
              <li><button onClick={handleContactUsClick} className="text-gray-300 hover:text-secondary transition duration-300 text-left">Contact Us</button></li>
              <li><button onClick={handleBlogsClick} className="text-gray-300 hover:text-secondary transition duration-300 text-left">Industry Insights</button></li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-bold mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li><button onClick={() => handleServiceClick('/container-sales')} className="text-gray-300 hover:text-secondary transition duration-300 text-left">Container Bulk Sales</button></li>
              <li><button onClick={() => handleServiceClick('/container-leasing')} className="text-gray-300 hover:text-secondary transition duration-300 text-left">Container Leasing</button></li>
              <li><button onClick={() => handleServiceClick('/container-transport')} className="text-gray-300 hover:text-secondary transition duration-300 text-left">Container Transport</button></li>
              <li><button onClick={() => handleServiceClick('/container-storage')} className="text-gray-300 hover:text-secondary transition duration-300 text-left">Container Storage</button></li>
              <li><button onClick={() => handleServiceClick('/container-tracking')} className="text-gray-300 hover:text-secondary transition duration-300 text-left">Container Tracking</button></li>
              <li><button onClick={() => handleServiceClick('/container-modifications')} className="text-gray-300 hover:text-secondary transition duration-300 text-left">Container Modifications</button></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4">

              <li className="flex items-start">
                <i className="fas fa-phone-alt mt-1 mr-3 text-secondary"></i>
                <span className="text-gray-300">1-(249) 879-0355</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3 text-secondary"></i>
                <span className="text-gray-300">support@globalcontainerexchange.com</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-clock mt-1 mr-3 text-secondary"></i>
                <span className="text-gray-300">7 Days a Week, 24hrs a Day</span>
              </li>
            </ul>
            
            {/* Container Image */}
            <div className="mt-8 flex justify-end">
              <img 
                src="/images/footer-containers.png" 
                alt="Shipping Containers" 
                className="w-48 h-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Global Container Exchange. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              <button onClick={handlePrivacyPolicyClick} className="text-gray-400 hover:text-secondary text-sm transition duration-300">Privacy Policy</button>
              <button onClick={handleTermsConditionsClick} className="text-gray-400 hover:text-secondary text-sm transition duration-300">Terms & Conditions</button>
              <button onClick={handleCookiePolicyClick} className="text-gray-400 hover:text-secondary text-sm transition duration-300">Cookie Policy</button>
              <span className="text-gray-600">|</span>
              <Link href="/admin/login" className="text-gray-400 hover:text-orange-400 text-sm transition duration-300 font-medium">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

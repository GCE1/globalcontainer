import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { useSimpleCart } from "@/hooks/useSimpleCart";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, cartItems } = useSimpleCart();
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { currentTier, isActive } = useSubscription();
  const { t } = useTranslation();





  // Determine cart route based on current context
  const getCartRoute = () => {
    // If user is in Wholesale Manager or Leasing Manager sections, use B2B cart
    if (location.includes('/wholesale-manager') || location.includes('/leasing-manager')) {
      return '/cart/b2b';
    }
    // Default to consumer cart
    return '/cart';
  };

  const getTierDisplayName = (tier: string | null) => {
    const names = {
      insights: "Insights",
      professional: "Professional",
      expert: "Expert"
    };
    return tier ? names[tier as keyof typeof names] || "Free" : "Free";
  };

  const handleLogout = async () => {
    // Clear all possible auth tokens and user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRoles');
    
    // Call logout endpoint to clear server sessions
    try {
      await fetch('/api/logout', {
        method: 'GET',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error calling logout endpoint:', error);
    }
    
    // Force full page reload to clear all state
    window.location.href = '/';
    window.location.reload();
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
    setLocation('/memberships');
  };

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



  const handleMarketplaceClick = () => {
    setLocation('/container-marketplace');
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 50);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - 100; // Offset to show the heading
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header className="header-bg text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center min-h-[4rem]">
          {/* Logo - Left positioned */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img 
                src="/images/gce-logo.png" 
                alt="Global Container Exchange Logo" 
                className="h-12 sm:h-13 md:h-14 lg:h-16 w-auto rounded-md"
                style={{ 
                  imageRendering: 'auto',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden'
                }}
              />
            </Link>
          </div>
          
          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden md:flex items-center justify-center space-x-3 lg:space-x-6 ml-6 lg:ml-10 flex-1">
            <button onClick={handleHomeClick} className="nav-item text-xs lg:text-sm font-medium whitespace-nowrap hover:text-secondary transition-colors">{t('nav.home')}</button>
            <button onClick={handlePricingClick} className="nav-item text-xs lg:text-sm font-medium whitespace-nowrap hover:text-secondary transition-colors">{t('nav.pricing')}</button>
            <button onClick={handleMembershipsClick} className="nav-item text-xs lg:text-sm font-medium whitespace-nowrap hover:text-secondary transition-colors">{t('nav.memberships')}</button>
            <button onClick={handleContainerGuideClick} className="nav-item text-xs lg:text-sm font-medium whitespace-nowrap hover:text-secondary transition-colors">{t('nav.containerGuide')}</button>

            <button onClick={handleAboutUsClick} className="nav-item text-xs lg:text-sm font-medium whitespace-nowrap hover:text-secondary transition-colors">{t('nav.aboutUs')}</button>
            <button onClick={handleContactUsClick} className="nav-item text-xs lg:text-sm font-medium whitespace-nowrap hover:text-secondary transition-colors">{t('nav.contactUs')}</button>
            <button onClick={handleBlogsClick} className="nav-item text-xs lg:text-sm font-medium whitespace-nowrap hover:text-secondary transition-colors">{t('nav.industryInsights')}</button>
          </div>
          
          {/* Right side - Cart, Sign in, language, and mobile menu */}
          <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-5 ml-auto pl-4 lg:pl-6 border-l border-blue-700/20 flex-shrink-0">
            {/* Cart Button - Both mobile and desktop */}
            <Link href={getCartRoute()} className="relative">
              <Button variant="ghost" size="sm" className="text-white hover:text-secondary p-2">
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-bold text-[10px] md:text-xs">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Hamburger Menu */}
            <Button 
              variant="ghost" 
              size="sm"
              className="md:hidden text-white hover:bg-blue-700/50 hover:text-secondary p-2 rounded-lg border border-blue-600/50 bg-blue-800/30"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            {/* Desktop Authentication Section */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-5">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isAuthenticated && user && user.id !== "demo-user" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:text-secondary p-0 h-auto flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <User className="h-5 w-5" />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-medium">{user.firstName || user.email}</div>
                          <div className="text-xs opacity-75">{getTierDisplayName(currentTier)}</div>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/memberships" className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        {t('nav.mySubscription')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('nav.signOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className="text-xs lg:text-xs font-medium hover:text-secondary transition-colors">{t('nav.memberSignIn')}</Link>
              )}
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-blue-900/95 backdrop-blur-sm border-t border-blue-700/30">
            <div className="flex flex-col space-y-1 py-4">
              <button 
                onClick={() => {
                  handleHomeClick();
                  setMobileMenuOpen(false);
                }} 
                className="text-white text-base py-3 px-4 hover:bg-blue-800/50 hover:text-secondary transition-colors text-left rounded-lg mx-2"
              >
                {t('nav.home')}
              </button>
              <button 
                onClick={() => {
                  handlePricingClick();
                  setMobileMenuOpen(false);
                }} 
                className="text-white text-base py-3 px-4 hover:bg-blue-800/50 hover:text-secondary transition-colors text-left rounded-lg mx-2"
              >
                {t('nav.pricing')}
              </button>
              <button 
                onClick={() => {
                  handleMembershipsClick();
                  setMobileMenuOpen(false);
                }} 
                className="text-white text-base py-3 px-4 hover:bg-blue-800/50 hover:text-secondary transition-colors text-left rounded-lg mx-2"
              >
                {t('nav.memberships')}
              </button>
              <button 
                onClick={() => {
                  handleContainerGuideClick();
                  setMobileMenuOpen(false);
                }} 
                className="text-white text-base py-3 px-4 hover:bg-blue-800/50 hover:text-secondary transition-colors text-left rounded-lg mx-2"
              >
                {t('nav.containerGuide')}
              </button>
              <button 
                onClick={() => {
                  handleAboutUsClick();
                  setMobileMenuOpen(false);
                }} 
                className="text-white text-base py-3 px-4 hover:bg-blue-800/50 hover:text-secondary transition-colors text-left rounded-lg mx-2"
              >
                {t('nav.aboutUs')}
              </button>
              <button 
                onClick={() => {
                  handleContactUsClick();
                  setMobileMenuOpen(false);
                }} 
                className="text-white text-base py-3 px-4 hover:bg-blue-800/50 hover:text-secondary transition-colors text-left rounded-lg mx-2"
              >
                {t('nav.contactUs')}
              </button>
              <button 
                onClick={() => {
                  handleBlogsClick();
                  setMobileMenuOpen(false);
                }} 
                className="text-white text-base py-3 px-4 hover:bg-blue-800/50 hover:text-secondary transition-colors text-left rounded-lg mx-2"
              >
                {t('nav.industryInsights')}
              </button>
              
              {/* Mobile Authentication & Language Section */}
              <div className="border-t border-blue-700/30 mt-4 pt-4 mx-2">
                {isAuthenticated && user && user.id !== "demo-user" ? (
                  <div className="space-y-2">
                    <div className="text-white text-sm px-4 py-2">
                      <div className="font-medium">{user.firstName || user.email}</div>
                      <div className="text-xs opacity-75">{getTierDisplayName(currentTier)}</div>
                    </div>
                    <Link 
                      href="/memberships" 
                      className="block text-white text-base py-3 px-4 hover:bg-blue-800/50 hover:text-secondary transition-colors rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.mySubscription')}
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-white text-base py-3 px-4 hover:bg-blue-800/50 hover:text-secondary transition-colors rounded-lg"
                    >
                      {t('nav.signOut')}
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    className="block text-white text-base py-3 px-4 hover:bg-blue-800/50 hover:text-secondary transition-colors rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.memberSignIn')}
                  </Link>
                )}
                
                {/* Mobile Language Switcher */}
                <div className="mt-4 px-2">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

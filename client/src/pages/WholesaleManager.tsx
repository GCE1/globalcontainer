import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WholesaleContainerSearch from "@/components/WholesaleContainerSearch";
import WholesaleAnalyticsCards from "@/components/WholesaleAnalyticsCards";
import WholesaleInventory from "@/components/WholesaleInventory";
import AddContainerForm from "@/components/AddContainerForm";
import ContractsManagement from "@/components/ContractsManagement";
import InvoiceManagement from "@/components/InvoiceManagement";
import WholesaleCalendar from "@/components/WholesaleCalendarComplete";
import EmployeeManagement from "@/pages/EmployeeManagement";
import WholesaleEmailManagement from "@/pages/WholesaleEmailManagement";
import OrganizationalSettings from "@/pages/OrganizationalSettings";
import CartModal from "@/components/CartModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, ShoppingCart, Truck, Settings, BarChart3, FileText, FileCheck, Calendar, Mail, Container, DollarSign, Search, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { LuContainer } from 'react-icons/lu';
import OptimizedHeroImage from '@/components/OptimizedHeroImage';
import wholesaleManagerHero from '@assets/Wholesale Manager_1749503099655.png';

export default function WholesaleManager() {
  const [activeSection, setActiveSection] = useState<string>('platform');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  
  // Check if this is admin review mode (bypass subscription guard)
  const isAdminReview = window.location.pathname.startsWith('/admin-review/');

  const handleSectionChange = (section: string) => {
    if (section === activeSection) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSection(section);
      setContentKey(prev => prev + 1);
      setIsTransitioning(false);
    }, 150);
  };

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'platform':
        return (
          <div className="space-y-6">
            {/* Analytics Cards */}
            <WholesaleAnalyticsCards />
            
            {/* Dynamic Marketing Ad Copy Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 my-6">
              <div className="text-center max-w-4xl mx-auto">
                {(() => {
                  const getSectionContent = () => {
                    switch (activeSection as string) {
                      case 'platform':
                        return {
                          title: "Wholesale Manager - Your Global Container Trading Hub",
                          description: "The Wholesale Manager provides access to the world's largest container marketplace with real-time inventory from 1.2+ Million containers across global depots. This powerful platform enables bulk container purchasing, competitive pricing analysis, and streamlined wholesale operations for shipping lines, logistics companies, and container traders.",
                          action: "Leverage our comprehensive search tools below to discover wholesale container opportunities and secure competitive bulk rates across our international network of suppliers and depots."
                        };
                      case 'inventory':
                        return {
                          title: "Inventory - Complete Container Marketplace",
                          description: "Access our extensive container inventory featuring diverse types, sizes, and conditions from trusted global suppliers. Our real-time inventory system provides instant availability updates, detailed condition reports, and competitive wholesale pricing for efficient bulk procurement decisions.",
                          action: "Browse thousands of containers available for immediate purchase with transparent pricing and detailed specifications to optimize your wholesale container acquisition strategy."
                        };
                      case 'contracts':
                        return {
                          title: "Contracts - Wholesale Agreement Management",
                          description: "Streamline your wholesale container contracts with our comprehensive agreement management system. Handle bulk purchase orders, manage supplier relationships, track delivery schedules, and maintain compliance documentation for large-scale container transactions.",
                          action: "Manage your wholesale contracts efficiently while discovering new bulk container opportunities through our global marketplace search below."
                        };
                      case 'invoices':
                        return {
                          title: "Invoices - Wholesale Financial Management",
                          description: "Simplify your wholesale container financial operations with automated invoicing, bulk payment processing, and comprehensive financial reporting. Track wholesale transactions, manage supplier payments, and maintain detailed records for efficient business operations.",
                          action: "Optimize your wholesale financial processes and explore new container trading opportunities to maximize your return on investment across global markets."
                        };
                      default:
                        return {
                          title: "Wholesale Container Trading Platform",
                          description: "Access the world's most comprehensive wholesale container marketplace with real-time pricing from 1.2+ Million containers across global suppliers. Our advanced platform provides instant market insights, bulk purchasing capabilities, and streamlined wholesale management for container traders and shipping companies.",
                          action: "Discover competitive wholesale rates and unlock the power of global container trading with our comprehensive marketplace search tools."
                        };
                    }
                  };
                  
                  const content = getSectionContent();
                  
                  return (
                    <>
                      <h3 className="text-xl font-bold text-[#001937] mb-3 flex items-center justify-center gap-3">
                        {(() => {
                          const iconColors = [
                            'text-blue-500',    // Platform - blue
                            'text-green-500',   // Inventory - green
                            'text-purple-500',  // Contracts - purple
                            'text-orange-500'   // Invoices - orange
                          ];
                          
                          const icons = [
                            Container,      // Platform
                            LuContainer,    // Inventory
                            FileText,       // Contracts
                            FileCheck       // Invoices
                          ];
                          
                          const sectionIndex = ['platform', 'inventory', 'contracts', 'invoices'].indexOf(activeSection);
                          const IconComponent = icons[sectionIndex] || Container;
                          const iconColor = iconColors[sectionIndex] || 'text-blue-500';
                          
                          return <IconComponent className={`w-6 h-6 ${iconColor}`} />;
                        })()}
                        {content.title}
                      </h3>
                      <p className="text-gray-700 text-base leading-relaxed mb-4">
                        {content.description}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        {content.action}
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>
            
            {/* Container Search Section */}
            <WholesaleContainerSearch onOpenCart={() => setShowCartModal(true)} />
          </div>
        );
      
      case 'inventory':
        return (
          <div className="space-y-6">
            <WholesaleInventory />
          </div>
        );

      case 'add-container':
        return (
          <div className="space-y-6">
            <AddContainerForm />
          </div>
        );

      case 'contracts':
        return (
          <div className="space-y-6">
            <ContractsManagement />
          </div>
        );

      case 'invoices':
        return (
          <div className="space-y-6">
            <InvoiceManagement />
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <WholesaleCalendar />
          </div>
        );

      case 'email':
        return (
          <div className="space-y-6">
            <WholesaleEmailManagement />
          </div>
        );

      case 'organization':
        return (
          <div className="space-y-6">
            <OrganizationalSettings />
          </div>
        );

      case 'employee-management':
        return (
          <div className="space-y-6">
            <EmployeeManagement />
          </div>
        );

      default:
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-[#001937] mb-4">
                Section Not Found
              </h3>
              <p className="text-gray-600">
                The requested section is not available.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  const navigationTabs = [
    { id: 'platform', label: 'Dashboard', icon: BarChart3 },
    { 
      id: 'inventory', 
      label: 'View Containers', 
      icon: Container,
      hasSubmenu: true,
      submenu: [
        { id: 'inventory', label: 'My Container Inventory', icon: Container },
        { id: 'add-container', label: 'Add Container', icon: Plus }
      ]
    },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: FileCheck },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'email', label: 'Email Management', icon: Mail },
    { 
      id: 'organization', 
      label: 'Settings', 
      icon: Settings,
      hasSubmenu: true,
      submenu: [
        { id: 'organization', label: 'Organization Settings', icon: Settings },
        { id: 'employee-management', label: 'Employee Management', icon: Users }
      ]
    }
  ];

  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Hero Section */}
        <section 
          className="relative text-white py-16 px-6 lg:px-8 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 25, 55, 0.7), rgba(0, 25, 55, 0.7)), url('${wholesaleManagerHero}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            boxShadow: '0 3px 15px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Wholesale Manager
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Advanced wholesale trading and inventory management system with real-time analytics and global marketplace access.
              </p>
            </div>
          </div>
        </section>

        {/* Navigation and Content Layout */}
        <section className="py-4 sm:py-8">
          <div className="container mx-auto px-3 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
              {/* Mobile: Horizontal Navigation */}
              <div 
                className="block lg:hidden w-full p-4 rounded-xl shadow-lg mb-4"
                style={{
                  background: 'linear-gradient(135deg, #001937 0%, #4a90e2 100%)'
                }}
              >
                <h2 className="text-base font-semibold text-white mb-3">Navigation</h2>
                {navigationTabs.map((tab, index) => {
                  const iconColors = [
                    'text-yellow-300', 'text-green-300', 'text-blue-300', 'text-cyan-300',
                    'text-orange-300', 'text-purple-300', 'text-pink-300', 'text-red-300'
                  ];
                  
                  const IconComponent = tab.icon;
                  const isActive = activeSection === tab.id;
                  const iconColor = iconColors[index % iconColors.length];
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSectionChange(tab.id)}
                      className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-center transition-all duration-200 ${
                        isActive 
                          ? 'bg-white/20 text-white shadow-md' 
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <IconComponent className={`h-4 w-4 ${iconColor}`} />
                      <span className="text-xs font-medium leading-tight">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Desktop: Vertical Navigation */}
              <div 
                className="hidden lg:block w-64 p-6 rounded-2xl shadow-lg flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #001937 0%, #4a90e2 100%)'
                }}
              >
                <h2 className="text-lg font-semibold text-white mb-4">Navigation</h2>
                <nav className="space-y-2">
                  {navigationTabs.map((tab, index) => {
                    const iconColors = [
                      'text-yellow-300', 'text-green-300', 'text-blue-300', 'text-cyan-300',
                      'text-orange-300', 'text-purple-300', 'text-pink-300', 'text-red-300'
                    ];
                    
                    const IconComponent = tab.icon;
                    const isActive = activeSection === tab.id;
                    const iconColor = iconColors[index % iconColors.length];
                    const isExpanded = expandedMenus.includes(tab.id);
                    const hasSubmenu = tab.hasSubmenu && tab.submenu;
                    
                    return (
                      <div key={tab.id}>
                        <button
                          onClick={() => {
                            if (hasSubmenu) {
                              toggleSubmenu(tab.id);
                            } else {
                              handleSectionChange(tab.id);
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                            isActive 
                              ? 'bg-white/20 text-white shadow-md' 
                              : 'text-white/70 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <IconComponent className={`h-5 w-5 ${iconColor}`} />
                          <span className="text-sm font-medium flex-1">{tab.label}</span>
                          {hasSubmenu && (
                            isExpanded ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        
                        {hasSubmenu && isExpanded && (
                          <div className="ml-4 mt-1 space-y-1">
                            {tab.submenu.map((subItem) => {
                              const SubIconComponent = subItem.icon;
                              const isSubActive = activeSection === subItem.id;
                              
                              return (
                                <button
                                  key={subItem.id}
                                  onClick={() => handleSectionChange(subItem.id)}
                                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all duration-200 ${
                                    isSubActive 
                                      ? 'bg-white/30 text-white shadow-sm' 
                                      : 'text-white/60 hover:bg-white/15 hover:text-white/80'
                                  }`}
                                >
                                  <SubIconComponent className="h-4 w-4 text-white/70" />
                                  <span className="text-xs font-medium">{subItem.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* Right: Main Content Area */}
              <div className="flex-1">
                {!isTransitioning && (
                  <div 
                    key={contentKey}
                    className={`transition-all duration-300 ${
                      isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                    }`}
                  >
                    {renderContent()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <Footer />
        
        <CartModal
          isOpen={showCartModal}
          onClose={() => setShowCartModal(false)}
          mode="b2b"
        />
      </div>
  );
}
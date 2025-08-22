import { Switch, Route } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { imageCache } from "@/lib/imageCache";
import { ErrorHandler } from "@/lib/errorHandler";
import ScrollToTop from "@/components/ScrollToTop";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Memberships from "@/pages/Memberships";
import LeasingManager from "@/pages/LeasingManager";
import WholesaleManager from "@/pages/WholesaleManager";
import About from "@/pages/About";
import AboutUs from "@/pages/AboutUs";
import ContactUs from "@/pages/ContactUs";
import History from "@/pages/History";
import ColorPaletteViewer from "@/pages/ColorPaletteViewer";
import BuyersGuide from "@/pages/BuyersGuide";
import Blog from "@/pages/Blog";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import TermsConditions from "@/pages/TermsConditions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookiePolicy from "@/pages/CookiePolicy";
import ContainerSales from "@/pages/ContainerSales";
import ContainerLeasing from "@/pages/ContainerLeasing";
import ContainerTransport from "@/pages/ContainerTransport";
import ContainerStorage from "@/pages/ContainerStorage";
import ContainerTracking from "@/pages/ContainerTracking";
import ContainerModifications from "@/pages/ContainerModifications";
import ContainerPortfolio from "@/pages/ContainerPortfolio";
import RequestQuote from "@/pages/RequestQuote";
import Subscribe from "@/pages/Subscribe";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import SetPassword from "@/pages/SetPassword";
// CustomerInfo removed - redirects to Payment page
import Payment from "@/pages/Payment";

import ContainerSearch from "@/pages/ContainerSearch";
import ContainerMarketplace from "@/pages/ContainerMarketplace";
import InsightsAnalytics from "@/pages/InsightsAnalytics";
import EmployeeManagement from "@/pages/EmployeeManagement";
import InternalMessaging from "@/pages/InternalMessaging";
import OrganizationalSettings from "@/pages/OrganizationalSettings";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogin from "@/pages/AdminLogin";
import AddProduct from "@/pages/AddProduct";
import AdminSettings from "@/pages/AdminSettings";
import SimpleMassEmail from "@/pages/SimpleMassEmail";
// Removed AdminInbox
// Removed email pages
import MembershipPaywall from "@/pages/MembershipPaywall";
import MembershipRequired from "@/pages/MembershipRequired";
import MembershipDashboard from "@/pages/MembershipDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/memberships" component={Memberships} />
      <Route path="/membership" component={Memberships} />
      <Route path="/membership-dashboard" component={MembershipDashboard} />
      {/* Membership Paywall */}
      <Route path="/membership-required" component={MembershipRequired} />
      
      {/* Admin Review Routes - No Authentication Required */}
      <Route path="/admin-review/insights-analytics" component={InsightsAnalytics} />
      <Route path="/admin-review/leasing-manager" component={LeasingManager} />
      <Route path="/admin-review/wholesale-manager" component={WholesaleManager} />
      <Route path="/admin-review/container-search" component={ContainerSearch} />

      {/* Protected Routes - Require Membership */}
      <Route path="/insights-analytics">
        {() => (
          <ProtectedRoute requiredPlan="insights">
            <InsightsAnalytics />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/leasing-manager">
        {() => (
          <ProtectedRoute requiredPlan="expert">
            <LeasingManager />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/wholesale-manager">
        {() => (
          <ProtectedRoute requiredPlan="pro">
            <WholesaleManager />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/employee-management">
        {() => (
          <ProtectedRoute requiredPlan="expert">
            <EmployeeManagement />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/internal-messaging">
        {() => (
          <ProtectedRoute requiredPlan="expert">
            <InternalMessaging />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/organizational-settings">
        {() => (
          <ProtectedRoute requiredPlan="expert">
            <OrganizationalSettings />
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Public Routes - No Membership Required */}
      <Route path="/about" component={About} />
      <Route path="/about-us" component={AboutUs} />
      <Route path="/contact-us" component={ContactUs} />
      <Route path="/history" component={History} />
      <Route path="/container-guide" component={BuyersGuide} />
      <Route path="/blog" component={Blog} />
      <Route path="/blogs" component={Blog} />
      <Route path="/cart">
        {() => <Cart mode="consumer" />}
      </Route>
      <Route path="/cart/b2b">
        {() => <Cart mode="b2b" />}
      </Route>
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-confirmation" component={OrderConfirmation} />
      <Route path="/terms-conditions" component={TermsConditions} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/container-sales" component={ContainerSales} />
      <Route path="/container-leasing" component={ContainerLeasing} />
      <Route path="/container-transport" component={ContainerTransport} />
      <Route path="/container-storage" component={ContainerStorage} />
      <Route path="/container-tracking" component={ContainerTracking} />
      <Route path="/container-modifications" component={ContainerModifications} />
      <Route path="/container-portfolio" component={ContainerPortfolio} />
      <Route path="/request-quote" component={RequestQuote} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/login" component={Login} />
      <Route path="/auth" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/set-password" component={SetPassword} />
      {/* Redirect customer-info to payment */}
      <Route path="/customer-info">
        {() => {
          window.location.href = '/payment';
          return null;
        }}
      </Route>
      <Route path="/payment" component={Payment} />
      <Route path="/membership-dashboard" component={MembershipDashboard} />

      <Route path="/container-search" component={ContainerSearch} />
      <Route path="/container-marketplace" component={ContainerMarketplace} />
      
      {/* Remove development navigation routes for production */}
      {/* <Route path="/color-palette" component={ColorPaletteViewer} /> - DEV ONLY */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/add-product" component={AddProduct} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/simple-mass-email" component={SimpleMassEmail} />
      {/* Removed admin inbox route */}
      
      {/* Removed email administration routes */}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize image preloading for container service pages
  useEffect(() => {
    // Preload critical container service images in the background
    imageCache.preloadContainerServiceImages();
    
    // Initialize error handler and suppress MetaMask connection errors
    const errorHandler = ErrorHandler.getInstance();
    errorHandler.suppressError('MetaMask');
    errorHandler.suppressError('chrome-extension');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

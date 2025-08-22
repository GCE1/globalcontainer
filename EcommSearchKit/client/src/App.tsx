import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import DrayageTrucking from "@/pages/DrayageTrucking";
import DrayageBrokerage from "@/pages/DrayageBrokerage";
import DrayageHybrid from "@/pages/DrayageHybrid";
import DrayageComplete from "@/pages/DrayageComplete";
import Features from "@/pages/Features";
import LeaseReporting from "@/pages/LeaseReporting";
import AccountSetup from "@/pages/AccountSetup";
import MembershipSettings from "@/pages/MembershipSettings";
import ClientPortal from "@/pages/ClientPortal";
import EnterpriseMembership from "@/pages/EnterpriseMembership";
import CompletePackagePage from "@/pages/CompletePackagePage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/solutions/drayage-carrier" component={DrayageTrucking} />
        <Route path="/solutions/drayage-broker" component={DrayageBrokerage} />
        <Route path="/solutions/drayage-hybrid" component={DrayageHybrid} />
        <Route path="/solutions/complete" component={DrayageComplete} />
        <Route path="/features" component={Features} />
        <Route path="/reports/leasing" component={LeaseReporting} />
        <Route path="/settings/account-setup" component={AccountSetup} />
        <Route path="/settings/membership" component={MembershipSettings} />
        <Route path="/portal" component={ClientPortal} />
        <Route path="/enterprise" component={EnterpriseMembership} />
        <Route path="/complete-package" component={CompletePackagePage} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Shield,
  LogOut,
  Bell
} from "lucide-react";

interface AdminNavigationProps {
  adminInfo?: {
    user?: {
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    twoFactorEnabled: boolean;
  };
  onLogout?: () => void;
}

export default function AdminNavigation({ adminInfo, onLogout }: AdminNavigationProps) {
  const [location] = useLocation();

  const navigationItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: Users
    },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: ShoppingCart
    },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: BarChart3
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: Settings
    },
    {
      path: "/admin/security",
      label: "Security",
      icon: Shield
    }
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location === path;
    }
    return location.startsWith(path);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Admin Console</h2>
            <p className="text-xs text-gray-500">GCE Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);
          
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant={active ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        {adminInfo?.user && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {adminInfo.user.firstName?.[0]?.toUpperCase()}
                  {adminInfo.user.lastName?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {adminInfo.user.firstName} {adminInfo.user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {adminInfo.user.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {adminInfo.user.role?.replace('_', ' ').toUpperCase()}
              </Badge>
              {adminInfo.twoFactorEnabled && (
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  2FA
                </Badge>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, Package, MapPin } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Global Container Exchange
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Containers
              </Button>
            </Link>
            <Link href="/complete-package">
              <Button variant="ghost" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Complete Package
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
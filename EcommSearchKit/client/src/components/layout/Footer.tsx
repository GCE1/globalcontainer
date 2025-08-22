import { Package } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center">
          <Package className="h-6 w-6 text-blue-400 mr-2" />
          <span className="text-lg font-semibold">Global Container Exchange</span>
        </div>
        <p className="text-center text-gray-400 mt-4">
          Advanced container procurement with intelligent location search
        </p>
      </div>
    </footer>
  );
};

export default Footer;
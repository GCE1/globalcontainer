import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import { containerTypes, containerConditions } from "@/lib/utils";

interface SearchQuery {
  query: string;
  containerType: string;
  containerCondition: string;
  postalCode: string;
  searchWithinRadius: boolean;
}

interface SimpleSearchProps {
  onSearch: (query: SearchQuery) => void;
}

const SimpleSearch = ({ onSearch }: SimpleSearchProps) => {
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    query: "",
    containerType: "",
    containerCondition: "",
    postalCode: "",
    searchWithinRadius: false
  });

  const handleSearch = () => {
    // Auto-detect ZIP codes and enable location search
    const zipCodePattern = /^\b(\d{5}(-\d{4})?|[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d)\b$/;
    let enhancedQuery = { ...searchQuery };
    
    if (searchQuery.query && zipCodePattern.test(searchQuery.query.trim())) {
      enhancedQuery = {
        ...searchQuery,
        postalCode: searchQuery.query.trim(),
        searchWithinRadius: true,
        query: ""
      };
      console.log('Auto-detected ZIP code:', enhancedQuery.postalCode);
    }
    
    onSearch(enhancedQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <div className="space-y-6">
          {/* Search Input */}
          <div>
            <Label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-2">
              Search Containers or Enter ZIP Code
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                id="search-query"
                value={searchQuery.query}
                onChange={(e) => setSearchQuery({ ...searchQuery, query: e.target.value })}
                className="pl-10 text-lg"
                placeholder="Enter container specifications or ZIP code (e.g., 75141, 80221)"
              />
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Container Type Dropdown */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Container Type
              </Label>
              <Select 
                value={searchQuery.containerType} 
                onValueChange={(value) => setSearchQuery({ ...searchQuery, containerType: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {containerTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Container Condition Dropdown */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Container Condition
              </Label>
              <Select 
                value={searchQuery.containerCondition} 
                onValueChange={(value) => setSearchQuery({ ...searchQuery, containerCondition: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Conditions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Conditions</SelectItem>
                  {containerConditions.map((condition) => (
                    <SelectItem key={condition.id} value={condition.id}>
                      {condition.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {searchQuery.postalCode || (searchQuery.query && /^\d{5}/.test(searchQuery.query)) ? (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Search Near Location
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Containers
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSearchQuery({ ...searchQuery, query: "75141" })}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
              >
                75141 (Dallas)
              </button>
              <button
                onClick={() => setSearchQuery({ ...searchQuery, query: "80221" })}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
              >
                80221 (Denver)
              </button>
              <button
                onClick={() => setSearchQuery({ ...searchQuery, containerType: "20DC", containerCondition: "Brand New" })}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200"
              >
                20ft Brand New
              </button>
              <button
                onClick={() => setSearchQuery({ ...searchQuery, containerType: "40HC", containerCondition: "Cargo Worthy" })}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200"
              >
                40ft High Cube
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleSearch;
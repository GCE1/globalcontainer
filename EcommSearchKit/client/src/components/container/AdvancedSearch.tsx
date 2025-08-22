import { useState } from "react";
import { Link } from "wouter";
import { 
  Accordion,
  AccordionContent,
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search, ChevronDown, ChevronUp, ArrowRight, CheckCircle } from "lucide-react";
import { containerTypes, containerConditions, regions } from "@/lib/utils";

interface SearchQuery {
  query: string;
  containerTypes: string[];
  containerConditions: string[];
  region: string;
  city: string;
  postalCode: string;
  searchWithinRadius: boolean;
  searchRadius: string;
  priceMin: string;
  priceMax: string;
  availability: string;
}

interface AdvancedSearchProps {
  onSearch: (query: SearchQuery) => void;
}

const AdvancedSearch = ({ onSearch }: AdvancedSearchProps) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    query: "",
    containerTypes: [],
    containerConditions: [],
    region: "",
    city: "",
    postalCode: "",
    searchWithinRadius: false,
    searchRadius: "50", // Default 50 miles
    priceMin: "",
    priceMax: "",
    availability: "all"
  });

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery({
      ...searchQuery,
      query: e.target.value
    });
  };

  const handleContainerTypeChange = (checked: boolean | "indeterminate", type: string) => {
    if (checked) {
      setSearchQuery({
        ...searchQuery,
        containerTypes: [...searchQuery.containerTypes, type]
      });
    } else {
      setSearchQuery({
        ...searchQuery,
        containerTypes: searchQuery.containerTypes.filter(t => t !== type)
      });
    }
  };

  const handleConditionChange = (checked: boolean | "indeterminate", condition: string) => {
    if (checked) {
      setSearchQuery({
        ...searchQuery,
        containerConditions: [...searchQuery.containerConditions, condition]
      });
    } else {
      setSearchQuery({
        ...searchQuery,
        containerConditions: searchQuery.containerConditions.filter(c => c !== condition)
      });
    }
  };

  const handleRegionChange = (value: string) => {
    setSearchQuery({
      ...searchQuery,
      region: value
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery({
      ...searchQuery,
      city: e.target.value
    });
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery({
      ...searchQuery,
      postalCode: e.target.value
    });
  };

  const handleRadiusChange = (checked: boolean) => {
    console.log("Search within radius changed:", checked);
    setSearchQuery({
      ...searchQuery,
      searchWithinRadius: checked
    });
  };
  
  const handleSearchRadiusChange = (value: string) => {
    setSearchQuery({
      ...searchQuery,
      searchRadius: value
    });
  };

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery({
      ...searchQuery,
      priceMin: e.target.value
    });
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery({
      ...searchQuery,
      priceMax: e.target.value
    });
  };

  const handleAvailabilityChange = (value: string) => {
    setSearchQuery({
      ...searchQuery,
      availability: value
    });
  };

  const handleSearch = () => {
    // Check if the query looks like a zip code and auto-enable location search
    const zipCodePattern = /^\b(\d{5}(-\d{4})?|[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d)\b$/;
    let enhancedQuery = { ...searchQuery };
    
    if (searchQuery.query && zipCodePattern.test(searchQuery.query.trim()) && !searchQuery.postalCode) {
      // Auto-detected zip code in main search - enable location search
      enhancedQuery = {
        ...searchQuery,
        postalCode: searchQuery.query.trim(),
        searchWithinRadius: true,
        searchRadius: "100", // Default to 100 miles for auto-detected zip codes
        query: "" // Clear the query since we're using it as location
      };
      console.log('Auto-detected zip code, enabling location search:', enhancedQuery.postalCode);
    }
    
    console.log('Submitting search query:', enhancedQuery);
    onSearch(enhancedQuery);
  };

  const handleResetFilters = () => {
    const resetQuery = {
      query: "",
      containerTypes: [],
      containerConditions: [],
      region: "",
      city: "",
      postalCode: "",
      searchWithinRadius: false,
      searchRadius: "50", // Reset to default 50 miles
      priceMin: "",
      priceMax: "",
      availability: "all"
    };
    
    setSearchQuery(resetQuery);
    
    // Automatically trigger search with cleared filters to show all results
    onSearch(resetQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
      <div className="bg-white rounded-lg shadow-xl p-6">
        {/* Basic Search */}
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-grow">
            <Label htmlFor="search-query" className="block text-sm font-medium text-neutral-700 mb-1">
              Search Containers
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <Input
                type="text"
                id="search-query"
                value={searchQuery.query}
                onChange={handleSearchQueryChange}
                className="pl-10 block w-full border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                placeholder="Container type, specifications, zip code, or keywords"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="flex items-center text-neutral-700 px-4 py-2 border border-neutral-300 rounded-md shadow-sm bg-white hover:bg-neutral-50"
            >
              {isAdvancedOpen ? 'Basic Search' : 'Advanced Search'}
              {isAdvancedOpen ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleResetFilters}
              className="flex items-center text-neutral-700 px-4 py-2 border border-neutral-300 rounded-md shadow-sm bg-white hover:bg-neutral-50"
            >
              Clear Filters
            </Button>
            
            <Button
              type="button"
              onClick={handleSearch}
              className="flex items-center text-white px-6 py-2 border border-transparent rounded-md shadow-sm bg-primary hover:bg-primary-dark focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {searchQuery.searchWithinRadius && searchQuery.postalCode ? (
                <>Search within {searchQuery.searchRadius} miles</>
              ) : (
                <>Search</>
              )}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Quick Filter Section */}
        <div className="mt-4 space-y-4">
          {/* Container Types Quick Filters */}
          <div>
            <Label className="block text-sm font-medium text-neutral-700 mb-2">
              Container Types
            </Label>
            <div className="flex flex-wrap gap-2">
              {containerTypes.slice(0, 8).map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleContainerTypeChange(!searchQuery.containerTypes.includes(type.id), type.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    searchQuery.containerTypes.includes(type.id)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Container Conditions Quick Filters */}
          <div>
            <Label className="block text-sm font-medium text-neutral-700 mb-2">
              Container Conditions
            </Label>
            <div className="flex flex-wrap gap-2">
              {containerConditions.map((condition) => (
                <button
                  key={condition.id}
                  type="button"
                  onClick={() => handleConditionChange(!searchQuery.containerConditions.includes(condition.id), condition.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    searchQuery.containerConditions.includes(condition.id)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                  }`}
                >
                  {condition.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Advanced Search Filters */}
        {isAdvancedOpen && (
          <div className="mt-6 border-t border-neutral-200 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Container Types */}
              <div>
                <h3 className="font-heading font-medium text-neutral-900 mb-3">Container Types</h3>
                <div className="space-y-2">
                  {containerTypes.map((type) => (
                    <div key={type.id} className="flex items-center">
                      <Checkbox 
                        id={`type-${type.id}`} 
                        checked={searchQuery.containerTypes.includes(type.id)}
                        onCheckedChange={(checked) => handleContainerTypeChange(checked, type.id)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <label 
                        htmlFor={`type-${type.id}`} 
                        className="ml-2 text-sm text-neutral-700"
                      >
                        {type.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Container Condition */}
              <div>
                <h3 className="font-heading font-medium text-neutral-900 mb-3">Container Condition</h3>
                <div className="space-y-2">
                  {containerConditions.map((condition) => (
                    <div key={condition.id} className="flex items-center">
                      <Checkbox 
                        id={`condition-${condition.id}`} 
                        checked={searchQuery.containerConditions.includes(condition.id)}
                        onCheckedChange={(checked) => handleConditionChange(checked, condition.id)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <label 
                        htmlFor={`condition-${condition.id}`} 
                        className="ml-2 text-sm text-neutral-700"
                      >
                        {condition.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Location */}
              <div>
                <h3 className="font-heading font-medium text-neutral-900 mb-3">Location</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="region" className="block text-sm font-medium text-neutral-700 mb-1">
                      Select State/Region
                    </Label>
                    <Select 
                      value={searchQuery.region} 
                      onValueChange={handleRegionChange}
                    >
                      <SelectTrigger id="region" className="w-full">
                        <SelectValue placeholder="All States" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region.id} value={region.id}>
                            {region.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                      Enter City
                    </Label>
                    <Input 
                      type="text" 
                      id="city"
                      value={searchQuery.city}
                      onChange={handleCityChange} 
                      className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary" 
                      placeholder="City name"
                    />
                  </div>

                  <div className="bg-primary-light bg-opacity-10 p-4 rounded-md border border-primary-light space-y-3">
                    <h4 className="text-sm font-bold text-primary">Location Search</h4>
                    
                    <div>
                      <Label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                        Enter Postal Code
                      </Label>
                      <Input 
                        type="text" 
                        id="postalCode"
                        value={searchQuery.postalCode}
                        onChange={handlePostalCodeChange} 
                        className="block w-full" 
                        placeholder="Zip/Postal Code"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <input 
                          type="checkbox"
                          id="search-radius-basic" 
                          checked={searchQuery.searchWithinRadius}
                          onChange={(e) => handleRadiusChange(e.target.checked)}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label 
                          htmlFor="search-radius-basic" 
                          className="ml-2 text-sm font-medium"
                        >
                          Search within radius
                        </label>
                      </div>
                      
                      {searchQuery.searchWithinRadius && (
                        <div className="mt-2 pl-6 border-l-2 border-primary-light">
                          <Label htmlFor="radius-select" className="block text-sm font-medium mb-1">
                            Distance (miles)
                          </Label>
                          <select
                            id="radius-select"
                            value={searchQuery.searchRadius}
                            onChange={(e) => handleSearchRadiusChange(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md p-2 text-sm"
                          >
                            <option value="10">10 miles</option>
                            <option value="25">25 miles</option>
                            <option value="50">50 miles</option>
                            <option value="100">100 miles</option>
                            <option value="250">250 miles</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <h3 className="font-heading font-medium text-neutral-900 mb-3">Price Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price-min" className="block text-sm font-medium text-neutral-700 mb-1">
                      Min ($)
                    </Label>
                    <Input 
                      type="number" 
                      id="price-min"
                      value={searchQuery.priceMin}
                      onChange={handlePriceMinChange}
                      className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary" 
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price-max" className="block text-sm font-medium text-neutral-700 mb-1">
                      Max ($)
                    </Label>
                    <Input 
                      type="number" 
                      id="price-max"
                      value={searchQuery.priceMax}
                      onChange={handlePriceMaxChange}
                      className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary" 
                      placeholder="10,000"
                    />
                  </div>
                </div>
              </div>
              
              {/* Availability */}
              <div>
                <h3 className="font-heading font-medium text-neutral-900 mb-3">Availability</h3>
                <RadioGroup 
                  value={searchQuery.availability}
                  onValueChange={handleAvailabilityChange}
                  className="space-y-2"
                >
                  <div className="flex items-center">
                    <RadioGroupItem id="all" value="all" className="text-primary focus:ring-primary" />
                    <Label htmlFor="all" className="ml-2 text-sm text-neutral-700">All Containers</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem id="in-stock" value="in-stock" className="text-primary focus:ring-primary" />
                    <Label htmlFor="in-stock" className="ml-2 text-sm text-neutral-700">In Stock Only</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem id="ready-to-ship" value="ready-to-ship" className="text-primary focus:ring-primary" />
                    <Label htmlFor="ready-to-ship" className="ml-2 text-sm text-neutral-700">Ready to Ship</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Membership Options */}
              <div>
                <h3 className="font-heading font-medium text-neutral-900 mb-3">Membership Search</h3>
                <div className="p-4 bg-primary-light bg-opacity-10 rounded-md border border-primary-light border-opacity-30">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="ml-2 text-sm font-medium text-primary">Enhanced Search For Members</span>
                  </div>
                  <p className="text-xs text-neutral-700 mb-3">
                    Members get exclusive access to preferred inventory, custom pricing, and lease options.
                  </p>
                  <Link href="/membership" className="text-sm font-medium text-primary hover:text-primary-dark">
                    Learn about membership benefits →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleResetFilters}
                className="px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
              >
                Reset Filters
              </Button>
              <Button
                type="button"
                onClick={handleSearch}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export default AdvancedSearch;

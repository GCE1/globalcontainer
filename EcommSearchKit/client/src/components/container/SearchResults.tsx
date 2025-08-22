import { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutGrid, 
  AlignJustify, 
  MapPin, 
  Truck, 
  Clock, 
  Wallet,
  Navigation
} from "lucide-react";
import { Container } from "@shared/schema";
import { sortOptions } from "@/lib/utils";
import { useDistanceCalculation } from "@/hooks/useDistanceCalculation";

interface SearchResultsProps {
  containers: Container[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSortChange: (sortBy: string) => void;
  nearestDepotSearch?: boolean;
  depotInfo?: {
    name: string;
    distance: number;
    searchedZip: string;
    searchedLocation?: string;
  };
}

interface ContainerWithDistance extends Container {
  distance?: number;
  formattedDistance?: string;
}

const SearchResults = ({ 
  containers, 
  totalResults, 
  totalPages, 
  currentPage, 
  onPageChange, 
  onSortChange,
  nearestDepotSearch,
  depotInfo
}: SearchResultsProps) => {
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [containersWithDistance, setContainersWithDistance] = useState<ContainerWithDistance[]>(containers);
  const [showDistances, setShowDistances] = useState(false);

  const { 
    isCalculating, 
    userLocation, 
    error, 
    calculateContainerDistances, 
    getCurrentLocation, 
    clearError 
  } = useDistanceCalculation();

  // Update containers when props change
  useEffect(() => {
    setContainersWithDistance(containers);
  }, [containers]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange(value);
  };

  // Calculate distances from user's current location
  const handleCalculateDistances = async () => {
    try {
      clearError();
      const location = await getCurrentLocation();
      if (location) {
        const containersWithDist = await calculateContainerDistances(
          containers, 
          location.latitude, 
          location.longitude
        );
        setContainersWithDistance(containersWithDist);
        setShowDistances(true);
      }
    } catch (err) {
      console.error('Failed to calculate distances:', err);
    }
  };

  const handleViewChange = (view: 'grid' | 'list') => {
    setCurrentView(view);
  };

  const getConditionBadgeVariant = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'success';
      case 'used':
        return 'warning';
      case 'damaged':
      case 'as-is':
        return 'destructive';
      default:
        return 'warning';
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'New';
      case 'used':
        return 'Used';
      case 'damaged':
      case 'as-is':
        return 'As Is';
      default:
        return condition;
    }
  };

  const getContainerBorderClass = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'container-condition-new';
      case 'used':
        return 'container-condition-used';
      case 'damaged':
      case 'as-is':
        return 'container-condition-damaged';
      default:
        return 'container-condition-used';
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Proximity Search Notification */}
      {nearestDepotSearch && depotInfo && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Showing containers from nearest depot
              </p>
              <p className="text-sm text-blue-700">
                No containers found at {depotInfo.searchedLocation || depotInfo.searchedZip}. 
                Displaying inventory from {depotInfo.name} ({depotInfo.distance} miles away)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-neutral-900">Container Inventory</h2>
          <p className="text-sm text-neutral-500 mt-1">{totalResults} containers available</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          {/* Distance Calculation Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCalculateDistances}
            disabled={isCalculating}
            className="flex items-center space-x-2"
          >
            <Navigation className="h-4 w-4" />
            <span>{isCalculating ? 'Calculating...' : 'Show Distances'}</span>
          </Button>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex border border-neutral-300 rounded-md overflow-hidden">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleViewChange('grid')}
              className={`p-2 ${currentView === 'grid' ? 'bg-primary-light text-white' : 'bg-white text-neutral-700'}`}
            >
              <LayoutGrid className="h-5 w-5" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleViewChange('list')}
              className={`p-2 ${currentView === 'list' ? 'bg-primary-light text-white' : 'bg-white text-neutral-700'}`}
            >
              <AlignJustify className="h-5 w-5" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Results Grid View */}
      {currentView === 'grid' && (
        <div className="space-y-4">
          {containersWithDistance.map((container) => (
            <div 
              key={container.id} 
              className={`bg-white shadow-md rounded-lg overflow-hidden flex ${getContainerBorderClass(container.condition)}`}
            >
              <div className="w-48 flex-shrink-0 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-blue-800">{container.type}</div>
                  <div className="text-sm text-blue-600">{container.condition}</div>
                  <div className="text-xs text-blue-500 mt-1">SKU: {container.sku}</div>
                </div>
              </div>
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900">{container.sku || `${container.type} Container`}</h3>
                  <Badge variant="default">
                    {container.condition}
                  </Badge>
                </div>
                <p className="text-neutral-500 text-sm mb-3">{container.type} Container | Qty: {container.quantity || 1}</p>
                <div className="flex items-center text-sm text-neutral-700 mb-3">
                  <MapPin className="h-4 w-4 text-neutral-500 mr-1" />
                  {container.depot_name} - {container.city}, {container.state} {container.postal_code}
                  {showDistances && container.formattedDistance && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {container.formattedDistance}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">
                    ${parseFloat(container.price).toLocaleString()}
                  </span>
                  <Button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
                    Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Results List View */}
      {currentView === 'list' && (
        <div className="space-y-4">
          {containersWithDistance.map((container) => (
            <div 
              key={container.id} 
              className={`bg-white shadow-sm rounded-lg overflow-hidden ${getContainerBorderClass(container.condition)}`}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 md:w-64 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="text-2xl font-bold text-blue-800">{container.type}</div>
                    <div className="text-sm text-blue-600">{container.condition}</div>
                    <div className="text-xs text-blue-500 mt-1">SKU: {container.sku}</div>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">{container.sku}</h3>
                      <p className="text-neutral-500 text-sm mt-1">{container.type} Container | Qty: {container.quantity || 1}</p>
                    </div>
                    <Badge variant="default">
                      {container.condition}
                    </Badge>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm text-neutral-700">
                      <MapPin className="h-4 w-4 text-neutral-500 mr-1" />
                      {container.depot_name} - {container.city}, {container.state}
                      {showDistances && container.formattedDistance && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {container.formattedDistance}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-neutral-700">
                      <Truck className="h-4 w-4 text-neutral-500 mr-1" />
                      {container.shipping ? 'Available for Shipping' : 'Local Pickup Only'}
                    </div>
                    <div className="flex items-center text-sm text-neutral-700">
                      <Clock className="h-4 w-4 text-neutral-500 mr-1" />
                      {container.availableImmediately ? 'Immediate Delivery' : 'Order to Delivery: 1-2 weeks'}
                    </div>
                    <div className="flex items-center text-sm text-neutral-700">
                      <Wallet className="h-4 w-4 text-neutral-500 mr-1" />
                      {container.leaseAvailable ? 'Lease Available' : 'Purchase Only'}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-primary">
                      ${parseFloat(container.price).toLocaleString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="inline-flex items-center justify-center px-3 py-1.5 border border-primary text-sm font-medium rounded-md text-primary hover:bg-primary hover:bg-opacity-5">
                        Add to Watchlist
                      </Button>
                      <Button className="inline-flex items-center justify-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
                className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
              />
            </PaginationItem>
            
            {/* First page */}
            <PaginationItem>
              <PaginationLink 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(1);
                }}
                isActive={currentPage === 1}
              >
                1
              </PaginationLink>
            </PaginationItem>
            
            {/* Ellipsis if needed */}
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            {/* Current page and surroundings */}
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(currentPage - 1);
                  }}
                >
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            
            {currentPage !== 1 && currentPage !== totalPages && (
              <PaginationItem>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(currentPage);
                  }}
                  isActive
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
            )}
            
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(currentPage + 1);
                  }}
                >
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            
            {/* Ellipsis if needed */}
            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            
            {/* Last page */}
            {totalPages > 1 && (
              <PaginationItem>
                <PaginationLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(totalPages);
                  }}
                  isActive={currentPage === totalPages}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) onPageChange(currentPage + 1);
                }}
                className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
};

export default SearchResults;

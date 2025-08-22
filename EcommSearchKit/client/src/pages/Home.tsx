import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SimpleSearch from "@/components/container/SimpleSearch";
import SearchResults from "@/components/container/SearchResults";
import MembershipCTA from "@/components/membership/MembershipCTA";
import { Container } from "@shared/schema";

interface SearchQuery {
  query: string;
  containerType: string;
  containerCondition: string;
  postalCode: string;
  searchWithinRadius: boolean;
}

interface SearchParams {
  page?: number;
  sortBy?: string;
  query?: string;
  types?: string;
  conditions?: string;
  region?: string;
  city?: string;
  postalCode?: string;
  radius?: boolean;
  radiusMiles?: string;
  priceMin?: string;
  priceMax?: string;
  availability?: string;
}

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
    sortBy: "relevance"
  });

  // Query to fetch containers based on search parameters
  const { data, isLoading, error } = useQuery<{
    containers: Container[];
    totalResults: number;
    totalPages: number;
  }>({
    queryKey: ['/api/containers', searchParams],
    enabled: hasSearched,
  });

  const handleSearch = (query: SearchQuery) => {
    const params: SearchParams = {
      page: 1, // Reset to first page on new search
      sortBy,
      query: query.query,
      types: query.containerType ? query.containerType : undefined,
      conditions: query.containerCondition ? query.containerCondition : undefined,
      postalCode: query.postalCode || undefined,
      radius: query.searchWithinRadius,
      radiusMiles: query.searchWithinRadius ? "100" : undefined
    };
    
    // Remove any undefined values to keep the URL clean
    Object.keys(params).forEach(key => {
      if (params[key as keyof SearchParams] === undefined) {
        delete params[key as keyof SearchParams];
      }
    });
    
    console.log('Setting search params:', params);
    setSearchParams(params);
    setCurrentPage(1);
    setHasSearched(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({
      ...searchParams,
      page
    });
  };

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
    setSearchParams({
      ...searchParams,
      sortBy
    });
  };

  return (
    <main>
      {/* Hero Section */}
      <div className="relative bg-primary-dark">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600" 
            alt="Container shipping yard" 
            className="w-full h-full object-cover object-center opacity-30" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white font-heading sm:text-5xl lg:text-6xl">
            Find Your Perfect Container
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Search across North America's largest container inventory with real-time availability, pricing, and specifications.
          </p>
        </div>
      </div>

      {/* Search Component */}
      <SimpleSearch onSearch={handleSearch} />
      
      {/* Search Results - Only show after user has searched */}
      {hasSearched && (
        <>
          {isLoading ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            </div>
          ) : error ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="bg-red-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error loading containers</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>There was an error loading the container data. Please try again later.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <SearchResults 
              containers={data?.containers || []}
              totalResults={data?.totalResults || 0}
              totalPages={data?.totalPages || 1}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
              nearestDepotSearch={data?.nearestDepotSearch}
              depotInfo={data?.depotInfo}
            />
          )}
        </>
      )}
      
      {/* Membership CTA */}
      <MembershipCTA />
    </main>
  );
};

export default Home;

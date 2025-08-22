import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Container, MapPin, DollarSign, TrendingUp, BarChart3, Filter, Search, Grid, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ContainerData {
  id: number;
  sku: string;
  type: string;
  condition: string;
  price: number;
  depot_name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  image: string;
  availability: string;
}

interface InventoryStats {
  totalContainers: number;
  averagePrice: number;
  topLocations: { location: string; count: number }[];
  conditionBreakdown: { condition: string; count: number; percentage: number }[];
  typeBreakdown: { type: string; count: number; percentage: number }[];
}

export default function ContainerInventoryDashboard() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [filterLocation, setFilterLocation] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: containers, isLoading: containersLoading } = useQuery({
    queryKey: ['/api/containers', { 
      search: searchTerm || undefined,
      type: filterType === 'all' ? undefined : filterType,
      condition: filterCondition === 'all' ? undefined : filterCondition,
      location: filterLocation || undefined,
      sort: sortBy,
      page: currentPage,
      limit: itemsPerPage
    }]
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/containers/stats']
  });

  const containerArray = Array.isArray(containers) ? containers : [];
  const totalPages = Math.ceil((stats?.totalContainers || 0) / itemsPerPage);

  const getConditionColor = (condition: string) => {
    const colors = {
      'new': 'bg-green-100 text-green-800',
      'one-trip': 'bg-blue-100 text-blue-800',
      'cargo-worthy': 'bg-yellow-100 text-yellow-800',
      'wind-water-tight': 'bg-orange-100 text-orange-800',
      'as-is': 'bg-red-100 text-red-800'
    };
    return colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Containers</CardTitle>
            <Container className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : (stats?.totalContainers || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all depots
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : formatPrice(stats?.averagePrice || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Market average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '...' : (stats?.topLocations?.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Depot locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Availability</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Ready for delivery
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Container Inventory</CardTitle>
              <CardDescription>
                Search and filter through available containers
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by type, location, or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="type">Container Type</SelectItem>
                  <SelectItem value="condition">Condition</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Container Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="20DC">20' Dry Container</SelectItem>
                  <SelectItem value="40DC">40' Dry Container</SelectItem>
                  <SelectItem value="20HC">20' High Cube</SelectItem>
                  <SelectItem value="40HC">40' High Cube</SelectItem>
                  <SelectItem value="45HC">45' High Cube</SelectItem>
                  <SelectItem value="53HC">53' High Cube</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCondition} onValueChange={setFilterCondition}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="new">Brand New</SelectItem>
                  <SelectItem value="one-trip">One Trip</SelectItem>
                  <SelectItem value="cargo-worthy">Cargo Worthy</SelectItem>
                  <SelectItem value="wind-water-tight">Wind & Water Tight</SelectItem>
                  <SelectItem value="as-is">As-Is</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Filter by location..."
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-48"
              />

              {(filterType || filterCondition || filterLocation || searchTerm) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFilterType('');
                    setFilterCondition('');
                    setFilterLocation('');
                    setSearchTerm('');
                  }}
                  size="sm"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Container Grid/List */}
      <div className="space-y-4">
        {containersLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {containerArray.map((container: ContainerData) => (
                  <Card key={container.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{container.type}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {container.city}, {container.state}
                          </CardDescription>
                        </div>
                        <Badge className={getConditionColor(container.condition)}>
                          {container.condition}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {container.image && (
                          <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={container.image}
                              alt={container.type}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-blue-600">
                            {formatPrice(container.price)}
                          </div>
                          <div className="text-sm text-gray-600">
                            SKU: {container.sku}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Container className="h-3 w-3" />
                            {container.depot_name}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {containerArray.map((container: ContainerData) => (
                  <Card key={container.id} className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                            <Container className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{container.type}</h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {container.city}, {container.state} • {container.depot_name}
                            </p>
                            <p className="text-sm text-gray-500">SKU: {container.sku}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={getConditionColor(container.condition)}>
                            {container.condition}
                          </Badge>
                          <div className="text-right">
                            <div className="text-xl font-bold text-blue-600">
                              {formatPrice(container.price)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm">View Details</Button>
                            <Button size="sm" variant="outline">Add to Cart</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = Math.max(1, currentPage - 2) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="breakdown" className="space-y-4">
        <TabsList>
          <TabsTrigger value="breakdown">Type Breakdown</TabsTrigger>
          <TabsTrigger value="condition">Condition Analysis</TabsTrigger>
          <TabsTrigger value="locations">Top Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Container Type Distribution</CardTitle>
              <CardDescription>
                Breakdown of available containers by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-2 bg-gray-200 rounded flex-1 mx-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {stats?.typeBreakdown?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-24">{item.type}</span>
                      <Progress value={item.percentage} className="flex-1 mx-4" />
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="condition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Condition Analysis</CardTitle>
              <CardDescription>
                Quality distribution of available inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-2 bg-gray-200 rounded flex-1 mx-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {stats?.conditionBreakdown?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getConditionColor(item.condition)} variant="secondary">
                          {item.condition}
                        </Badge>
                      </div>
                      <Progress value={item.percentage} className="flex-1 mx-4" />
                      <span className="text-sm text-gray-600 w-16 text-right">
                        {item.count} ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Depot Locations</CardTitle>
              <CardDescription>
                Locations with highest container availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {stats?.topLocations?.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{location.location}</span>
                      </div>
                      <Badge variant="secondary">{location.count} containers</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
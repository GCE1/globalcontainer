import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Container, Eye, FileText, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserContainer {
  id: number;
  userId: string;
  containerNumber: string;
  containerType: string;
  condition: string;
  currentLocation: string;
  depot: string;
  status: string;
  purchasePrice: string;
  purchaseDate: Date;
  currentValue: string;
  lastInspectionDate: Date;
  nextInspectionDue: Date;
  certificationExpiry: Date;
  notes: string;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface InventoryResponse {
  containers: UserContainer[];
  total: number;
  page: number;
  totalPages: number;
}

export default function WholesaleInventory() {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  // Fetch user containers with pagination
  const { data: inventoryData, isLoading } = useQuery<InventoryResponse>({
    queryKey: ['/api/user/containers', currentPage],
    retry: 1,
  });

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return `$${numPrice.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'leased': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'transit': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContainerImage = (container: UserContainer) => {
    // Use the image from imageUrls if available, otherwise fallback based on type
    if (container.imageUrls && container.imageUrls.length > 0) {
      return container.imageUrls[0];
    }
    
    // Fallback based on type
    const containerType = (container as any).container_type || container.containerType || '';
    if (containerType.includes('20')) {
      return '/attached_assets/20GP-BrandNew/20GP-1.png';
    } else if (containerType.includes('40')) {
      return '/attached_assets/40GP-BrandNew/40GP-1.png';
    }
    return '/attached_assets/40GP-BrandNew/40GP-1.png';
  };

  // Filter containers by status for tabs
  const availableContainers = inventoryData?.containers?.filter(container => 
    container.status === 'available'
  ) || [];
  
  const maintenanceContainers = inventoryData?.containers?.filter(container => 
    container.status === 'maintenance'
  ) || [];

  const renderContainerCard = (container: UserContainer) => (
    <Card key={container.id} className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Container Title Section */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-medium text-gray-900 truncate">
              {(container as any).container_number || container.containerNumber}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <Container className="h-3 w-3 text-blue-500" />
              <span className="text-sm text-gray-600">{(container as any).container_type || container.containerType}</span>
            </div>
          </div>
          <Badge className={getStatusColor(container.status)}>
            {container.status}
          </Badge>
        </div>
        
        {/* Image and Details Section */}
        <div className="flex items-start gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={getContainerImage(container)}
              alt={(container as any).container_type || container.containerType}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/attached_assets/20GP-BrandNew/20GP-1.png';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-red-500" />
                <span className="truncate">{(container as any).current_location || container.currentLocation}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Purchase Price:</span>
              <span className="font-medium">{formatPrice((container as any).purchase_price || container.purchasePrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Value:</span>
              <span className="font-medium text-green-600">{formatPrice((container as any).current_value || container.currentValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Purchase Date:</span>
              <span className="font-medium">{formatDate((container as any).purchase_date || container.purchaseDate)}</span>
            </div>
            {((container as any).next_inspection_due || container.nextInspectionDue) && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Next Inspection:</span>
                <span className="font-medium text-blue-600">{formatDate((container as any).next_inspection_due || container.nextInspectionDue)}</span>
              </div>
            )}
            {((container as any).last_inspection_date || container.lastInspectionDate) && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Inspection:</span>
                <span className="font-medium">{formatDate((container as any).last_inspection_date || container.lastInspectionDate)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-[#001937] flex items-center gap-2">
            <Container className="h-6 w-6 text-blue-500" />
            My Container Inventory
          </CardTitle>
          <CardDescription>
            Manage your owned container fleet with {inventoryData?.total || 0} containers across various locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#001937]" />
              <span className="ml-2 text-gray-600">Loading inventory...</span>
            </div>
          )}

          {/* Tab Interface */}
          {!isLoading && (
            <Tabs defaultValue="available" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="available">
                  Available ({availableContainers.length})
                </TabsTrigger>
                <TabsTrigger value="maintenance">
                  Maintenance ({maintenanceContainers.length})
                </TabsTrigger>
              </TabsList>

              {/* Available Tab */}
              <TabsContent value="available" className="mt-6">
                {availableContainers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableContainers.map(renderContainerCard)}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Container className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No available containers in your fleet.</p>
                  </div>
                )}
              </TabsContent>

              {/* Maintenance Tab */}
              <TabsContent value="maintenance" className="mt-6">
                {maintenanceContainers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {maintenanceContainers.map(renderContainerCard)}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No containers in maintenance.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Pagination */}
          {inventoryData && inventoryData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {inventoryData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === inventoryData.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}

          {/* Summary */}
          {inventoryData && (
            <div className="bg-gray-50 p-4 rounded-lg mt-6">
              <p className="text-sm text-gray-600 text-center">
                Total fleet: {inventoryData.total} containers | Available: {availableContainers.length} | Maintenance: {maintenanceContainers.length}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
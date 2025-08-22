import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, DollarSign, Truck, CheckCircle, Clock } from "lucide-react";
import { LuContainer } from 'react-icons/lu';
import { ContractContainer } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ContainerTrackingListProps {
  contractId: number;
}

export function ContainerTrackingList({ contractId }: ContainerTrackingListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: containers, isLoading } = useQuery({
    queryKey: ["/api/contract-containers", contractId],
    queryFn: () => apiRequest(`/api/contract-containers?contractId=${contractId}`)
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ containerId, status }: { containerId: number; status: string }) => {
      return apiRequest(`/api/contract-containers/${containerId}`, {
        method: "PATCH",
        body: JSON.stringify({ status, returnDate: status === "returned" ? new Date().toISOString() : null })
      });
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Container status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contract-containers"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update container status.",
        variant: "destructive",
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "picked_up":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Picked Up</Badge>;
      case "in_transit":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">In Transit</Badge>;
      case "returned":
        return <Badge variant="default" className="bg-green-100 text-green-800">Returned</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "picked_up":
        return <LuContainer className="h-4 w-4 text-blue-600" />;
      case "in_transit":
        return <Truck className="h-4 w-4 text-yellow-600" />;
      case "returned":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!containers?.containers || containers.containers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <LuContainer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Containers Tracked</h3>
            <p className="text-gray-600">
              Use the "Record Pickup" button to add containers to this contract.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {containers.containers.map((container: ContractContainer) => (
          <Card key={container.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(container.status)}
                    <h4 className="font-semibold text-gray-900">{container.containerNumber}</h4>
                    {getStatusBadge(container.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <LuContainer className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{container.containerType}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{container.pickupLocation}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">${container.price}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Pickup:</span>
                      <span className="font-medium">
                        {new Date(container.pickupDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {container.returnDate && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-600">Returned:</span>
                      <span className="font-medium text-green-700">
                        {new Date(container.returnDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {container.notes && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">Notes:</span>
                      <span className="ml-2 text-gray-800">{container.notes}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {container.status === "picked_up" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatusMutation.mutate({ 
                        containerId: container.id, 
                        status: "in_transit" 
                      })}
                      disabled={updateStatusMutation.isPending}
                      className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                    >
                      <Truck className="h-4 w-4 mr-1" />
                      Mark In Transit
                    </Button>
                  )}

                  {container.status === "in_transit" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatusMutation.mutate({ 
                        containerId: container.id, 
                        status: "returned" 
                      })}
                      disabled={updateStatusMutation.isPending}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Returned
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {containers.containers.filter((c: ContractContainer) => c.status === "picked_up").length}
            </div>
            <div className="text-sm text-gray-600">Picked Up</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {containers.containers.filter((c: ContractContainer) => c.status === "in_transit").length}
            </div>
            <div className="text-sm text-gray-600">In Transit</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {containers.containers.filter((c: ContractContainer) => c.status === "returned").length}
            </div>
            <div className="text-sm text-gray-600">Returned</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {containers.containers.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}
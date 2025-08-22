import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { LuContainer } from 'react-icons/lu';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { InsertContractContainer } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface ContainerEntry {
  containerNumber: string;
  containerType: string;
  pickupLocation: string;
  price: string;
  notes?: string;
}

interface ContainerPickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: number;
  contractNumber: string;
}

export function ContainerPickupModal({ isOpen, onClose, contractId, contractNumber }: ContainerPickupModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [containers, setContainers] = useState<ContainerEntry[]>([
    {
      containerNumber: "",
      containerType: "",
      pickupLocation: "",
      price: "",
      notes: ""
    }
  ]);

  const containerTypes = [
    "20' Dry Container",
    "20' High Cube",
    "40' Dry Container", 
    "40' High Cube",
    "45' High Cube",
    "53' High Cube"
  ];

  const addContainerMutation = useMutation({
    mutationFn: async (containerData: InsertContractContainer[]) => {
      return apiRequest("/api/contract-containers", {
        method: "POST",
        body: JSON.stringify({ containers: containerData })
      });
    },
    onSuccess: () => {
      toast({
        title: "Containers Added",
        description: "Container pickup information has been recorded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contract-containers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leasing-contracts"] });
      setContainers([{
        containerNumber: "",
        containerType: "",
        pickupLocation: "",
        price: "",
        notes: ""
      }]);
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add container pickup information.",
        variant: "destructive",
      });
    }
  });

  const addContainer = () => {
    setContainers([...containers, {
      containerNumber: "",
      containerType: "",
      pickupLocation: "",
      price: "",
      notes: ""
    }]);
  };

  const removeContainer = (index: number) => {
    if (containers.length > 1) {
      setContainers(containers.filter((_, i) => i !== index));
    }
  };

  const updateContainer = (index: number, field: keyof ContainerEntry, value: string) => {
    const updated = [...containers];
    updated[index] = { ...updated[index], [field]: value };
    setContainers(updated);
  };

  const handleSubmit = () => {
    // Validate all containers
    const validContainers = containers.filter(container => 
      container.containerNumber.trim() && 
      container.containerType && 
      container.pickupLocation.trim() && 
      container.price.trim()
    );

    if (validContainers.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields for at least one container.",
        variant: "destructive",
      });
      return;
    }

    // Convert to API format
    const containerData: InsertContractContainer[] = validContainers.map(container => ({
      contractId,
      containerNumber: container.containerNumber.trim(),
      containerType: container.containerType,
      pickupLocation: container.pickupLocation.trim(),
      price: container.price,
      status: "picked_up",
      notes: container.notes?.trim() || null
    }));

    addContainerMutation.mutate(containerData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LuContainer className="h-5 w-5 text-blue-600" />
            Container Pickup Registration
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Contract: {contractNumber} - Record individual container pickups
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {containers.map((container, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Container #{index + 1}</h4>
                {containers.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeContainer(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`container-number-${index}`}>Container ID *</Label>
                  <Input
                    id={`container-number-${index}`}
                    placeholder="e.g., CSQU3054383"
                    value={container.containerNumber}
                    onChange={(e) => updateContainer(index, "containerNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`container-type-${index}`}>Container Type *</Label>
                  <Select 
                    value={container.containerType} 
                    onValueChange={(value) => updateContainer(index, "containerType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select container type" />
                    </SelectTrigger>
                    <SelectContent>
                      {containerTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`pickup-location-${index}`}>Pickup Location *</Label>
                  <Input
                    id={`pickup-location-${index}`}
                    placeholder="e.g., Port of Long Beach"
                    value={container.pickupLocation}
                    onChange={(e) => updateContainer(index, "pickupLocation", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`price-${index}`}>Price *</Label>
                  <Input
                    id={`price-${index}`}
                    placeholder="e.g., 2500.00"
                    value={container.price}
                    onChange={(e) => updateContainer(index, "price", e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`notes-${index}`}>Notes (Optional)</Label>
                  <Input
                    id={`notes-${index}`}
                    placeholder="Additional notes about this container"
                    value={container.notes}
                    onChange={(e) => updateContainer(index, "notes", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addContainer}
            className="w-full border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Container
          </Button>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={addContainerMutation.isPending}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {addContainerMutation.isPending ? "Recording..." : "Record Container Pickups"}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
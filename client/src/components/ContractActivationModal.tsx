import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { format, addDays } from "date-fns";
import { CalendarIcon, CheckCircle } from "lucide-react";
import type { CartItem } from "@shared/schema";

interface ContractActivationModalProps {
  cartItems: CartItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function ContractActivationModal({ cartItems, isOpen, onClose }: ContractActivationModalProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const activateContractsMutation = useMutation({
    mutationFn: async (data: { cartItems: CartItem[], startDate: string }) => {
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to activate contracts");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Contracts Activated",
        description: `Successfully activated ${data.contracts.length} leasing contract(s)`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Activation Failed",
        description: error.message || "Failed to activate contracts",
        variant: "destructive",
      });
    },
  });

  const handleActivateContracts = () => {
    if (!startDate) {
      toast({
        title: "Date Required",
        description: "Please select a contract start date",
        variant: "destructive",
      });
      return;
    }

    activateContractsMutation.mutate({
      cartItems,
      startDate: startDate.toISOString(),
    });
  };

  const totalValue = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Activate Leasing Contracts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Contract Summary */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Contract Summary</h3>
            <div className="space-y-2">
              {cartItems.map((item, index) => {
                const endDate = addDays(startDate, parseInt(item.freeDays));
                return (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                    <div>
                      <div className="font-medium">{item.containerSize} Container</div>
                      <div className="text-sm text-slate-600">
                        {item.origin} → {item.destination} • Qty: {item.quantity}
                      </div>
                      <div className="text-xs text-slate-500">
                        Free Period: {item.freeDays} days → Ends {format(endDate, 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${parseFloat(item.price).toLocaleString()}</div>
                      <div className="text-sm text-slate-600">Per Diem: ${item.perDiem}/day</div>
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-slate-300">
                <div className="flex justify-between font-semibold">
                  <span>Total Contract Value:</span>
                  <span>${totalValue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Start Date Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Contract Start Date</Label>
            <div className="border rounded-lg p-4">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                disabled={(date) => date < new Date()}
                className="rounded-md"
              />
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <CalendarIcon className="h-4 w-4" />
                <span className="font-medium">Selected Start Date: {format(startDate, 'EEEE, MMMM dd, yyyy')}</span>
              </div>
            </div>
          </div>

          {/* Contract Preview */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Contract Period Preview</h4>
            <div className="space-y-1 text-sm">
              {cartItems.map((item, index) => {
                const endDate = addDays(startDate, parseInt(item.freeDays));
                return (
                  <div key={index} className="text-green-700">
                    <strong>{item.containerSize}:</strong> {format(startDate, 'MMM dd')} - {format(endDate, 'MMM dd, yyyy')} 
                    <span className="text-green-600"> ({item.freeDays} free days)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleActivateContracts}
              disabled={activateContractsMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {activateContractsMutation.isPending ? "Activating..." : "Activate Contracts"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={activateContractsMutation.isPending}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
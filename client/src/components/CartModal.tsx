import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSimpleCart } from '@/hooks/useSimpleCart';
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PayPalLeasingCheckout from "./PayPalLeasingCheckout";

interface CartItem {
  id: number;
  leasingRecordId: string;
  origin: string;
  destination: string;
  containerSize: string;
  price: string;
  freeDays: number;
  perDiem: string;
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'consumer' | 'b2b'; // 'consumer' shows all options, 'b2b' shows simplified version
}

export default function CartModal({ isOpen, onClose, mode = 'consumer' }: CartModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPayPalCheckout, setShowPayPalCheckout] = useState(false);

  // Use simple localStorage cart
  const { cartItems, isLoading, removeFromCart: removeCartItem, clearCart, cleanupCart } = useSimpleCart();

  const handleRemoveItem = (itemId: string) => {
    removeCartItem(itemId);
  };

  // Function to get correct container image path based on size
  const getContainerImagePath = (containerSize: string | undefined) => {
    const sizeMap: { [key: string]: string } = {
      '20GP': '/attached_assets/20GP-New/20GP-New.png',
      '40GP': '/attached_assets/40GP-BrandNew/40GP-Brandnew.png', 
      '40HC': '/attached_assets/40HC-Brandnew/40HC New.png',
      '20HC': '/attached_assets/20HC-New/20HC-Brandnew.png',
      '45HC': '/attached_assets/45HC/45HC.png',
      '53HC': '/attached_assets/53HC-BrandNew/53HC-Brandnew.png',
      
      // Wholesale container mappings with conditions
      '20GP New': '/attached_assets/20GP-New/20GP-New.png',
      '20GP WWT': '/attached_assets/20GP-WWT/20GP-WWT-Front.png',
      '20GP CW': '/attached_assets/20GP-Cw/20GP-Cw-Front.png',
      '40GP New': '/attached_assets/40GP-New/40GP-New.png',
      '40GP WWT': '/attached_assets/40GP-WWT/40GP-WWT-Front.png',
      '40GP CW': '/attached_assets/40GP-CW/40GP-CW-Front.png',
      '40HC New': '/attached_assets/40HC-New/40HC-New.png',
      '40HC WWT': '/attached_assets/40HC-WWT/40HC-WWT-Front.png',
      '40HC CW': '/attached_assets/40HC-CW/40HC-CW-Front.png',
      '40HC Cw': '/attached_assets/40HC-CW/40HC-CW-Front.png', // Handle lowercase 'w'
      '45HC New': '/attached_assets/45HC-New/45HC-New.png',
      '45HC WWT': '/attached_assets/45HC-WWT/45HC-WWT-Front.png',
      '45HC CW': '/attached_assets/45HC-CW/45HC-CW-Front.png'
    };
    
    if (!containerSize) {
      return '/attached_assets/20GP-New/20GP-New.png';
    }
    
    // First try exact match (for wholesale items with conditions)
    if (sizeMap[containerSize]) {
      return sizeMap[containerSize];
    }
    
    // Extract size from container string (e.g., "20GP" from "20GP Container")  
    const size = containerSize.replace(/\s*Container$/i, '').trim();
    return sizeMap[size] || '/attached_assets/20GP-New/20GP-New.png';
  };

  // Create checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/checkout", { cartItems }),
    onSuccess: async (data: any) => {
      setIsProcessingPayment(true);
      
      try {
        const { orderId, leasingOrderId } = data;
        
        // Simulate payment processing
        const paymentResult = await new Promise<{ success: boolean }>((resolve) => {
          setTimeout(() => resolve({ success: true }), 2000);
        });
        
        if (paymentResult.success) {
          // Create leasing contract with calendar events
          try {
            const contractStartDate = new Date().toISOString();
            
            await apiRequest("POST", "/api/contracts/create", {
              orderId: leasingOrderId,
              contractStartDate,
            });
            
            toast({
              title: "Contract Activated",
              description: "Your leasing contract has been activated with automated calendar tracking and billing.",
            });
          } catch (contractError) {
            console.error("Contract creation error:", contractError);
            toast({
              title: "Payment Successful",
              description: "Payment completed successfully. Contract activation pending.",
            });
          }
          
          queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
          queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
          onClose();
        }
      } catch (error) {
        toast({
          title: "Payment Failed",
          description: "There was an error processing your payment.",
          variant: "destructive",
        });
      } finally {
        setIsProcessingPayment(false);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process checkout.",
        variant: "destructive",
      });
    },
  });

  const totalAmount = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/[$,]/g, ''));
    return total + (price * item.quantity);
  }, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    
    // Show PayPal checkout
    setShowPayPalCheckout(true);
  };

  const handlePayPalSuccess = () => {
    setShowPayPalCheckout(false);
    onClose();
  };

  const handlePayPalError = (error: any) => {
    setShowPayPalCheckout(false);
    console.error("PayPal checkout error:", error);
  };

  const handlePayPalCancel = () => {
    setShowPayPalCheckout(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {mode === 'b2b' ? 'Wholesale Cart' : 'Leasing Cart'}
            </div>
            {cartItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearCart();
                  onClose();
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear All
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-[#33d2b9] border-t-transparent rounded-full" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 cart-items-scroll">
                {cartItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start space-x-4">
                      {/* Container Image */}
                      <div className="flex-shrink-0 w-24 h-16">
                        <img 
                          src={getContainerImagePath(item.containerSize || item.type)}
                          alt={`${item.containerSize || item.type} Container`}
                          className="w-full h-full object-cover rounded-md border border-gray-200"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {item.origin && item.destination ? `${item.origin} → ${item.destination}` : 
                           item.location || `${item.city}, ${item.state}` || 'Container Purchase'}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Container Size:</span> {item.containerSize || item.type}
                          </div>
                          <div>
                            <span className="font-medium">Price:</span> {item.price}
                          </div>
                          {item.freeDays !== undefined && (
                            <div>
                              <span className="font-medium">Free Days:</span> {item.freeDays}
                            </div>
                          )}
                          {item.perDiem && (
                            <div>
                              <span className="font-medium">Per Diem:</span> {item.perDiem}
                            </div>
                          )}
                          {item.condition && (
                            <div>
                              <span className="font-medium">Condition:</span> {item.condition}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Quantity:</span> {item.quantity}
                          </div>
                          <div className="font-semibold text-[#33d2b9]">
                            <span className="font-medium text-gray-600">Total:</span> ${(parseFloat(String(item.price).replace(/[$,]/g, '')) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        {mode === 'b2b' && (
                          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm font-medium text-blue-800">
                              🏢 Container Available for Pick-up at the Depot
                            </p>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="ml-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex-shrink-0 pt-4 border-t mt-4">
                <div className="flex justify-between items-center text-xl font-bold mb-4">
                  <span>Total Amount:</span>
                  <span className="text-[#33d2b9]">${totalAmount.toFixed(2)}</span>
                </div>

                {showPayPalCheckout ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Complete Payment</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPayPalCheckout(false)}
                      >
                        Back to Cart
                      </Button>
                    </div>
                    <PayPalLeasingCheckout
                      cartItems={cartItems as any}
                      totalAmount={totalAmount}
                      onSuccess={handlePayPalSuccess}
                      onError={handlePayPalError}
                      onCancel={handlePayPalCancel}
                    />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      className="flex-1 bg-[#001937] hover:bg-[#33d2b9] text-white"
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Checkout with PayPal
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface PurchaseCartItem {
  id: number;
  // Container data
  sku?: string;
  type?: string;
  size?: string;
  condition?: string;
  price?: number;
  city?: string;
  state?: string;
  country?: string;
  depot_name?: string;
  // Additional fields for different container types
  [key: string]: any;
  quantity: number;
  addedAt: string;
}

export function usePurchaseCart() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["/api/purchase-cart"],
    retry: false,
  });

  // Ensure cartData has the expected structure
  const safeCartData = cartData || { cartItems: [] };

  const addToCartMutation = useMutation({
    mutationFn: (containerData: any) => 
      apiRequest("POST", "/api/purchase-cart/add", { containerData, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchase-cart"] });
      toast({
        title: "Added to Cart",
        description: "Container has been added to your cart.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add container to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (itemId: number) => apiRequest("DELETE", `/api/purchase-cart/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchase-cart"] });
      toast({
        title: "Item Removed",
        description: "Container has been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove container from cart.",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/purchase-cart/clear"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/purchase-cart"] });
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear cart.",
        variant: "destructive",
      });
    },
  });

  const cartItems: PurchaseCartItem[] = (safeCartData as any)?.cartItems || [];
  const cartCount = cartItems.length > 0 ? cartItems.reduce((count, item) => count + item.quantity, 0) : 0;
  const cartTotal = cartItems.length > 0 ? cartItems.reduce((total, item) => {
    const price = item.price || 0;
    return total + (price * item.quantity);
  }, 0) : 0;

  return {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
  };
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: number;
  userId: string;
  leasingRecordId: string;
  origin: string;
  destination: string;
  containerSize: string;
  price: string;
  freeDays: string;
  perDiem: string;
  quantity: number;
  createdAt: string;
}

export function useCart() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["/api/cart"],
    queryFn: async () => {
      console.log('=== FRONTEND CART GET DEBUG ===');
      console.log('Query URL:', '/api/cart');
      console.log('Document cookies:', document.cookie);
      
      // Check if cookies are disabled and use localStorage instead
      if (!navigator.cookieEnabled) {
        const { SessionManager } = await import('@/utils/sessionManager');
        const localCartItems = SessionManager.getCartItems();
        console.log('🎯 COOKIES DISABLED - Using localStorage cart:', localCartItems.length, 'items');
        console.log('localStorage cart items:', localCartItems);
        return {
          success: true,
          cartItems: localCartItems,
          usingLocalStorage: true
        };
      }
      
      // Try server-side cart for cookie-enabled browsers
      const response = await fetch('/api/cart', {
        credentials: 'include'
      });
      console.log('Response cookies after GET:', document.cookie);
      return response.json();
    },
    retry: false,
    refetchInterval: navigator.cookieEnabled ? 5000 : false, // Only auto-refresh for server-side cart
  });

  const addToCartMutation = useMutation({
    mutationFn: (item: Omit<CartItem, 'id' | 'userId' | 'createdAt'>) => 
      apiRequest("POST", "/api/cart/add", item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart.",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (itemId: number) => apiRequest("DELETE", `/api/cart/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
    },
  });

  const cartItems: CartItem[] = cartData?.cartItems || [];
  const cartCount = cartItems.length > 0 ? cartItems.reduce((count, item) => count + item.quantity, 0) : 0;
  const cartTotal = cartItems.length > 0 ? cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return total + (price * item.quantity);
  }, 0) : 0;

  return {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
  };
}
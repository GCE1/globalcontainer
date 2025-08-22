import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface LocalCartItem {
  id: string;
  leasingRecordId: string;
  origin: string;
  destination: string;
  containerSize: string;
  price: string;
  freeDays: number;
  perDiem: string;
  quantity: number;
  createdAt: string;
}

const CART_STORAGE_KEY = 'gce-cart-items';

export function useLocalStorageCart() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<LocalCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('🎯 localStorage cart loaded:', parsed.length, 'items');
        setCartItems(parsed);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever cart changes
  const saveToStorage = (items: LocalCartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      console.log('✅ Cart saved to localStorage:', items.length, 'items');
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  };

  const addToCart = (item: Omit<LocalCartItem, 'id' | 'createdAt'>) => {
    const newItem: LocalCartItem = {
      ...item,
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    const updatedItems = [...cartItems, newItem];
    setCartItems(updatedItems);
    saveToStorage(updatedItems);

    toast({
      title: "Added to Cart",
      description: "Container has been added to your cart.",
    });

    return newItem;
  };

  const removeFromCart = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    saveToStorage(updatedItems);

    toast({
      title: "Item Removed",
      description: "Container has been removed from your cart.",
    });
  };

  const clearCart = () => {
    setCartItems([]);
    saveToStorage([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return total + (price * item.quantity);
  }, 0);

  return {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    addToCart,
    removeFromCart,
    clearCart,
  };
}
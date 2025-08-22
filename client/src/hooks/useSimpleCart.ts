import { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

// Global cart state to prevent multiple instances
let globalCartItems: SimpleCartItem[] = [];
let globalCartSettings: CartSettings = { deliveryMethod: 'tilt-bed', deliveryCost: 600 };
let cartSubscribers: Array<(items: SimpleCartItem[], settings: CartSettings) => void> = [];

const notifySubscribers = (items: SimpleCartItem[], settings: CartSettings) => {
  globalCartItems = items;
  globalCartSettings = settings;
  cartSubscribers.forEach(callback => callback(items, settings));
};

export interface SimpleCartItem {
  id: string;
  leasingRecordId?: string; // Optional for container purchases
  origin?: string; // Optional for container purchases  
  destination?: string; // Optional for container purchases
  containerSize?: string; // Optional for container purchases
  price: string | number; // Support both formats
  freeDays?: number; // Optional for container purchases
  perDiem?: string; // Optional for container purchases
  quantity: number;
  
  // Container purchase specific fields
  sku?: string;
  type?: string;
  condition?: string;
  depot_name?: string;
  city?: string;
  state?: string;
  image?: string;
}

// Separate interface for cart-level settings
export interface CartSettings {
  deliveryMethod: 'tilt-bed' | 'roll-off' | 'custom-assist' | 'customer-pickup';
  deliveryCost: number;
}

const CART_STORAGE_KEY = 'gce_leasing_cart';
const CART_SETTINGS_KEY = 'gce_cart_settings';

export function useSimpleCart() {
  // Initialize with localStorage data immediately if available
  const getInitialCartItems = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        globalCartItems.length = 0;
        globalCartItems.push(...parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading initial cart:', error);
    }
    return [];
  };

  const getInitialCartSettings = () => {
    try {
      const stored = localStorage.getItem(CART_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        globalCartSettings = parsed;
        return parsed;
      }
    } catch (error) {
      console.error('Error loading cart settings:', error);
    }
    return { deliveryMethod: 'tilt-bed', deliveryCost: 600 };
  };

  const [cartItems, setCartItems] = useState<SimpleCartItem[]>(getInitialCartItems);
  const [cartSettings, setCartSettings] = useState<CartSettings>(getInitialCartSettings);
  const [isLoading, setIsLoading] = useState(false); // Start with false for faster loading
  const { toast } = useToast();

  // Subscribe to global cart state updates
  useEffect(() => {
    const handleCartUpdate = (items: SimpleCartItem[], settings: CartSettings) => {
      setCartItems(items);
      setCartSettings(settings);
    };
    
    cartSubscribers.push(handleCartUpdate);
    
    return () => {
      cartSubscribers = cartSubscribers.filter(sub => sub !== handleCartUpdate);
    };
  }, []);

  // Minimal effect since we load data in useState initializer
  useEffect(() => {
    // Only need this for any final state synchronization
    setIsLoading(false);
  }, []);

  // Save cart to localStorage whenever global state changes (but not during initial load)
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

  const addToCart = useCallback((item: Omit<SimpleCartItem, 'id'>) => {
    // Generate appropriate ID based on item type
    const itemId = item.leasingRecordId 
      ? `${item.leasingRecordId}-${Date.now()}`
      : `${item.sku || 'container'}-${Date.now()}`;
      
    const newItem: SimpleCartItem = {
      ...item,
      id: itemId,
      quantity: item.quantity || 1
    };
    
    const updatedItems = [...globalCartItems, newItem];
    
    notifySubscribers(updatedItems);
    
    // Manually save to localStorage to ensure persistence
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
    
    // Create appropriate toast message based on item type
    const description = item.leasingRecordId 
      ? `${item.origin} → ${item.destination} lease added to cart.`
      : `${item.type} container (${item.condition}) added to cart.`;
    
    toast({
      title: "Added to Cart",
      description,
    });
    
    // Return success object for components that expect it (like EcommSearchKit)
    return { success: true };
  }, [toast]);

  const removeFromCart = useCallback((itemId: string) => {
    const updatedItems = globalCartItems.filter(item => item.id !== itemId);
    notifySubscribers(updatedItems);
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    });
  }, [toast]);

  const clearCart = useCallback(() => {
    notifySubscribers([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  }, [toast]);



  // Add a function to remove duplicate/stale items
  const cleanupCart = () => {
    const uniqueItems = new Map();
    cartItems.forEach(item => {
      const key = `${item.origin}-${item.destination}-${item.containerSize}`;
      if (!uniqueItems.has(key) || uniqueItems.get(key).id < item.id) {
        uniqueItems.set(key, item);
      }
    });
    const cleanedItems = Array.from(uniqueItems.values());
    if (cleanedItems.length !== cartItems.length) {
      setCartItems(cleanedItems);
      console.log('🧽 Cart cleaned - removed duplicates:', cartItems.length - cleanedItems.length);
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      let price: number;
      if (typeof item.price === 'string') {
        price = parseFloat(item.price.replace(/[$,]/g, ''));
      } else {
        price = item.price;
      }
      return total + (price * item.quantity);
    }, 0);
  };

  // Memoize cart count calculation to ensure proper re-renders
  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    clearCart,
    cleanupCart,
    cartCount,
    getCartTotal,
  };
}
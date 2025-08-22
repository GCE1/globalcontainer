import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  sku: string;
  type: string;
  condition: string;
  price: number;
  quantity: number;
  depot_name: string;
  location: string;
  imageUrl?: string;
}

export interface ShippingOptions {
  doorDirection: 'doors-forward' | 'doors-rearward';
  shippingMethod: 'tilt-bed' | 'roll-off' | 'custom-assist' | 'customer-pickup';
  expeditedDelivery: boolean;
  payOnDelivery: boolean;
  distanceMiles?: number; // Miles from customer location to depot
}

interface CartState {
  items: CartItem[];
  shippingOptions: ShippingOptions;
  referalCode: string;
  orderNote: string;
  termsAccepted: boolean;
  
  // Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateShippingOptions: (options: Partial<ShippingOptions>) => void;
  updateReferalCode: (code: string) => void;
  updateOrderNote: (note: string) => void;
  updateTermsAccepted: (accepted: boolean) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  getShippingCost: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingOptions: {
        doorDirection: 'doors-forward',
        shippingMethod: 'tilt-bed',
        expeditedDelivery: false,
        payOnDelivery: false,
      },
      referalCode: '',
      orderNote: '',
      termsAccepted: false,

      addToCart: (item: CartItem) =>
        set((state) => {
          const existingItem = state.items.find(i => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeFromCart: (id: string) =>
        set((state) => ({
          items: state.items.filter(item => item.id !== id),
        })),

      updateQuantity: (id: string, quantity: number) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter(item => item.id !== id) };
          }
          return {
            items: state.items.map(item =>
              item.id === id ? { ...item, quantity } : item
            ),
          };
        }),

      updateShippingOptions: (options: Partial<ShippingOptions>) =>
        set((state) => ({
          shippingOptions: { ...state.shippingOptions, ...options },
        })),

      updateReferalCode: (code: string) => set({ referalCode: code }),

      updateOrderNote: (note: string) => set({ orderNote: note }),

      updateTermsAccepted: (accepted: boolean) => set({ termsAccepted: accepted }),

      clearCart: () =>
        set({
          items: [],
          shippingOptions: {
            doorDirection: 'doors-forward',
            shippingMethod: 'tilt-bed',
            expeditedDelivery: false,
            payOnDelivery: false,
          },
          referalCode: '',
          orderNote: '',
          termsAccepted: false,
        }),

      getCartTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },

      getShippingCost: () => {
        const state = get();
        const { shippingMethod, expeditedDelivery, distanceMiles } = state.shippingOptions;
        const miles = distanceMiles || 0;
        
        let baseCost = 0;
        switch (shippingMethod) {
          case 'tilt-bed':
            baseCost = (miles * 9) + 150; // miles * 9 + $150
            break;
          case 'roll-off':
            baseCost = (miles * 9) + 150; // Same as tilt-bed per requirements
            break;
          case 'custom-assist':
            baseCost = (miles * 9) + 250; // miles * 9 + $250
            break;
          case 'customer-pickup':
            baseCost = 0; // Free within 7-days with release number
            break;
        }
        
        return expeditedDelivery ? baseCost + 200 : baseCost;
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
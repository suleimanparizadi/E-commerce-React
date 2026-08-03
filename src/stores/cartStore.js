import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,

      setItems: (items) =>
        set({
          items: items || [],
          itemCount: (items || []).reduce((sum, item) => sum + (item.quantity || 0), 0),
        }),

      addItem: (item) =>
        set((state) => {
          // Use product.slug as the unique key for matching
          const existing = state.items.find(
            (i) => i.product?.slug === item.product?.slug
          );
          let newItems;
          if (existing) {
            newItems = state.items.map((i) =>
              i.product?.slug === item.product?.slug
                ? { ...i, quantity: (i.quantity || 0) + (item.quantity || 1) }
                : i
            );
          } else {
            // Generate a local ID for guest cart items
            newItems = [
              ...state.items,
              { ...item, id: item.id || `guest-${Date.now()}` },
            ];
          }
          return {
            items: newItems,
            itemCount: newItems.reduce((sum, i) => sum + (i.quantity || 0), 0),
          };
        }),

      removeItem: (itemId) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== itemId);
          return {
            items: newItems,
            itemCount: newItems.reduce((sum, i) => sum + (i.quantity || 0), 0),
          };
        }),

      updateQuantity: (itemId, quantity) =>
        set((state) => {
          const newItems = state.items.map((i) =>
            i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i
          );
          return {
            items: newItems,
            itemCount: newItems.reduce((sum, i) => sum + (i.quantity || 0), 0),
          };
        }),

      clearCart: () => set({ items: [], itemCount: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
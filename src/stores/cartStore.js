import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  itemCount: 0,

  setItems: (items) =>
    set({ items, itemCount: items.reduce((sum, item) => sum + item.quantity, 0) }),

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === item.product.id);
      let newItems;
      if (existing) {
        newItems = state.items.map((i) =>
          i.product.id === item.product.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newItems = [...state.items, item];
      }
      return {
        items: newItems,
        itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
      };
    }),

  removeItem: (itemId) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== itemId);
      return {
        items: newItems,
        itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
      };
    }),

  updateQuantity: (itemId, quantity) =>
    set((state) => {
      const newItems = state.items.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      );
      return {
        items: newItems,
        itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
      };
    }),

  clearCart: () => set({ items: [], itemCount: 0 }),
}));
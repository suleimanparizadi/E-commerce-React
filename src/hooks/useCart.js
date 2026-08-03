import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cart';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';

export function useCart() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { items, itemCount, addItem: addToStore, removeItem: removeFromStore, updateQuantity: updateStore, clearCart: clearStore, setItems } = useCartStore();

  // Only fetch from API if authenticated
  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await cartApi.getCart();
      const cartData = res.data;
      // Sync API cart to local store
      if (cartData?.items) {
        setItems(cartData.items);
      }
      return cartData;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });

  // Add item — API for auth, local store for guest
  const addItem = useMutation({
    
    mutationFn: async (data) => {
      if (isAuthenticated) {
        const res = await cartApi.addItem(data);
        return res.data;
      }
      // Guest: add directly to local store
      return data;
    },
    onSuccess: (data, variables) => {
      if (!isAuthenticated) {
        // For guest, construct the item shape that CartPage expects
        addToStore({
          product: variables.product || { slug: variables.product_slug },
          quantity: variables.quantity || 1,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    
  });

  // Remove item
  const removeItem = useMutation({
    mutationFn: async (itemId) => {
      if (isAuthenticated) {
        const res = await cartApi.removeItem(itemId);
        return res.data;
      }
      return itemId;
    },
    onSuccess: (data, itemId) => {
      if (!isAuthenticated) {
        removeFromStore(itemId);
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Update item
  const updateItem = useMutation({
    mutationFn: async ({ itemId, data }) => {
      if (isAuthenticated) {
        const res = await cartApi.updateItem(itemId, data);
        return res.data;
      }
      return { itemId, data };
    },
    onSuccess: (data, variables) => {
      if (!isAuthenticated) {
        updateStore(variables.itemId, variables.data.quantity);
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Clear cart
  const clearCart = useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        const res = await cartApi.clearCart();
        return res.data;
      }
      return null;
    },
    onSuccess: () => {
      clearStore();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Return unified interface
  const cartData = isAuthenticated
    ? cartQuery.data
    : { items, itemCount };

  return {
    cart: {
      data: cartData,
      isLoading: isAuthenticated ? cartQuery.isLoading : false,
      error: isAuthenticated ? cartQuery.error : null,
    },
    addItem,
    updateItem,
    removeItem,
    clearCart,
    isAuthenticated,
  };
}
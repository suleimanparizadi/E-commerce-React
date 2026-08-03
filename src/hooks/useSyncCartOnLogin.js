import { useMutation } from '@tanstack/react-query';
import { cartApi } from '../api/cart';
import { useCartStore } from '../stores/cartStore';

export function useSyncCartOnLogin() {
  const clearStore = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: async (items) => {
      if (!items || items.length === 0) return [];
      const results = await cartApi.addItemsBulk(items);
      return results;
    },
    onSuccess: () => {
      // Clear guest cart after successful sync
      clearStore();
    },
    onError: (error) => {
      console.error('Cart sync failed:', error);
    },
  });
}
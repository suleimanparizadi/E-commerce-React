import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cart';
import { useCartStore } from '../stores/cartStore';

export function useCart() {
  const queryClient = useQueryClient();
  const { setItems } = useCartStore();

  // Get cart
  const cart = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart().then((res) => {
      setItems(res.data.items);
      return res.data;
    }),
  });

  // Add item
  const addItem = useMutation({
    mutationFn: (data) => cartApi.addItem(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Update item
  const updateItem = useMutation({
    mutationFn: ({ itemId, data }) => cartApi.updateItem(itemId, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Remove item
  const removeItem = useMutation({
    mutationFn: (itemId) => cartApi.removeItem(itemId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Clear cart
  const clearCart = useMutation({
    mutationFn: () => cartApi.clearCart().then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    cart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };
}
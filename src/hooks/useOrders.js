import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/orders';

export function useOrders() {
  const queryClient = useQueryClient();

  // Get all user orders
  const orders = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getOrders().then((res) => res.data),
  });

  // Get single order detail
  const useOrder = (orderId) =>
    useQuery({
      queryKey: ['order', orderId],
      queryFn: () => ordersApi.getOrder(orderId).then((res) => res.data),
      enabled: !!orderId,
    });

  // Checkout - convert cart to order
  const checkout = useMutation({
    mutationFn: (data) => ordersApi.checkout(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    orders,
    useOrder,
    checkout,
  };
}
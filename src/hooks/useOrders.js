import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/orders';

// Helper to extract data from Django's { data: ... } wrapper
function extractData(response) {
  if (!response) return null;
  // Django wraps: { data: [...] } or { data: {...} }
  if (response.data !== undefined) return response.data;
  return response;
}

export function useOrders() {
  const queryClient = useQueryClient();

  // Get all user orders
  const orders = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await ordersApi.getOrders();
      console.log('📦 Orders API response:', res.data);
      const extracted = extractData(res.data);
      return Array.isArray(extracted) ? extracted : [];
    },
  });

  // Get single order detail
  const useOrder = (orderId) =>
    useQuery({
      queryKey: ['order', orderId],
      queryFn: async () => {
        const res = await ordersApi.getOrder(orderId);
        console.log('📦 Order detail API response:', res.data);
        return extractData(res.data);
      },
      enabled: !!orderId,
    });

  // Checkout - convert cart to order
  const checkout = useMutation({
    mutationFn: (data) => ordersApi.checkout(data).then((res) => extractData(res.data)),
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
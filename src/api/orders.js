import { apiClient } from './client';

export const ordersApi = {
  checkout: (data) => apiClient.post('/order/checkout/', data),
  getOrders: () => apiClient.get('/order/'),
  getOrder: (orderId) => apiClient.get(`/order/order_detail/${orderId}/`),
};
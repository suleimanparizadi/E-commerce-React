import { apiClient } from './client';

export const ordersApi = {
  // Checkout - convert cart to order
  checkout: (data) =>
    apiClient.post('/order/checkout/', data),

  // Get all user orders
  getOrders: () =>
    apiClient.get('/order/'),

  // Get single order detail
  getOrder: (orderId) =>
    apiClient.get(`/order/order_detail/${orderId}/`),
};
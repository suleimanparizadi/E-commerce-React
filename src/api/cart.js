import { apiClient } from './client';

export const cartApi = {
  getCart: () => apiClient.get('/cart/'),
  addItem: (data) => apiClient.post('/cart/add_item/', data),
  updateItem: (itemId, data) => apiClient.patch(`/cart/item/?item_id=${itemId}`, data),
  removeItem: (itemId) => apiClient.delete(`/cart/item/?item_id=${itemId}`),
  clearCart: () => apiClient.post('/cart/clear/'),
};


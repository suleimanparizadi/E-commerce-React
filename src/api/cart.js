import { apiClient } from './client';

export const cartApi = {
  // Get cart
  getCart: () =>
    apiClient.get('/cart/'),

  // Add item to cart
  addItem: (data) =>
    apiClient.post('/cart/add_item/', data),

  // Update item quantity
  updateItem: (itemId, data) =>
    apiClient.patch(`/cart/item/?item_id=${itemId}`, data),

  // Remove item from cart
  removeItem: (itemId) =>
    apiClient.delete(`/cart/item/?item_id=${itemId}`),

  // Clear cart
  clearCart: () =>
    apiClient.post('/cart/clear/'),
};
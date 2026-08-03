import { apiClient } from './client';

export const cartApi = {
  getCart: () => apiClient.get('/cart/'),
  
  addItem: (data) => apiClient.post('/cart/add_item/', data),
  
  // FIX: Use path param instead of query param
  updateItem: (itemId, data) => apiClient.patch(`/cart/item/${itemId}/`, data),
  
  // FIX: Use path param instead of query param  
  removeItem: (itemId) => apiClient.delete(`/cart/item/${itemId}/`),
  
  // FIX: Use DELETE instead of POST
  clearCart: () => apiClient.delete('/cart/clear/'),
};
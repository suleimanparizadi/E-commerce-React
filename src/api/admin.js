import { apiClient } from './client';

export const adminApi = {
  // ─── Products ───
  getProducts: () => apiClient.get('/products/'),
  createProduct: (data) => apiClient.post('/products/create/', data),
  updateProduct: (slug, data) => apiClient.put(`/products/admin/${slug}/update/`, data),
  deleteProduct: (slug) => apiClient.delete(`/products/admin/${slug}/delete/`),

  // ─── Dropdown Data ───
  getCPUs: () => apiClient.get('/products/cpu/'),
  getCategories: () => apiClient.get('/products/category'),

  // ─── Orders ───
  getAllOrders: () => apiClient.get('/order/admin/list_orders/'),
  changeOrderStatus: (orderId, status) => 
    apiClient.patch(`/order/admin/${orderId}/change_status/`, { status }),

  // ─── Users ───
  getUsers: () => apiClient.get('/accounts/admin/user_list/'),
  toggleUserActive: (userId) => 
    apiClient.post(`/accounts/admin/user_activation/${userId}/`),

  // ─── FAQ ───
  getFAQs: () => apiClient.get('/assistant/admin/faq_list/'),
  createFAQ: (data) => apiClient.post('/assistant/admin/create_faq/', data),
  updateFAQ: (faqId, data) => 
    apiClient.put(`/assistant/admin/update_faq/${faqId}/`, data),
  deleteFAQ: (faqId) => 
    apiClient.delete(`/assistant/admin/delete_faq/${faqId}/`),
};
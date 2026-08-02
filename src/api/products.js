import { apiClient } from './client';

export const productsApi = {
  getProducts: () => apiClient.get('/products/'),
  getProduct: (slug) => apiClient.get(`/products/${slug}/`),
  searchProducts: (filters) => apiClient.get('/products/search/', { params: filters }),
};
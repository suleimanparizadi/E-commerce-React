import { apiClient } from './client';

export const productsApi = {
  // List all products
  getProducts: () =>
    apiClient.get('/products/'),

  // Get product by slug
  getProduct: (slug) =>
    apiClient.get(`/products/${slug}/`),

  // Search and filter products
  searchProducts: (filters) =>
    apiClient.get('/products/search/', { params: filters }),
};
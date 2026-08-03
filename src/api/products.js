import { apiClient } from './client';

export const productsApi = {
  getProducts: () => apiClient.get('/products/'),
  getProduct: (slug) => apiClient.get(`/products/${slug}/`),
  
  // FIX: use 'q' instead of 'search' to match Django
  searchProducts: (filters) => apiClient.get('/products/search/', { 
    params: {
      q: filters.q || filters.search || '',
      brand: filters.brand,
      category_slug: filters.category_slug,
      ram: filters.ram,
      storage: filters.storage,
      min_price: filters.min_price,
      max_price: filters.max_price,
      gpu: filters.gpu,
      cpu_manufacturer: filters.cpu_manufacturer,
      in_stock_only: filters.in_stock_only,
      touch_screen: filters.touch_screen,
      min_display_size: filters.min_display_size,
      max_display_size: filters.max_display_size,
    },
  }),
};
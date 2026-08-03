import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productsApi.getProducts();
      const data = response?.data || [];
      return Array.isArray(data) ? data : [];
    },
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await productsApi.getProduct(slug);
      return response?.data || null;
    },
    enabled: !!slug,
  });
}

export function useSearchProducts(filters) {
  return useQuery({
    queryKey: ['products', 'search', filters],
    queryFn: async () => {
      const response = await productsApi.searchProducts(filters);
      const data = response?.data || [];
      return Array.isArray(data) ? data : [];
    },
    // Only run if there's a search query OR at least one filter
    enabled: !!(filters.q || filters.search || filters.brand || filters.category_slug || filters.ram || filters.storage || filters.gpu || filters.cpu_manufacturer || filters.min_price || filters.max_price || filters.in_stock_only !== undefined || filters.touch_screen !== undefined),
  });
}
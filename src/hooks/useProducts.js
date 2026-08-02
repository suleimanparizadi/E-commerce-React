import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productsApi.getProducts();
      // Extract the array from the response
      const data = response?.data?.data || response?.data || [];
      return Array.isArray(data) ? data : [];
    },
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await productsApi.getProduct(slug);
      return response?.data?.data || response?.data || null;
    },
    enabled: !!slug,
  });
}

export function useSearchProducts(filters) {
  return useQuery({
    queryKey: ['products', 'search', filters],
    queryFn: async () => {
      const response = await productsApi.searchProducts(filters);
      const data = response?.data?.data || response?.data || [];
      return Array.isArray(data) ? data : [];
    },
    enabled: Object.keys(filters).length > 0 && filters.search !== undefined,
  });
}
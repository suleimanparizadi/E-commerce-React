import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getProducts().then((res) => res.data),
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getProduct(slug).then((res) => res.data),
    enabled: !!slug,
  });
}

export function useSearchProducts(filters) {
  return useQuery({
    queryKey: ['products', 'search', filters],
    queryFn: () => productsApi.searchProducts(filters).then((res) => res.data),
    enabled: Object.keys(filters).length > 0,
  });
}
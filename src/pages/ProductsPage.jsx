import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { ProductList } from '../features/products/components/ProductList';
import { ProductFilters } from '../features/products/components/ProductFilters';
import { Search, Grid3X3, List } from 'lucide-react';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Build filters from URL params
  const filters = {};
  searchParams.forEach((value, key) => {
    if (key !== 'q') filters[key] = value;
  });

  const hasSearch = searchParams.get('q');
  const hasFilters = Object.keys(filters).length > 0;
  const shouldSearch = !!(hasSearch || hasFilters);

  // Fetch all products
  const { data: allProducts, isLoading: allLoading, error: allError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productsApi.getProducts();
      const data = response?.data || [];
      return Array.isArray(data) ? data : [];
    },
  });

  // Fetch search/filter results
  const { data: searchResults, isLoading: searchLoading, error: searchError } = useQuery({
    queryKey: ['products', 'search', { q: hasSearch, ...filters }],
    queryFn: async () => {
      const response = await productsApi.searchProducts({ 
        q: hasSearch,
        ...filters,
      });
      const data = response?.data || [];
      return Array.isArray(data) ? data : [];
    },
    enabled: shouldSearch,
  });

  // Use the right data source
  const products = shouldSearch ? (searchResults || []) : (allProducts || []);
  const isLoading = shouldSearch ? searchLoading : allLoading;
  const error = shouldSearch ? searchError : allError;

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  return (
    <div className="px-4 lg:px-0">
      {/* Product Topbar - Amado Style */}
      <div className="flex flex-wrap items-center justify-between mb-10">
        <div className="mb-4 lg:mb-0">
          <p className="text-sm text-amado-dark uppercase mb-2">
            تعداد محصولات: {products.length}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px] h-[40px] bg-amado-bg border-none px-4 text-sm text-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute left-0 top-0 h-full px-3 text-gray-500 hover:text-amado-primary"
            >
              <Search size={16} />
            </button>
          </form>

          {/* View toggle */}
          <div className="flex">
            <button className="w-10 h-10 flex items-center justify-center bg-amado-primary text-white">
              <Grid3X3 size={16} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-amado-dark text-white">
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content - Amado Style: Sidebar left, Products right */}
      <div className="flex flex-col lg:flex-row">
        {/* Filters sidebar - Amado Style */}
        <div className="w-full lg:w-[230px] lg:min-w-[230px] shrink-0 order-2 lg:order-1">
          <ProductFilters />
        </div>

        {/* Products grid */}
        <div className="flex-1 order-1 lg:order-2">
          <ProductList products={products} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
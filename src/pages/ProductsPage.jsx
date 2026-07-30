import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, useSearchProducts } from '@/hooks/useProducts';
import { ProductList } from '@/features/products/components/ProductList';
import { ProductFilters } from '@/features/products/components/ProductFilters';
import { Search } from 'lucide-react';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Build filters from URL params
  const filters = {};
  searchParams.forEach((value, key) => {
    if (key !== 'search') filters[key] = value;
  });

  // Search by text
  const hasSearch = searchParams.get('search');
  const hasFilters = Object.keys(filters).length > 0;

  const { data: allProducts, isLoading: allLoading } = useProducts();
  const { data: searchResults, isLoading: searchLoading } = useSearchProducts(
    hasSearch || hasFilters ? { ...filters, search: hasSearch || undefined } : {}
  );

  const products = hasSearch || hasFilters ? searchResults : allProducts;
  const isLoading = hasSearch || hasFilters ? searchLoading : allLoading;

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">فروشگاه</h1>
        <p className="text-gray-500">جدیدترین لپ‌تاپ‌ها با بهترین قیمت</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="جستجوی محصول..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-900"
          >
            <Search size={20} />
          </button>
        </div>
      </form>

      {/* Content grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <ProductFilters />
        </div>

        {/* Products grid */}
        <div className="flex-1">
          <ProductList products={products || []} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
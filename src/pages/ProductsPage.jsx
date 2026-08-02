import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts, useSearchProducts } from '../hooks/useProducts';
import { ProductList } from '../features/products/components/ProductList';
import { ProductFilters } from '../features/products/components/ProductFilters';
import { Search, Grid3X3, List } from 'lucide-react';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState('grid');

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
      {/* Product Topbar - Amado Style */}
      <div className="flex flex-wrap items-center justify-between mb-10 px-4 lg:px-0">
        <div className="mb-4 lg:mb-0">
          <p className="text-sm text-amado-dark uppercase mb-2">
            تعداد محصولات: {products?.length || 0}
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
            <button
              onClick={() => setViewMode('grid')}
              className={`w-10 h-10 flex items-center justify-center ${
                viewMode === 'grid' ? 'bg-amado-primary text-white' : 'bg-amado-dark text-white'
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`w-10 h-10 flex items-center justify-center ${
                viewMode === 'list' ? 'bg-amado-primary text-white' : 'bg-amado-dark text-white'
              }`}
            >
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
          <ProductList products={products || []} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
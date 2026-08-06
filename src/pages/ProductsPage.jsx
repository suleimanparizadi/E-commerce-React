import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { ProductList } from '../features/products/components/ProductList';
import { ProductFilters } from '../features/products/components/ProductFilters';
import { Search, Grid3X3, List, Package, Filter, ChevronDown } from 'lucide-react';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

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

  const getFilterCount = () => {
    return Object.keys(filters).filter(key => filters[key]).length;
  };

  return (
    <div className="px-4 lg:px-0 animate-fadeIn">
      {/* Header */}
      <div className="mb-10 relative">
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#131212] mb-2 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Package size={22} className="text-white" />
              </span>
              محصولات
            </h1>
            <p className="text-blue-500 mr-13 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse"></span>
              {products.length} محصول یافت شد
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-blue-400 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <Filter size={16} />
            <span>فیلترهای فعال: {getFilterCount()}</span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-30"></div>
      </div>

      {/* Topbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white rounded-2xl border border-blue-100 p-4 shadow-lg shadow-blue-50 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">تعداد:</span>
            <span className="font-bold text-[#131212]">{products.length}</span>
            <span className="text-gray-400">محصول</span>
          </div>
          
          {hasFilters && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <Filter size={12} />
                {getFilterCount()} فیلتر
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative flex-1 lg:flex-none">
            <input
              type="text"
              placeholder="جستجوی محصولات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-[220px] h-12 bg-blue-50/50 rounded-xl border border-blue-100 px-4 pr-11 text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Search size={18} />
            </button>
          </form>

          {/* View toggle */}
          <div className="flex bg-blue-50/50 rounded-xl border border-blue-100 overflow-hidden p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                ${viewMode === 'grid' 
                  ? 'bg-[#131212] text-white shadow-md shadow-gray-200' 
                  : 'text-gray-400 hover:text-[#131212] hover:bg-blue-100/50'
                }
              `}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                ${viewMode === 'list' 
                  ? 'bg-[#131212] text-white shadow-md shadow-gray-200' 
                  : 'text-gray-400 hover:text-[#131212] hover:bg-blue-100/50'
                }
              `}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="w-full lg:w-[260px] lg:min-w-[260px] shrink-0 order-2 lg:order-1">
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-lg shadow-blue-50 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#131212] flex items-center gap-2">
                <Filter size={18} className="text-blue-600" />
                فیلترها
              </h3>
              {hasFilters && (
                <button
                  onClick={() => setSearchParams({})}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  پاک کردن همه
                </button>
              )}
            </div>
            <ProductFilters />
          </div>
        </div>

        {/* Products grid */}
        <div className="flex-1 order-1 lg:order-2">
          <ProductList 
            products={products} 
            isLoading={isLoading} 
            viewMode={viewMode}
          />
          
          {/* Loading state for products */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package size={20} className="text-blue-600 animate-pulse" />
                </div>
              </div>
              <p className="text-blue-600 font-medium animate-pulse">بارگذاری محصولات...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <p className="text-red-600 font-medium">خطا در بارگذاری محصولات</p>
              <p className="text-red-400 text-sm mt-1">لطفاً دوباره تلاش کنید</p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
                  <Package size={40} className="text-blue-300" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#fbb710] flex items-center justify-center shadow-lg shadow-yellow-200">
                  <span className="text-[#131212] text-xs font-bold">0</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#131212] mb-2">محصولی یافت نشد</h3>
              <p className="text-gray-400">سعی کنید فیلترهای خود را تغییر دهید</p>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
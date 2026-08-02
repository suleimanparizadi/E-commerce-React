import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { ProductList } from '../features/products/components/ProductList';
import { ProductFilters } from '../features/products/components/ProductFilters';
import { Search, Grid3X3, List, Bug } from 'lucide-react';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [debugInfo, setDebugInfo] = useState({
    allProductsRaw: null,
    searchResultsRaw: null,
    allProductsType: 'unknown',
    searchResultsType: 'unknown',
    apiStructure: 'unknown',
  });

  // Build filters from URL params
  const filters = {};
  searchParams.forEach((value, key) => {
    if (key !== 'search') filters[key] = value;
  });

  const hasSearch = searchParams.get('search');
  const hasFilters = Object.keys(filters).length > 0;
  const shouldSearch = !!(hasSearch || hasFilters);

  // Fetch products directly with detailed logging
  const { data: allProducts, isLoading: allLoading, error: allError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('🔄 Fetching all products...');
      try {
        const response = await productsApi.getProducts();
        console.log('📦 Raw API Response (all products):', response);
        console.log('📦 Response type:', typeof response);
        console.log('📦 Response keys:', Object.keys(response || {}));
        
        // Try different extraction methods
        let extractedData = null;
        let structure = 'unknown';
        
        if (Array.isArray(response)) {
          extractedData = response;
          structure = 'direct-array';
        } else if (response?.data) {
          if (Array.isArray(response.data)) {
            extractedData = response.data;
            structure = 'data-array';
          } else if (response.data?.data && Array.isArray(response.data.data)) {
            extractedData = response.data.data;
            structure = 'nested-data';
          } else {
            extractedData = [];
            structure = 'invalid-data';
          }
        } else {
          extractedData = [];
          structure = 'no-data';
        }
        
        console.log(`✅ Extracted data (${structure}):`, extractedData);
        console.log(`📊 Array length: ${extractedData.length}`);
        console.log(`📊 First item:`, extractedData[0]);
        
        // Update debug info
        setDebugInfo(prev => ({
          ...prev,
          allProductsRaw: response,
          allProductsType: structure,
          apiStructure: structure,
        }));
        
        return Array.isArray(extractedData) ? extractedData : [];
      } catch (error) {
        console.error('❌ Error fetching products:', error);
        setDebugInfo(prev => ({
          ...prev,
          allProductsRaw: { error: error.message },
          allProductsType: 'error',
        }));
        return [];
      }
    },
  });

  // Fetch search results with detailed logging
  const { data: searchResults, isLoading: searchLoading, error: searchError } = useQuery({
    queryKey: ['products', 'search', filters, hasSearch],
    queryFn: async () => {
      console.log('🔍 Fetching search results...');
      console.log('🔍 Filters:', { ...filters, search: hasSearch });
      
      try {
        const response = await productsApi.searchProducts({ 
          ...filters, 
          search: hasSearch 
        });
        
        console.log('📦 Raw API Response (search):', response);
        console.log('📦 Response type:', typeof response);
        console.log('📦 Response keys:', Object.keys(response || {}));
        
        // Try different extraction methods
        let extractedData = null;
        let structure = 'unknown';
        
        if (Array.isArray(response)) {
          extractedData = response;
          structure = 'direct-array';
        } else if (response?.data) {
          if (Array.isArray(response.data)) {
            extractedData = response.data;
            structure = 'data-array';
          } else if (response.data?.data && Array.isArray(response.data.data)) {
            extractedData = response.data.data;
            structure = 'nested-data';
          } else {
            extractedData = [];
            structure = 'invalid-data';
          }
        } else {
          extractedData = [];
          structure = 'no-data';
        }
        
        console.log(`✅ Extracted search data (${structure}):`, extractedData);
        console.log(`📊 Search array length: ${extractedData.length}`);
        
        setDebugInfo(prev => ({
          ...prev,
          searchResultsRaw: response,
          searchResultsType: structure,
        }));
        
        return Array.isArray(extractedData) ? extractedData : [];
      } catch (error) {
        console.error('❌ Error searching products:', error);
        setDebugInfo(prev => ({
          ...prev,
          searchResultsRaw: { error: error.message },
          searchResultsType: 'error',
        }));
        return [];
      }
    },
    enabled: shouldSearch,
  });

  // Use the right data source
  const products = shouldSearch ? (searchResults || []) : (allProducts || []);
  const isLoading = shouldSearch ? searchLoading : allLoading;
  const error = shouldSearch ? searchError : allError;

  // Debug logging on every render
  useEffect(() => {
    console.log('🔄 Component re-rendered');
    console.log('📊 Current products:', products);
    console.log('📊 Products type:', typeof products);
    console.log('📊 Is array?', Array.isArray(products));
    console.log('📊 Products length:', products.length);
    console.log('🔍 Should search:', shouldSearch);
    console.log('🔍 Has search:', hasSearch);
    console.log('🔍 Has filters:', hasFilters);
    console.log('🔍 Filters:', filters);
    
    if (products.length > 0) {
      console.log('📊 First product:', products[0]);
    }
  }, [products, shouldSearch, hasSearch, hasFilters, filters]);

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
    <div className="px-4 lg:px-0">
      {/* 🔥 Debug Panel */}
      <div className="bg-yellow-50 border border-yellow-400 p-4 mb-6 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Bug size={18} className="text-yellow-700" />
          <h3 className="font-bold text-yellow-800">Debug Info</h3>
          <span className="text-xs text-yellow-600 ml-auto">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="bg-white p-2 rounded">
            <strong>All Products:</strong>
            <span className="ml-2">
              {debugInfo.allProductsType === 'unknown' ? '⏳ Waiting...' : 
               debugInfo.allProductsType === 'error' ? '❌ Error' :
               debugInfo.allProductsType === 'direct-array' ? '✅ Array' :
               debugInfo.allProductsType === 'data-array' ? '✅ {data: [...]}' :
               debugInfo.allProductsType === 'nested-data' ? '✅ {data: {data: [...]}}' :
               debugInfo.allProductsType === 'invalid-data' ? '⚠️ Invalid' : '❓ Unknown'}
            </span>
            <span className="ml-2 text-gray-500">
              ({products.length} items)
            </span>
          </div>
          
          <div className="bg-white p-2 rounded">
            <strong>Search Results:</strong>
            <span className="ml-2">
              {debugInfo.searchResultsType === 'unknown' ? '⏳ Waiting...' :
               debugInfo.searchResultsType === 'error' ? '❌ Error' :
               debugInfo.searchResultsType === 'direct-array' ? '✅ Array' :
               debugInfo.searchResultsType === 'data-array' ? '✅ {data: [...]}' :
               debugInfo.searchResultsType === 'nested-data' ? '✅ {data: {data: [...]}}' :
               '❓ Unknown'}
            </span>
          </div>
          
          <div className="bg-white p-2 rounded col-span-2">
            <strong>API Structure:</strong>
            <span className="ml-2">
              {debugInfo.apiStructure === 'direct-array' ? '📦 Direct array' :
               debugInfo.apiStructure === 'data-array' ? '📦 { data: [...] }' :
               debugInfo.apiStructure === 'nested-data' ? '📦 { data: { data: [...] } }' :
               '⏳ Detecting...'}
            </span>
          </div>
          
          {error && (
            <div className="bg-red-100 p-2 rounded col-span-2 text-red-700">
              ❌ Error: {error.message || 'Unknown error'}
            </div>
          )}
          
          <div className="bg-white p-2 rounded col-span-2">
            <details>
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                📋 View Raw Data
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify({
                  allProducts: debugInfo.allProductsRaw,
                  searchResults: debugInfo.searchResultsRaw,
                  productsArray: products
                }, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>

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
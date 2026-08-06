import { ProductCard } from './ProductCard';
import { Loader2, Package, Filter } from 'lucide-react';

export function ProductList({ products, isLoading, viewMode = 'grid' }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Package size={20} className="text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="text-blue-600 font-medium animate-pulse">بارگذاری محصولات...</p>
      </div>
    );
  }

  // ✅ Safe check: ensure products is an array
  const productsArray = Array.isArray(products) ? products : [];

  if (productsArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50 animate-fadeIn">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
            <Package size={40} className="text-blue-300" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#fbb710] flex items-center justify-center shadow-lg shadow-yellow-200">
            <span className="text-[#131212] text-xs font-bold">0</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-[#131212] mb-3">محصولی یافت نشد</h3>
        <p className="text-gray-400 text-center max-w-sm">
          لطفاً فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید
        </p>
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
          <Filter size={14} />
          <span>می‌توانید از فیلترهای سمت راست استفاده کنید</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-fadeIn ${
      viewMode === 'list' 
        ? 'space-y-4' 
        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
    }`}>
      {productsArray.map((product, index) => (
        <div
          key={product.slug}
          className={`
            ${index === 0 ? 'animate-slideDown [animation-delay:0ms]' : ''}
            ${index === 1 ? 'animate-slideDown [animation-delay:50ms]' : ''}
            ${index === 2 ? 'animate-slideDown [animation-delay:100ms]' : ''}
            ${index === 3 ? 'animate-slideDown [animation-delay:150ms]' : ''}
            ${index === 4 ? 'animate-slideDown [animation-delay:200ms]' : ''}
            ${index === 5 ? 'animate-slideDown [animation-delay:250ms]' : ''}
          `}
        >
          <ProductCard product={product} viewMode={viewMode} />
        </div>
      ))}

      {/* Results count */}
      <div className="col-span-full mt-6 pt-4 border-t border-blue-100 flex items-center justify-between text-sm">
        <span className="text-gray-400">
          نمایش <span className="font-bold text-[#131212]">{productsArray.length}</span> محصول
        </span>
        <span className="text-blue-500 flex items-center gap-1">
          <Package size={14} />
          {productsArray.length} مورد
        </span>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
import { ProductCard } from './ProductCard';
import { Loader2 } from 'lucide-react';

export function ProductList({ products, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={48} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">محصولی یافت نشد</p>
        <p className="text-sm mt-2">لطفاً فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
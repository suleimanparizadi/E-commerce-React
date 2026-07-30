import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem.mutate({ product_slug: product.slug, quantity: 1 });
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.thumbnail || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.stock === 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              ناموجود
            </span>
          )}
          {product.average_rating > 0 && (
            <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded">
              ★ {product.average_rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addItem.isPending}
            className="flex-1 bg-gray-900 text-white py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <ShoppingCart size={16} />
            افزودن به سبد
          </button>
          <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
            <Heart size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-medium text-gray-900 mb-2 hover:text-gray-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        {/* Specs */}
        <div className="flex flex-wrap gap-2 mb-3">
          {product.ram && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {product.ram}GB RAM
            </span>
          )}
          {product.storage && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {product.storage >= 1024 ? `${product.storage / 1024}TB` : `${product.storage}GB`}
            </span>
          )}
          {product.cpu?.manufacturer && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {product.cpu.manufacturer}
            </span>
          )}
        </div>

        <p className="text-lg font-bold text-gray-900">
          {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
        </p>
      </div>
    </div>
  );
}
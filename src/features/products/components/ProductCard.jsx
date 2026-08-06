import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star, TrendingUp, CheckCircle } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem.mutate({ product_slug: product.slug, quantity: 1, product: product });
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group relative bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-lg shadow-blue-50 hover:shadow-xl hover:-translate-y-2 hover:border-blue-200 transition-all duration-300 block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-blue-50/50 to-white">
        <img
          src={product.thumbnail || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Grey hover overlay with gradient */}
        <div
          className={`
            absolute inset-0 bg-gradient-to-t from-[#131212]/60 via-[#131212]/20 to-transparent
            flex items-center justify-center
            transition-all duration-500
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {/* Quick view indicator */}
          <div className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 transform transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <Eye size={16} className="text-[#fbb710]" />
            <span className="text-sm font-medium">مشاهده محصول</span>
          </div>
        </div>

        {/* Stock badge */}
        {product.stock === 0 && (
          <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-200">
            ناموجود
          </span>
        )}

        {/* In stock badge */}
        {product.stock > 0 && (
          <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-200 flex items-center gap-1">
            <CheckCircle size={12} />
            موجود
          </span>
        )}

        {/* Rating badge */}
        {product.average_rating > 0 && (
          <span className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-[#fbb710] text-[#131212] text-xs font-bold shadow-lg shadow-yellow-200 flex items-center gap-1">
            <Star size={12} className="fill-[#131212]" />
            {product.average_rating}
          </span>
        )}

        {/* Cart button - slides up from bottom-right on hover */}
        <div
          className={`
            absolute bottom-4 right-4 transition-all duration-500 ease-out
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
        >
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addItem.isPending}
            className="w-12 h-12 rounded-2xl bg-[#fbb710] text-[#131212] flex items-center justify-center hover:bg-[#e5a50f] transition-all duration-300 hover:scale-110 shadow-lg shadow-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
          >
            <ShoppingCart size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>

        {/* Quick add text on hover */}
        <div
          className={`
            absolute bottom-4 left-4 transition-all duration-500
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
          `}
        >
          <span className="text-xs text-white bg-[#131212]/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
            افزودن به سبد
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Brand with dot */}
        {product.brand && (
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1 h-1 rounded-full bg-blue-400 inline-block"></span>
            <p className="text-xs font-medium text-blue-500 uppercase tracking-wider">
              {product.brand}
            </p>
          </div>
        )}

        {/* Name */}
        <h3 className="text-base font-bold text-[#131212] group-hover:text-blue-600 transition-colors duration-300 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Specs */}
        <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
          {product.ram && (
            <span className="text-xs bg-blue-50/50 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-100 font-medium">
              {product.ram}GB RAM
            </span>
          )}
          {product.storage && (
            <span className="text-xs bg-blue-50/50 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-100 font-medium">
              {product.storage >= 1024 ? `${product.storage / 1024}TB` : `${product.storage}GB`}
            </span>
          )}
          {product.cpu?.manufacturer && (
            <span className="text-xs bg-blue-50/50 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-100 font-medium">
              {product.cpu.manufacturer}
            </span>
          )}
          {product.display_size && (
            <span className="text-xs bg-blue-50/50 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-100 font-medium">
              {product.display_size}"
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-blue-200 to-transparent my-3" />

        {/* Price and action */}
        <div className="flex items-center justify-between">
          <div>
            {/* Price - number only, English format */}
            <p className="text-xl font-bold text-blue-600">
              {new Intl.NumberFormat('en-US').format(product.price)}
            </p>
            {product.compare_price && product.compare_price > product.price && (
              <p className="text-xs text-gray-400 line-through">
                {new Intl.NumberFormat('en-US').format(product.compare_price)}
              </p>
            )}
          </div>

          {/* Quick add button for mobile/visible */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addItem.isPending}
            className="md:hidden w-10 h-10 rounded-xl bg-[#131212] text-white flex items-center justify-center hover:bg-gray-800 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
          </button>

          {/* Desktop: show arrow */}
          <div className="hidden md:flex items-center gap-1 text-blue-400 group-hover:text-blue-600 transition-colors">
            <span className="text-xs font-medium">مشاهده</span>
            <TrendingUp size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Stock status bar */}
        {product.stock > 0 && product.stock < 5 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-amber-600 font-medium">تعداد محدود</span>
              <span className="text-gray-400">{product.stock} عدد باقی</span>
            </div>
            <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${(product.stock / 10) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Animated border glow on hover */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-600/20 via-[#fbb710]/20 to-blue-600/20 rounded-2xl blur-sm"></div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Link>
  );
}
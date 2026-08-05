import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
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
      className="group relative bg-white overflow-hidden product-card-hover block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.thumbnail || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
        />

        {/* Grey hover overlay */}
        <div
          className={`
            absolute inset-0 bg-black/40 flex items-center justify-center
            transition-all duration-500
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Stock badge */}
        {product.stock === 0 && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 uppercase">
            ناموجود
          </span>
        )}

        {/* Blue cart button - slides up from bottom-right on hover */}
        <div
          className={`
            absolute bottom-4 right-4 transition-all duration-500 ease-out
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addItem.isPending}
            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Content - Amado Style */}
      <div className="p-6">
        {/* Price line */}
        <div className="w-[80px] h-[3px] bg-amado-primary mb-4" />
        
        {/* Price - number only, English format */}
        <p className="text-2xl text-amado-primary font-normal mb-2 leading-none">
          {new Intl.NumberFormat('en-US').format(product.price)}
        </p>
        
        {/* Name */}
        <h3 className="text-base text-amado-dark group-hover:text-amado-primary transition-colors duration-500 mb-1">
          {product.name}
        </h3>
        
        {/* Yellow line under name */}
        <div className="w-12 h-[2px] bg-yellow-400 mb-2 transition-all duration-500 group-hover:w-20" />
        
        {/* Brand */}
        <p className="text-sm text-gray-500">{product.brand}</p>
        
        {/* Specs */}
        <div className="flex flex-wrap gap-2 mt-3">
          {product.ram && (
            <span className="text-xs bg-amado-bg px-2 py-1 text-gray-600">
              {product.ram}GB RAM
            </span>
          )}
          {product.storage && (
            <span className="text-xs bg-amado-bg px-2 py-1 text-gray-600">
              {product.storage >= 1024 ? `${product.storage / 1024}TB` : `${product.storage}GB`}
            </span>
          )}
          {product.cpu?.manufacturer && (
            <span className="text-xs bg-amado-bg px-2 py-1 text-gray-600">
              {product.cpu.manufacturer}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
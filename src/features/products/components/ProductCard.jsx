import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem.mutate({ product_slug: product.slug, quantity: 1 });
  };

  return (
    <div
      className="group relative bg-white overflow-hidden product-card-hover"
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
        
        {/* Hover overlay with actions */}
        <div 
          className={`
            absolute inset-0 bg-black/40 flex items-center justify-center gap-3
            transition-all duration-500
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addItem.isPending}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-amado-primary hover:text-white transition-colors disabled:opacity-50"
          >
            <ShoppingCart size={18} />
          </button>
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-amado-primary hover:text-white transition-colors">
            <Heart size={18} />
          </button>
        </div>

        {/* Stock badge */}
        {product.stock === 0 && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 uppercase">
            ناموجود
          </span>
        )}
      </div>

      {/* Content - Amado Style */}
      <div className="p-6">
        {/* Price line */}
        <div className="w-[80px] h-[3px] bg-amado-primary mb-4" />
        
        {/* Price */}
        <p className="text-2xl text-amado-primary font-normal mb-2 leading-none">
          {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
        </p>
        
        {/* Name */}
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-base text-amado-dark hover:text-amado-primary transition-colors duration-500 mb-1">
            {product.name}
          </h3>
        </Link>
        
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
    </div>
  );
}
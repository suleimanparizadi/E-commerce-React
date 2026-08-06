import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, ImageOff, ShoppingCart, ChevronLeft } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const items = cart.data?.items || [];

  // Defensive total calculation
  const total = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * (item.quantity || 0));
  }, 0);

  if (cart.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag size={20} className="text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="text-blue-600 font-medium animate-pulse">بارگذاری سبد خرید...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-fadeIn">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
            <ShoppingBag size={48} className="text-blue-300" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#fbb710] flex items-center justify-center shadow-lg shadow-yellow-200">
            <span className="text-[#131212] text-xs font-bold">0</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#131212] mb-3">سبد خرید شما خالی است</h2>
        <p className="text-gray-400 mb-8">محصولاتی که دوست دارید را به سبد اضافه کنید</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-[#131212] text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-gray-200 font-medium group"
        >
          <span>بازگشت به فروشگاه</span>
          <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn px-4 lg:px-0">
      {/* Header */}
      <div className="mb-10 relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#131212] mb-2 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#fbb710] flex items-center justify-center shadow-lg shadow-yellow-200">
                <ShoppingCart size={22} className="text-[#131212]" />
              </span>
              سبد خرید
            </h1>
            <p className="text-blue-500 mr-13 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse"></span>
              {items.length} محصول در سبد شما
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-blue-400 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <ShoppingBag size={16} />
            <span>مجموع: {new Intl.NumberFormat('fa-IR').format(total)} تومان</span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#fbb710] to-transparent opacity-30"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart items */}
        <div className="flex-1 space-y-4">
          {items.map((item, index) => {
            // Defensive: handle incomplete guest cart data
            const product = item.product || {};
            const hasProductData = product.name && product.price !== undefined;

            return (
              <div
                key={item.id || `guest-${product.slug || Math.random()}`}
                className={`
                  bg-white rounded-2xl border border-blue-100 p-6 flex gap-6 
                  hover:shadow-xl hover:border-blue-200 transition-all duration-300
                  ${index === 0 ? 'animate-slideDown [animation-delay:0ms]' : ''}
                  ${index === 1 ? 'animate-slideDown [animation-delay:100ms]' : ''}
                  ${index === 2 ? 'animate-slideDown [animation-delay:200ms]' : ''}
                  ${index >= 3 ? 'animate-slideDown [animation-delay:300ms]' : ''}
                  group
                `}
              >
                {/* Image */}
                <Link
                  to={product.slug ? `/products/${product.slug}` : '#'}
                  className="shrink-0"
                >
                  {product.thumbnail ? (
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-blue-50 shadow-sm group-hover:shadow-md transition-shadow">
                      <img
                        src={product.thumbnail}
                        alt={product.name || 'محصول'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.nextSibling.style.display = 'flex';
                        }}
                      />
                    </div>
                  ) : null}
                  <div
                    className={`w-24 h-24 rounded-xl bg-gray-50 items-center justify-center border border-blue-50 ${product.thumbnail ? 'hidden' : 'flex'}`}
                  >
                    <ImageOff size={32} className="text-gray-300" />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1">
                  <Link
                    to={product.slug ? `/products/${product.slug}` : '#'}
                  >
                    <h3 className="text-base font-bold text-[#131212] hover:text-blue-600 transition-colors">
                      {product.name || 'محصول نامشخص'}
                    </h3>
                  </Link>
                  {product.brand && (
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gray-300 inline-block"></span>
                      {product.brand}
                    </p>
                  )}
                  <p className="text-xl text-blue-600 font-bold mt-3">
                    {product.price !== undefined && product.price !== null
                      ? `${new Intl.NumberFormat('fa-IR').format(product.price)} تومان`
                      : 'قیمت نامشخص'
                    }
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end justify-between gap-4">
                  <button
                    onClick={() => removeItem.mutate(item.id)}
                    disabled={removeItem.isPending}
                    className="text-gray-300 hover:text-red-500 transition-all duration-300 hover:scale-110 group-hover:translate-x-1"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex items-center border border-blue-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <button
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateItem.mutate({
                            itemId: item.id,
                            data: { quantity: item.quantity - 1 },
                          });
                        }
                      }}
                      className="px-3 py-2 hover:bg-blue-50 text-[#131212] transition-colors duration-200"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-2 font-bold w-10 text-center text-sm text-[#131212] bg-white">
                      {item.quantity || 0}
                    </span>
                    <button
                      onClick={() => {
                        if (item.quantity < 10) {
                          updateItem.mutate({
                            itemId: item.id,
                            data: { quantity: item.quantity + 1 },
                          });
                        }
                      }}
                      className="px-3 py-2 hover:bg-blue-50 text-[#131212] transition-colors duration-200"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Clear cart */}
          <button
            onClick={() => clearCart.mutate()}
            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-2 mt-6 transition-all duration-300 hover:gap-3 group"
          >
            <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
            <span>پاک کردن سبد خرید</span>
          </button>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl border border-blue-100 p-8 sticky top-6 shadow-lg shadow-blue-50 hover:shadow-xl transition-shadow duration-300 animate-slideDown [animation-delay:400ms]">
            <h2 className="text-lg font-bold text-[#131212] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#fbb710] flex items-center justify-center shadow-md shadow-yellow-200">
                <ShoppingBag size={16} className="text-[#131212]" />
              </span>
              خلاصه سفارش
            </h2>

            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-xl">
                <span className="text-gray-500">تعداد کالا</span>
                <span className="font-bold text-[#131212]">
                  {items.reduce((sum, i) => sum + (i.quantity || 0), 0)} عدد
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-xl">
                <span className="text-gray-500">مجموع</span>
                <span className="font-bold text-[#131212]">
                  {total > 0
                    ? `${new Intl.NumberFormat('fa-IR').format(total)} تومان`
                    : '—'
                  }
                </span>
              </div>
            </div>

            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-6" />

            <div className="flex justify-between items-center text-lg mb-8">
              <span className="font-bold text-[#131212]">قابل پرداخت</span>
              <span className="text-2xl font-bold text-blue-600">
                {total > 0
                  ? `${new Intl.NumberFormat('fa-IR').format(total)} تومان`
                  : '—'
                }
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#131212] text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-gray-200 font-bold flex items-center justify-center gap-2 group"
            >
              <span>ادامه خرید</span>
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </button>

            <Link
              to="/products"
              className="block text-center text-sm text-blue-500 hover:text-blue-600 mt-4 transition-all duration-300 hover:gap-2 flex items-center justify-center gap-1 group"
            >
              <ArrowRight size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>ادامه خرید محصولات</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animations - Add to your global CSS or Tailwind config */}
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
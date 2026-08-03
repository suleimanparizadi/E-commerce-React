import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, ImageOff } from 'lucide-react';

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
      <div className="flex justify-center py-20">
        <Loader2 size={48} className="animate-spin text-amado-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-amado-dark mb-2">سبد خرید شما خالی است</h2>
        <p className="text-gray-500 mb-6">محصولاتی که دوست دارید را به سبد اضافه کنید</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 amado-btn text-base"
        >
          <ArrowRight size={18} />
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-0">
      <div className="w-[80px] h-[3px] bg-amado-primary mb-4" />
      <h1 className="text-3xl text-amado-dark font-normal mb-8">سبد خرید</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart items */}
        <div className="flex-1 space-y-0">
          {items.map((item) => {
            // Defensive: handle incomplete guest cart data
            const product = item.product || {};
            const hasProductData = product.name && product.price !== undefined;

            return (
              <div
                key={item.id || `guest-${product.slug || Math.random()}`}
                className="bg-white border border-gray-100 p-6 flex gap-6"
              >
                {/* Image */}
                <Link
                  to={product.slug ? `/products/${product.slug}` : '#'}
                  className="shrink-0"
                >
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.name || 'محصول'}
                      className="w-24 h-24 object-cover bg-gray-50"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-24 h-24 bg-gray-100 items-center justify-center ${product.thumbnail ? 'hidden' : 'flex'}`}
                  >
                    <ImageOff size={32} className="text-gray-400" />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1">
                  <Link
                    to={product.slug ? `/products/${product.slug}` : '#'}
                  >
                    <h3 className="text-base text-amado-dark hover:text-amado-primary transition-colors">
                      {product.name || 'محصول نامشخص'}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    {product.brand || ''}
                  </p>
                  <p className="text-xl text-amado-primary mt-2">
                    {product.price !== undefined && product.price !== null
                      ? `${new Intl.NumberFormat('fa-IR').format(product.price)} تومان`
                      : 'قیمت نامشخص'
                    }
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem.mutate(item.id)}
                    disabled={removeItem.isPending}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex items-center border border-gray-200">
                    <button
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateItem.mutate({
                            itemId: item.id,
                            data: { quantity: item.quantity - 1 },
                          });
                        }
                      }}
                      className="px-3 py-2 hover:bg-amado-bg text-amado-dark"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-2 font-medium w-10 text-center text-sm">
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
                      className="px-3 py-2 hover:bg-amado-bg text-amado-dark"
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
            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 mt-4"
          >
            <Trash2 size={14} />
            پاک کردن سبد
          </button>
        </div>

        {/* Summary - Amado Style */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-gray-100 p-8 sticky top-6">
            <h2 className="text-lg text-amado-dark font-normal mb-6 uppercase">
              خلاصه سفارش
            </h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">تعداد کالا</span>
                <span>
                  {items.reduce((sum, i) => sum + (i.quantity || 0), 0)} عدد
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">مجموع</span>
                <span>
                  {total > 0
                    ? `${new Intl.NumberFormat('fa-IR').format(total)} تومان`
                    : '—'
                  }
                </span>
              </div>
            </div>

            <div className="w-full h-[2px] bg-gray-100 mb-6" />

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>قابل پرداخت</span>
              <span className="text-amado-primary">
                {total > 0
                  ? `${new Intl.NumberFormat('fa-IR').format(total)} تومان`
                  : '—'
                }
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full amado-btn text-base"
            >
              ادامه خرید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
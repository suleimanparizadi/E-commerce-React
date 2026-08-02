import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const items = cart.data?.items || [];

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (cart.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={48} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">سبد خرید شما خالی است</h2>
        <p className="text-gray-500 mb-6">محصولاتی که دوست دارید را به سبد اضافه کنید</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <ArrowRight size={18} />
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">سبد خرید</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4"
            >
              {/* Image */}
              <Link to={`/products/${item.product.slug}`} className="shrink-0">
                <img
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                />
              </Link>

              {/* Info */}
              <div className="flex-1">
                <Link
                  to={`/products/${item.product.slug}`}
                  className="font-medium text-gray-900 hover:text-gray-700"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500 mt-1">{item.product.brand}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  {new Intl.NumberFormat('fa-IR').format(item.product.price)} تومان
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

                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateItem.mutate({ itemId: item.id, data: { quantity: item.quantity - 1 } });
                      }
                    }}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 py-2 font-medium w-10 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => {
                      if (item.quantity < 10) {
                        updateItem.mutate({ itemId: item.id, data: { quantity: item.quantity + 1 } });
                      }
                    }}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Clear cart */}
          <button
            onClick={() => clearCart.mutate()}
            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <Trash2 size={14} />
            پاک کردن سبد
          </button>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-gray-100 rounded-xl p-6 sticky top-6">
            <h2 className="font-bold text-lg mb-4">خلاصه سفارش</h2>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">تعداد کالا</span>
                <span>{items.reduce((sum, i) => sum + i.quantity, 0)} عدد</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">مجموع</span>
                <span>{new Intl.NumberFormat('fa-IR').format(total)} تومان</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <div className="flex justify-between font-bold text-lg">
                <span>قابل پرداخت</span>
                <span>{new Intl.NumberFormat('fa-IR').format(total)} تومان</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              ادامه خرید
            </button>

            <Link
              to="/products"
              className="block text-center text-sm text-gray-500 hover:text-gray-900 mt-4"
            >
              ادامه خرید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
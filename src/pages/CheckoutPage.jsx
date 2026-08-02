import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { useCart } from '@/hooks/useCart';
import { ArrowRight, Loader2, MapPin, Building, Hash } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { checkout } = useOrders();
  const { cart } = useCart();
  const items = cart.data?.items || [];

  const [formData, setFormData] = useState({
    shipping_address: '',
    shipping_city: '',
    shipping_postal_code: '',
  });

  const [errors, setErrors] = useState({});

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const validate = () => {
    const newErrors = {};
    if (!formData.shipping_address.trim()) newErrors.shipping_address = 'آدرس الزامی است';
    if (!formData.shipping_city.trim()) newErrors.shipping_city = 'شهر الزامی است';
    if (!formData.shipping_postal_code.trim()) newErrors.shipping_postal_code = 'کد پستی الزامی است';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    checkout.mutate(formData, {
      onSuccess: (order) => {
        navigate(`/orders/${order.id}`);
      },
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-900 mb-2">سبد خرید شما خالی است</h2>
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors mt-4"
        >
          <ArrowRight size={18} />
          بازگشت به فروشگاه
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">تکمیل خرید</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
              <MapPin size={20} />
              آدرس تحویل
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  آدرس کامل
                </label>
                <textarea
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                    errors.shipping_address ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="خیابان، کوچه، پلاک، واحد..."
                />
                {errors.shipping_address && (
                  <p className="mt-1 text-sm text-red-500">{errors.shipping_address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                    <Building size={14} />
                    شهر
                  </label>
                  <input
                    type="text"
                    name="shipping_city"
                    value={formData.shipping_city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                      errors.shipping_city ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="مثلاً تهران"
                  />
                  {errors.shipping_city && (
                    <p className="mt-1 text-sm text-red-500">{errors.shipping_city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                    <Hash size={14} />
                    کد پستی
                  </label>
                  <input
                    type="text"
                    name="shipping_postal_code"
                    value={formData.shipping_postal_code}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                      errors.shipping_postal_code ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="1234567890"
                  />
                  {errors.shipping_postal_code && (
                    <p className="mt-1 text-sm text-red-500">{errors.shipping_postal_code}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={checkout.isPending}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 mt-6 flex items-center justify-center gap-2"
            >
              {checkout.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  در حال پردازش...
                </>
              ) : (
                'ثبت سفارش'
              )}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-gray-100 rounded-xl p-6 sticky top-6">
            <h2 className="font-bold text-lg mb-4">خلاصه سفارش</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × {new Intl.NumberFormat('fa-IR').format(item.product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">مجموع</span>
                <span>{new Intl.NumberFormat('fa-IR').format(total)} تومان</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">حمل و نقل</span>
                <span className="text-green-600">رایگان</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>قابل پرداخت</span>
                <span>{new Intl.NumberFormat('fa-IR').format(total)} تومان</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
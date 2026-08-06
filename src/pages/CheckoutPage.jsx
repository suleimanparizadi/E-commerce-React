import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { useCart } from '../hooks/useCart';
import { ArrowRight, Loader2, MapPin, Building, Hash, ShoppingBag, CreditCard, Truck, CheckCircle, ChevronLeft } from 'lucide-react';

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

  const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0), 0);

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
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
            <ShoppingBag size={40} className="text-blue-300" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#fbb710] flex items-center justify-center shadow-lg shadow-yellow-200">
            <span className="text-[#131212] text-xs font-bold">0</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#131212] mb-3">سبد خرید شما خالی است</h2>
        <p className="text-gray-400 mb-8">برای ادامه خرید، محصولات را به سبد اضافه کنید</p>
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 bg-[#131212] text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-gray-200 font-medium group"
        >
          <span>بازگشت به فروشگاه</span>
          <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-0 animate-fadeIn">
      {/* Header */}
      <div className="mb-10 relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#131212] mb-2 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#fbb710] flex items-center justify-center shadow-lg shadow-yellow-200">
                <CreditCard size={22} className="text-[#131212]" />
              </span>
              تکمیل خرید
            </h1>
            <p className="text-blue-500 mr-13 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse"></span>
              {items.length} محصول در سبد خرید
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-blue-400 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <Truck size={16} />
            <span>ارسال رایگان</span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#fbb710] to-transparent opacity-30"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-blue-100 p-8 shadow-lg shadow-blue-50 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                <MapPin size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-[#131212]">آدرس تحویل</h2>
              <span className="text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-medium mr-auto">
                مرحله ۱ از ۱
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#131212] mb-2">
                  آدرس کامل <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 bg-blue-50/50 rounded-xl border text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder:text-gray-400 ${
                    errors.shipping_address 
                      ? 'border-red-300 ring-2 ring-red-200' 
                      : 'border-blue-100 focus:border-blue-300'
                  }`}
                  placeholder="خیابان، کوچه، پلاک، واحد..."
                />
                {errors.shipping_address && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span>
                    {errors.shipping_address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#131212] mb-2">
                    شهر <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="shipping_city"
                      value={formData.shipping_city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-10 bg-blue-50/50 rounded-xl border text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder:text-gray-400 ${
                        errors.shipping_city 
                          ? 'border-red-300 ring-2 ring-red-200' 
                          : 'border-blue-100 focus:border-blue-300'
                      }`}
                      placeholder="مثلاً تهران"
                    />
                  </div>
                  {errors.shipping_city && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span>
                      {errors.shipping_city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#131212] mb-2">
                    کد پستی <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="shipping_postal_code"
                      value={formData.shipping_postal_code}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-10 bg-blue-50/50 rounded-xl border text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder:text-gray-400 ${
                        errors.shipping_postal_code 
                          ? 'border-red-300 ring-2 ring-red-200' 
                          : 'border-blue-100 focus:border-blue-300'
                      }`}
                      placeholder="۱۲۳۴۵۶۷۸۹۰"
                    />
                  </div>
                  {errors.shipping_postal_code && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span>
                      {errors.shipping_postal_code}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={checkout.isPending}
              className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-8 group"
            >
              {checkout.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  در حال پردازش...
                </>
              ) : (
                <>
                  <span>ثبت سفارش</span>
                  <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl border border-blue-100 p-6 sticky top-6 shadow-lg shadow-blue-50 hover:shadow-xl transition-shadow duration-300 animate-slideDown [animation-delay:200ms]">
            <h2 className="text-lg font-bold text-[#131212] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                <ShoppingBag size={16} className="text-white" />
              </span>
              خلاصه سفارش
            </h2>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-blue-50/50 rounded-xl hover:bg-blue-50 transition-colors">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-blue-50 shrink-0">
                    <img
                      src={item.product?.thumbnail}
                      alt={item.product?.name || ''}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#131212] truncate">{item.product?.name || 'محصول نامشخص'}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.quantity || 0} × {new Intl.NumberFormat('en-US').format(item.product?.price || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-6" />

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-xl">
                <span className="text-gray-500 text-sm">مجموع</span>
                <span className="font-bold text-[#131212]">
                  {new Intl.NumberFormat('en-US').format(total)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="text-gray-500 text-sm">حمل و نقل</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Truck size={14} />
                  رایگان
                </span>
              </div>
            </div>

            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-6" />

            <div className="flex justify-between items-center">
              <span className="font-bold text-[#131212] text-lg">قابل پرداخت</span>
              <span className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('en-US').format(total)}
              </span>
            </div>

            <button
              onClick={() => navigate('/cart')}
              className="w-full mt-4 text-sm text-blue-500 hover:text-blue-600 transition-all duration-300 hover:gap-2 flex items-center justify-center gap-1 group"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>بازگشت به سبد خرید</span>
            </button>
          </div>
        </div>
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
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { ArrowRight, Package, Calendar, MapPin, Hash, Loader2, ImageOff, ShoppingBag, CreditCard, Truck, CheckCircle, ChevronLeft } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const STATUS_LABELS = {
  pending: 'در انتظار',
  processing: 'در حال پردازش',
  shipped: 'ارسال شده',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده',
};

const STATUS_ICONS = {
  pending: Clock,
  processing: Loader2,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

// Import missing icons
import { Clock, XCircle } from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { useOrder } = useOrders();
  const { data: order, isLoading } = useOrder(Number(id));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Package size={20} className="text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="text-blue-600 font-medium animate-pulse">بارگذاری جزئیات سفارش...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <Package size={40} className="text-red-300" />
        </div>
        <h2 className="text-2xl font-bold text-[#131212] mb-3">سفارش یافت نشد</h2>
        <p className="text-gray-400 mb-6">سفارش مورد نظر موجود نمی‌باشد</p>
        <Link 
          to="/orders" 
          className="inline-flex items-center gap-2 bg-[#131212] text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-gray-200 font-medium group"
        >
          <span>بازگشت به سفارشات</span>
          <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  // Defensive: ensure items is always an array
  const items = Array.isArray(order.items) ? order.items : [];
  const status = order.status || 'pending';
  const totalAmount = order.total_amount || 0;
  const StatusIcon = STATUS_ICONS[status] || Package;

  return (
    <div className="px-4 lg:px-0 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/orders" className="hover:text-blue-600 transition-colors font-medium">
          سفارشات
        </Link>
        <ChevronLeft size={14} className="text-gray-300" />
        <span className="text-[#131212] font-bold">سفارش #{order.id || '—'}</span>
      </div>

      {/* Header */}
      <div className="mb-10 relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#131212] mb-2 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Package size={22} className="text-white" />
              </span>
              جزئیات سفارش
            </h1>
            <p className="text-blue-500 mr-13 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse"></span>
              سفارش #{order.id || '—'} • {order.created_at ? new Date(order.created_at).toLocaleDateString('fa-IR') : '—'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border
              ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600 border-gray-200'}
              shadow-sm
            `}>
              <StatusIcon size={16} className={status === 'processing' ? 'animate-spin' : ''} />
              {STATUS_LABELS[status] || status}
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-30"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order info */}
        <div className="flex-1 space-y-6">
          {/* Status card */}
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-lg shadow-blue-50 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                  <ShoppingBag size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-[#131212] text-lg">سفارش #{order.id || '—'}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString('fa-IR')
                        : '—'
                      }
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="flex items-center gap-1">
                      <Package size={14} />
                      {items.length} کالا
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-lg shadow-blue-50 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-lg font-bold text-[#131212] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                <Package size={16} className="text-white" />
              </span>
              کالاها
            </h2>
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item, idx) => {
                  const product = item?.product || {};
                  const quantity = item?.quantity || 0;
                  const priceAtPurchase = item?.price_at_purchase || 0;
                  const originalPrice = product?.price || 0;

                  return (
                    <div 
                      key={idx} 
                      className={`
                        flex gap-4 pb-4 border-b border-blue-50 last:border-0 last:pb-0
                        hover:bg-blue-50/30 rounded-xl p-3 -mx-3 transition-all duration-200
                        ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/10'}
                      `}
                    >
                      <Link 
                        to={product.slug ? `/products/${product.slug}` : '#'} 
                        className="shrink-0"
                      >
                        {product.thumbnail ? (
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-blue-50 shadow-sm hover:shadow-md transition-shadow">
                            <img
                              src={product.thumbnail}
                              alt={product.name || ''}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => { 
                                e.target.style.display = 'none';
                                e.target.parentElement.nextSibling.style.display = 'flex';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-xl bg-gray-50 flex items-center justify-center border border-blue-50">
                            <ImageOff size={24} className="text-gray-300" />
                          </div>
                        )}
                      </Link>
                      <div className="flex-1">
                        <Link
                          to={product.slug ? `/products/${product.slug}` : '#'}
                          className="text-base font-bold text-[#131212] hover:text-blue-600 transition-colors"
                        >
                          {product.name || 'محصول نامشخص'}
                        </Link>
                        {product.brand && (
                          <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-gray-300 inline-block"></span>
                            {product.brand}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm text-gray-400 flex items-center gap-1">
                            <span className="font-medium text-[#131212]">{quantity}</span>
                            عدد
                          </span>
                          <div className="text-left">
                            {originalPrice > priceAtPurchase && (
                              <p className="text-sm text-gray-400 line-through">
                                {new Intl.NumberFormat('fa-IR').format(originalPrice)} تومان
                              </p>
                            )}
                            <p className="text-xl font-bold text-blue-600">
                              {new Intl.NumberFormat('fa-IR').format(priceAtPurchase)} تومان
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400">کالایی در این سفارش وجود ندارد</p>
              </div>
            )}
          </div>

          {/* Shipping info */}
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-lg shadow-blue-50 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-lg font-bold text-[#131212] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#fbb710] flex items-center justify-center shadow-md shadow-yellow-200">
                <MapPin size={16} className="text-[#131212]" />
              </span>
              آدرس تحویل
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-4 p-3 bg-blue-50/50 rounded-xl">
                <MapPin size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">آدرس</p>
                  <p className="text-[#131212] font-medium">{order.shipping_address || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 bg-blue-50/50 rounded-xl">
                <Hash size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">کد پستی</p>
                  <p className="text-[#131212] font-medium">{order.shipping_postal_code || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 bg-blue-50/50 rounded-xl">
                <MapPin size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">شهر</p>
                  <p className="text-[#131212] font-medium">{order.shipping_city || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl border border-blue-100 p-6 sticky top-6 shadow-lg shadow-blue-50 hover:shadow-xl transition-shadow duration-300 animate-slideDown [animation-delay:200ms]">
            <h2 className="text-lg font-bold text-[#131212] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                <CreditCard size={16} className="text-white" />
              </span>
              خلاصه فاکتور
            </h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-xl">
                <span className="text-gray-500">تعداد کالا</span>
                <span className="font-bold text-[#131212]">
                  {items.reduce((sum, i) => sum + (i?.quantity || 0), 0)} عدد
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-xl">
                <span className="text-gray-500">مجموع</span>
                <span className="font-bold text-[#131212]">
                  {new Intl.NumberFormat('fa-IR').format(
                    items.reduce((sum, i) => sum + (i?.price_at_purchase || 0) * (i?.quantity || 0), 0)
                  )} تومان
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <span className="text-gray-500">حمل و نقل</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Truck size={14} />
                  رایگان
                </span>
              </div>
            </div>

            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-6" />

            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-[#131212]">مبلغ پرداخت شده</span>
              <span className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('fa-IR').format(totalAmount)} تومان
              </span>
            </div>

            <Link
              to="/orders"
              className="block text-center mt-6 text-sm text-blue-500 hover:text-blue-600 transition-all duration-300 hover:gap-2 flex items-center justify-center gap-1 group"
            >
              <ArrowRight size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>بازگشت به لیست سفارشات</span>
            </Link>
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
import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { Package, ArrowRight, Loader2, Calendar, MapPin, ImageOff, ShoppingBag, ChevronLeft, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

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

export default function OrdersPage() {
  const { orders } = useOrders();

  if (orders.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag size={20} className="text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="text-blue-600 font-medium animate-pulse">بارگذاری سفارشات...</p>
      </div>
    );
  }

  const orderList = orders.data || [];

  if (orderList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
            <Package size={40} className="text-blue-300" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#fbb710] flex items-center justify-center shadow-lg shadow-yellow-200">
            <span className="text-[#131212] text-xs font-bold">0</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#131212] mb-3">سفارشی ثبت نشده</h2>
        <p className="text-gray-400 mb-8">اولین سفارش خود را ثبت کنید</p>
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
    <div className="px-4 lg:px-0 animate-fadeIn">
      {/* Header */}
      <div className="mb-10 relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#131212] mb-2 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <ShoppingBag size={22} className="text-white" />
              </span>
              سفارشات من
            </h1>
            <p className="text-blue-500 mr-13 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse"></span>
              {orderList.length} سفارش ثبت شده
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-blue-400 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <Package size={16} />
            <span>آخرین سفارش: {orderList[0]?.created_at ? new Date(orderList[0].created_at).toLocaleDateString('fa-IR') : '—'}</span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-30"></div>
      </div>

      <div className="space-y-4">
        {orderList.map((order, index) => {
          const items = Array.isArray(order.items) ? order.items : [];
          const status = order.status || 'pending';
          const StatusIcon = STATUS_ICONS[status] || Package;
          const isProcessing = status === 'processing';
          
          return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className={`
                block bg-white rounded-2xl border border-blue-100 p-6 
                hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 
                transition-all duration-300 group
                ${index === 0 ? 'animate-slideDown [animation-delay:0ms]' : ''}
                ${index === 1 ? 'animate-slideDown [animation-delay:100ms]' : ''}
                ${index === 2 ? 'animate-slideDown [animation-delay:200ms]' : ''}
                ${index >= 3 ? 'animate-slideDown [animation-delay:300ms]' : ''}
              `}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
                    <Package size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-[#131212] text-lg group-hover:text-blue-600 transition-colors">
                      سفارش #{order.id}
                    </p>
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

                <div className="flex items-center gap-4">
                  <span className={`
                    inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border
                    ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600 border-gray-200'}
                    shadow-sm
                  `}>
                    <StatusIcon size={14} className={isProcessing ? 'animate-spin' : ''} />
                    {STATUS_LABELS[status] || status}
                  </span>
                  <span className="text-xl font-bold text-blue-600">
                    {order.total_amount 
                      ? `${new Intl.NumberFormat('en-US').format(order.total_amount)}`
                      : '—'
                    }
                  </span>
                </div>
              </div>

              {/* Shipping info */}
              <div className="flex items-center gap-2 text-sm text-gray-400 border-t border-blue-50 pt-4 mt-4">
                <MapPin size={14} className="text-blue-400" />
                <span className="text-[#131212]">
                  {order.shipping_city || '—'} — {order.shipping_address || '—'}
                </span>
              </div>

              {/* Product thumbnails */}
              {items.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {items.slice(0, 4).map((item, idx) => (
                    <div 
                      key={idx} 
                      className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-blue-50 shadow-sm group-hover:shadow-md transition-shadow"
                    >
                      {item.product?.thumbnail ? (
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.name || ''}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { 
                            e.target.style.display = 'none';
                            e.target.parentElement.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageOff size={16} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                  ))}
                  {items.length > 4 && (
                    <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600 border border-blue-100">
                      +{items.length - 4}
                    </div>
                  )}
                </div>
              )}

              {/* View details indicator */}
              <div className="flex items-center justify-end mt-4 pt-4 border-t border-blue-50">
                <span className="text-sm text-blue-500 group-hover:text-blue-600 transition-colors flex items-center gap-1 group-hover:gap-2">
                  مشاهده جزئیات
                  <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          );
        })}
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
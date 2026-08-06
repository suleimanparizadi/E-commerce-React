import { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
  ShoppingBag,
  Loader2,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  User,
  Calendar,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
} from 'lucide-react';

const STATUS_LABELS = {
  PENDING: 'در انتظار',
  CONFIRMED: 'تأیید شده',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل داده شده',
  CANCELED: 'لغو شده',
};

const STATUS_COLORS = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  SHIPPED: 'bg-purple-100 text-purple-700 border-purple-200',
  DELIVERED: 'bg-green-100 text-green-700 border-green-200',
  CANCELED: 'bg-red-100 text-red-700 border-red-200',
};

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'در انتظار' },
  { value: 'CONFIRMED', label: 'تأیید شده' },
  { value: 'SHIPPED', label: 'ارسال شده' },
  { value: 'DELIVERED', label: 'تحویل داده شده' },
  { value: 'CANCELED', label: 'لغو شده' },
];

const STATUS_ICONS = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  SHIPPED: Truck,
  DELIVERED: Package,
  CANCELED: XCircle,
};

export default function AdminOrdersPage() {
  const { orders, changeOrderStatus } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);

  const isLoading = orders.isLoading;
  const orderList = orders.data || [];

  // Filter by search (order ID, city, or user phone)
  const filteredOrders = searchQuery.trim()
    ? orderList.filter((o) =>
        String(o.id).includes(searchQuery) ||
        o.shipping_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.user?.phone_number?.includes(searchQuery)
      )
    : orderList;

  // Calculate stats
  const totalOrders = orderList.length;
  const pendingOrders = orderList.filter(o => o.status === 'PENDING').length;
  const deliveredOrders = orderList.filter(o => o.status === 'DELIVERED').length;
  const totalRevenue = orderList.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const handleStatusChange = (orderId, newStatus) => {
    setStatusLoading(orderId);
    changeOrderStatus.mutate(
      { orderId, status: newStatus },
      {
        onSettled: () => setStatusLoading(null),
      }
    );
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Quick stats cards
  const stats = [
    {
      label: 'کل سفارش‌ها',
      value: totalOrders,
      icon: ShoppingBag,
      bgColor: 'bg-blue-600',
      iconBg: 'bg-blue-500',
      shadow: 'shadow-blue-200',
    },
    {
      label: 'سفارش‌های در انتظار',
      value: pendingOrders,
      icon: Clock,
      bgColor: 'bg-[#fbb710]',
      iconBg: 'bg-[#e5a50f]',
      shadow: 'shadow-yellow-200',
      textColor: 'text-[#131212]',
    },
    {
      label: 'سفارش‌های تحویل‌شده',
      value: deliveredOrders,
      icon: CheckCircle,
      bgColor: 'bg-green-600',
      iconBg: 'bg-green-500',
      shadow: 'shadow-green-200',
      textColor: 'text-white',
    },
    {
      label: 'درآمد کل',
      value: totalRevenue,
      icon: TrendingUp,
      bgColor: 'bg-[#131212]',
      iconBg: 'bg-gray-700',
      shadow: 'shadow-gray-200',
      textColor: 'text-white',
      formatter: (val) => `${new Intl.NumberFormat('fa-IR').format(val)} تومان`,
    },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header with gradient underline */}
      <div className="mb-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#131212] mb-1 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <ShoppingBag size={22} className="text-white" />
              </span>
              مدیریت سفارش‌ها
            </h1>
            <p className="text-blue-500 text-sm mr-13">مشاهده و تغییر وضعیت سفارشات مشتریان</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-blue-400 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <Package size={16} />
            <span>{totalOrders} سفارش ثبت شده</span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-30"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isYellow = stat.bgColor === 'bg-[#fbb710]';
          return (
            <div
              key={stat.label}
              className={`
                ${stat.bgColor} rounded-2xl p-4 shadow-lg ${stat.shadow} 
                hover:shadow-xl hover:-translate-y-1 
                transition-all duration-300 group relative overflow-hidden
                animate-slideDown
                ${index === 0 ? '[animation-delay:0ms]' : ''}
                ${index === 1 ? '[animation-delay:100ms]' : ''}
                ${index === 2 ? '[animation-delay:200ms]' : ''}
                ${index === 3 ? '[animation-delay:300ms]' : ''}
              `}
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-xl ${stat.iconBg} 
                  flex items-center justify-center shadow-md
                  group-hover:scale-110 group-hover:rotate-6 
                  transition-all duration-300
                `}>
                  <Icon size={18} className={isYellow ? 'text-[#131212]' : 'text-white'} />
                </div>
                <div>
                  <p className={`text-sm ${isYellow ? 'text-[#131212]/70' : 'text-white/70'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-xl font-bold ${isYellow ? 'text-[#131212]' : 'text-white'}`}>
                    {stat.formatter ? stat.formatter(stat.value) : stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg shadow-blue-50 border border-blue-100 p-4 mb-6 hover:shadow-xl transition-shadow duration-300 animate-slideDown [animation-delay:400ms]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="جستجو بر اساس شماره سفارش، شهر یا شماره موبایل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pr-10 pl-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <TrendingUp size={16} />
            <span>{filteredOrders.length} سفارش یافت شد</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg shadow-blue-50 border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-slideDown [animation-delay:500ms]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShoppingBag size={20} className="text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-blue-600 font-medium animate-pulse">بارگذاری سفارش‌ها...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={40} className="text-blue-300" />
            </div>
            <p className="text-gray-400 font-medium">سفارشی یافت نشد</p>
            <p className="text-sm text-gray-300 mt-1">
              {searchQuery ? 'با جستجوی دیگری امتحان کنید' : 'هنوز سفارشی ثبت نشده است'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-blue-50/30">
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">شماره</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">مبلغ</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">وضعیت</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">شهر</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">تاریخ</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">جزئیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {filteredOrders.map((order, index) => {
                  const isExpanded = expandedOrder === order.id;
                  const status = order.status || 'PENDING';
                  const StatusIcon = STATUS_ICONS[status] || Clock;

                  return (
                    <>
                      <tr
                        key={order.id}
                        className={`
                          hover:bg-blue-50/30 transition-all duration-200 group cursor-pointer
                          ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/5'}
                        `}
                        onClick={() => toggleExpand(order.id)}
                      >
                        <td className="px-6 py-4 text-sm font-bold text-[#131212] group-hover:text-blue-600 transition-colors">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {order.total_amount
                            ? `${new Intl.NumberFormat('fa-IR').format(order.total_amount)} تومان`
                            : '—'
                          }
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="relative inline-flex items-center gap-2">
                            <StatusIcon size={14} className={`${status === 'PENDING' ? 'text-amber-500' : status === 'DELIVERED' ? 'text-green-500' : status === 'CANCELED' ? 'text-red-500' : 'text-blue-500'}`} />
                            <select
                              value={status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              disabled={statusLoading === order.id}
                              className={`
                                appearance-none pl-8 pr-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1
                                ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600 border-gray-200'}
                                ${statusLoading === order.id ? 'opacity-60 cursor-not-allowed' : ''}
                                transition-all duration-300 hover:scale-105
                              `}
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            {statusLoading === order.id && (
                              <Loader2 size={12} className="absolute left-2 top-1/2 -translate-y-1/2 animate-spin" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                            <MapPin size={14} className="text-blue-400" />
                            {order.shipping_city || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString('fa-IR')
                            : '—'
                          }
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            className={`
                              p-2 rounded-lg transition-all duration-300
                              ${isExpanded 
                                ? 'text-blue-600 bg-blue-50 scale-110' 
                                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:scale-110'
                              }
                            `}
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="px-6 py-5 bg-gradient-to-r from-blue-50/30 to-blue-50/10 border-b border-blue-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Order Info */}
                              <div className="space-y-3">
                                <h4 className="text-sm font-bold text-[#131212] mb-3 flex items-center gap-2">
                                  <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                                  اطلاعات سفارش
                                </h4>
                                
                                <div className="flex items-center gap-3 text-sm bg-white/60 p-2.5 rounded-lg border border-blue-50">
                                  <CreditCard size={16} className="text-blue-400" />
                                  <span className="text-gray-500">مبلغ کل:</span>
                                  <span className="font-bold text-[#131212]">
                                    {order.total_amount
                                      ? `${new Intl.NumberFormat('fa-IR').format(order.total_amount)} تومان`
                                      : '—'
                                    }
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm bg-white/60 p-2.5 rounded-lg border border-blue-50">
                                  <Calendar size={16} className="text-blue-400" />
                                  <span className="text-gray-500">تاریخ:</span>
                                  <span className="font-bold text-[#131212]">
                                    {order.created_at
                                      ? new Date(order.created_at).toLocaleDateString('fa-IR')
                                      : '—'
                                    }
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm bg-white/60 p-2.5 rounded-lg border border-blue-50">
                                  <MapPin size={16} className="text-blue-400" />
                                  <span className="text-gray-500">آدرس:</span>
                                  <span className="font-bold text-[#131212]">{order.shipping_address || '—'}</span>
                                </div>

                                <div className="flex items-center gap-3 text-sm bg-white/60 p-2.5 rounded-lg border border-blue-50">
                                  <MapPin size={16} className="text-blue-400" />
                                  <span className="text-gray-500">کد پستی:</span>
                                  <span className="font-bold text-[#131212]">{order.shipping_postal_code || '—'}</span>
                                </div>
                              </div>

                              {/* User Info */}
                              <div className="space-y-3">
                                <h4 className="text-sm font-bold text-[#131212] mb-3 flex items-center gap-2">
                                  <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                                  اطلاعات مشتری
                                </h4>
                                
                                <div className="flex items-center gap-3 text-sm bg-white/60 p-2.5 rounded-lg border border-blue-50">
                                  <User size={16} className="text-blue-400" />
                                  <span className="text-gray-500">نام:</span>
                                  <span className="font-bold text-[#131212]">
                                    {order.user?.first_name} {order.user?.last_name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm bg-white/60 p-2.5 rounded-lg border border-blue-50">
                                  <Phone size={16} className="text-blue-400" />
                                  <span className="text-gray-500">موبایل:</span>
                                  <span className="font-bold text-[#131212]">{order.user?.phone_number || '—'}</span>
                                </div>
                              </div>

                              {/* Order Items */}
                              {order.items && order.items.length > 0 && (
                                <div className="md:col-span-2">
                                  <h4 className="text-sm font-bold text-[#131212] mb-3 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                                    محصولات سفارش
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                      {order.items.length} مورد
                                    </span>
                                  </h4>
                                  <div className="bg-white rounded-xl border border-blue-100 overflow-hidden shadow-sm">
                                    <table className="w-full">
                                      <thead>
                                        <tr className="bg-gradient-to-r from-blue-50 to-blue-50/30">
                                          <th className="text-right px-4 py-2.5 text-xs font-bold text-blue-700">محصول</th>
                                          <th className="text-right px-4 py-2.5 text-xs font-bold text-blue-700">تعداد</th>
                                          <th className="text-right px-4 py-2.5 text-xs font-bold text-blue-700">قیمت واحد</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-blue-50">
                                        {order.items.map((item, idx) => (
                                          <tr key={idx} className="hover:bg-blue-50/20 transition-colors">
                                            <td className="px-4 py-2.5 text-sm font-medium text-[#131212]">
                                              {item.product?.name || '—'}
                                            </td>
                                            <td className="px-4 py-2.5 text-sm text-gray-600 font-medium">
                                              {item.quantity?.toLocaleString('fa-IR') || '—'}
                                            </td>
                                            <td className="px-4 py-2.5 text-sm text-gray-600">
                                              {item.price_at_purchase
                                                ? `${new Intl.NumberFormat('fa-IR').format(item.price_at_purchase)} تومان`
                                                : '—'
                                              }
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
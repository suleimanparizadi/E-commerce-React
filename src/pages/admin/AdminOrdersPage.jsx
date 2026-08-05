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
        o.shipping_city?.includes(searchQuery) ||
        o.user?.phone_number?.includes(searchQuery)
      )
    : orderList;

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

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#131212] mb-1">مدیریت سفارش‌ها</h1>
          <p className="text-gray-500 text-sm">مشاهده و تغییر وضعیت سفارشات مشتریان</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="جستجو بر اساس شماره سفارش، شهر یا شماره موبایل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pr-10 pl-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#131212]" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <ShoppingBag size={48} className="mx-auto mb-3 opacity-30" />
            <p>سفارشی یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">شماره</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">مبلغ</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">شهر</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">تاریخ</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">جزئیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  const status = order.status || 'PENDING';

                  return (
                    <>
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleExpand(order.id)}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-[#131212]">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.total_amount
                            ? `${new Intl.NumberFormat('fa-IR').format(order.total_amount)} تومان`
                            : '—'
                          }
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="relative">
                            <select
                              value={status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              disabled={statusLoading === order.id}
                              className={`
                                appearance-none pl-8 pr-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1
                                ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600 border-gray-200'}
                                ${statusLoading === order.id ? 'opacity-60 cursor-not-allowed' : ''}
                              `}
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            {statusLoading === order.id && (
                              <Loader2 size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 animate-spin" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.shipping_city || '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString('fa-IR')
                            : '—'
                          }
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-1.5 text-gray-400 hover:text-[#131212] rounded-lg transition-colors">
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="px-6 py-5 bg-gray-50 border-b border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Order Info */}
                              <div className="space-y-3">
                                <h4 className="text-sm font-bold text-[#131212] mb-3">اطلاعات سفارش</h4>
                                
                                <div className="flex items-center gap-3 text-sm">
                                  <CreditCard size={16} className="text-gray-400" />
                                  <span className="text-gray-500">مبلغ کل:</span>
                                  <span className="font-medium text-[#131212]">
                                    {order.total_amount
                                      ? `${new Intl.NumberFormat('fa-IR').format(order.total_amount)} تومان`
                                      : '—'
                                    }
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                  <Calendar size={16} className="text-gray-400" />
                                  <span className="text-gray-500">تاریخ:</span>
                                  <span className="font-medium text-[#131212]">
                                    {order.created_at
                                      ? new Date(order.created_at).toLocaleDateString('fa-IR')
                                      : '—'
                                    }
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                  <MapPin size={16} className="text-gray-400" />
                                  <span className="text-gray-500">آدرس:</span>
                                  <span className="font-medium text-[#131212]">{order.shipping_address || '—'}</span>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                  <MapPin size={16} className="text-gray-400" />
                                  <span className="text-gray-500">کد پستی:</span>
                                  <span className="font-medium text-[#131212]">{order.shipping_postal_code || '—'}</span>
                                </div>
                              </div>

                              {/* User Info */}
                              <div className="space-y-3">
                                <h4 className="text-sm font-bold text-[#131212] mb-3">اطلاعات مشتری</h4>
                                
                                <div className="flex items-center gap-3 text-sm">
                                  <User size={16} className="text-gray-400" />
                                  <span className="text-gray-500">نام:</span>
                                  <span className="font-medium text-[#131212]">
                                    {order.user?.first_name} {order.user?.last_name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                  <Phone size={16} className="text-gray-400" />
                                  <span className="text-gray-500">موبایل:</span>
                                  <span className="font-medium text-[#131212]">{order.user?.phone_number || '—'}</span>
                                </div>
                              </div>

                              {/* Order Items */}
                              {order.items && order.items.length > 0 && (
                                <div className="md:col-span-2">
                                  <h4 className="text-sm font-bold text-[#131212] mb-3">محصولات سفارش</h4>
                                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <table className="w-full">
                                      <thead>
                                        <tr className="bg-gray-50">
                                          <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500">محصول</th>
                                          <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500">تعداد</th>
                                          <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-500">قیمت واحد</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100">
                                        {order.items.map((item, idx) => (
                                          <tr key={idx}>
                                            <td className="px-4 py-2.5 text-sm text-[#131212]">
                                              {item.product?.name || '—'}
                                            </td>
                                            <td className="px-4 py-2.5 text-sm text-gray-600">
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
    </div>
  );
}
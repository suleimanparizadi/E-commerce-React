import { useAdmin } from '../../hooks/useAdmin';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Clock,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

const STATUS_LABELS = {
  PENDING: 'در انتظار',
  CONFIRMED: 'تأیید شده',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل داده شده',
  CANCELED: 'لغو شده',
};

const STATUS_COLORS = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELED: 'bg-red-100 text-red-700',
};

export default function AdminDashboardPage() {
  const { products, orders, users } = useAdmin();

  const isLoading = products.isLoading || orders.isLoading || users.isLoading;

  const productCount = products.data?.length || 0;
  const orderCount = orders.data?.length || 0;
  const userCount = users.data?.length || 0;
  const recentOrders = (orders.data || []).slice(0, 5);

  const stats = [
    {
      label: 'محصولات',
      value: productCount,
      icon: Package,
      color: 'bg-[#131212]',
      link: '/admin/products',
    },
    {
      label: 'سفارش‌ها',
      value: orderCount,
      icon: ShoppingBag,
      color: 'bg-gray-700',
      link: '/admin/orders',
    },
    {
      label: 'کاربران',
      value: userCount,
      icon: Users,
      color: 'bg-gray-600',
      link: '/admin/users',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 size={40} className="animate-spin text-[#131212]" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[#131212] mb-2">داشبورد مدیریت</h1>
        <p className="text-gray-500">نمای کلی فروشگاه و آمارها</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon size={22} className="text-white" />
                </div>
                <TrendingUp size={18} className="text-gray-300 group-hover:text-[#131212] transition-colors" />
              </div>
              <p className="text-3xl font-bold text-[#131212] mb-1">
                {stat.value.toLocaleString('fa-IR')}
              </p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-[#131212]" />
            <h2 className="text-lg font-bold text-[#131212]">سفارش‌های اخیر</h2>
          </div>
          <Link
            to="/admin/orders"
            className="text-sm text-gray-500 hover:text-[#131212] flex items-center gap-1 transition-colors"
          >
            مشاهده همه
            <ArrowLeft size={14} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
            <p>سفارشی یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">شماره سفارش</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">مبلغ</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">تاریخ</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">شهر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => {
                  const status = order.status || 'PENDING';
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-[#131212]">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.total_amount
                          ? `${new Intl.NumberFormat('fa-IR').format(order.total_amount)} تومان`
                          : '—'
                        }
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_LABELS[status] || status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString('fa-IR')
                          : '—'
                        }
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.shipping_city || '—'}
                      </td>
                    </tr>
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
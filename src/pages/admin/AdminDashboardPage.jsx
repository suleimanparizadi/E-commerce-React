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
  ChevronRight,
  Activity,
  BarChart3,
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

export default function AdminDashboardPage() {
  const { products, orders, users } = useAdmin();

  const isLoading = products.isLoading || orders.isLoading || users.isLoading;

  const productCount = products.data?.length || 0;
  const orderCount = orders.data?.length || 0;
  const userCount = users.data?.length || 0;
  const recentOrders = (orders.data || []).slice(0, 5);

  // Calculate some stats
  const totalRevenue = orders.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
  const pendingOrders = orders.data?.filter(o => o.status === 'PENDING').length || 0;

  const stats = [
    {
      label: 'محصولات',
      value: productCount,
      icon: Package,
      bgColor: 'bg-blue-600',
      iconBg: 'bg-blue-500',
      shadow: 'shadow-blue-200',
      hoverBg: 'hover:bg-blue-700',
      link: '/admin/products',
    },
    {
      label: 'سفارش‌ها',
      value: orderCount,
      icon: ShoppingBag,
      bgColor: 'bg-[#fbb710]',
      iconBg: 'bg-[#e5a50f]',
      shadow: 'shadow-yellow-200',
      textColor: 'text-[#131212]',
      hoverBg: 'hover:bg-[#e5a50f]',
      link: '/admin/orders',
    },
    {
      label: 'کاربران',
      value: userCount,
      icon: Users,
      bgColor: 'bg-[#131212]',
      iconBg: 'bg-gray-700',
      shadow: 'shadow-gray-200',
      hoverBg: 'hover:bg-gray-800',
      link: '/admin/users',
    },
  ];

  // Additional stat cards for revenue and pending
  const extraStats = [
    {
      label: 'درآمد کل',
      value: totalRevenue,
      icon: TrendingUp,
      bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-400',
      shadow: 'shadow-emerald-200',
      textColor: 'text-white',
      formatter: (val) => `${new Intl.NumberFormat('fa-IR').format(val)} تومان`,
    },
    {
      label: 'سفارش‌های در انتظار',
      value: pendingOrders,
      icon: Clock,
      bgColor: 'bg-gradient-to-br from-amber-500 to-amber-600',
      iconBg: 'bg-amber-400',
      shadow: 'shadow-amber-200',
      textColor: 'text-white',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Package size={20} className="text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="text-blue-600 font-medium animate-pulse">بارگذاری اطلاعات...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header with gradient underline */}
      <div className="mb-10 relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#131212] mb-2 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Activity size={22} className="text-white" />
              </span>
              داشبورد مدیریت
            </h1>
            <p className="text-blue-500 mr-13 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse"></span>
              نمای کلی فروشگاه و آمارها
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-blue-400 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <BarChart3 size={16} />
            <span>آخرین بروزرسانی: امروز</span>
          </div>
        </div>
        {/* Animated gradient underline */}
        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-30"></div>
      </div>

      {/* Stats Cards - Main Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isYellow = stat.bgColor === 'bg-[#fbb710]';
          return (
            <Link
              key={stat.label}
              to={stat.link || '#'}
              className={`
                ${stat.bgColor} rounded-2xl p-6 shadow-lg ${stat.shadow} 
                ${stat.hoverBg} hover:shadow-xl hover:-translate-y-2 
                transition-all duration-300 group relative overflow-hidden
                ${index === 0 ? 'animate-slideDown [animation-delay:0ms]' : ''}
                ${index === 1 ? 'animate-slideDown [animation-delay:100ms]' : ''}
                ${index === 2 ? 'animate-slideDown [animation-delay:200ms]' : ''}
              `}
            >
              {/* Animated background pattern */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`
                    w-12 h-12 rounded-xl ${stat.iconBg} 
                    flex items-center justify-center shadow-md
                    group-hover:scale-110 group-hover:rotate-6 
                    transition-all duration-300
                  `}>
                    <Icon size={22} className={isYellow ? 'text-[#131212]' : 'text-white'} />
                  </div>
                  <div className="flex items-center gap-1 opacity-30 group-hover:opacity-100 transition-opacity">
                    <TrendingUp size={18} className={isYellow ? 'text-[#131212]' : 'text-white'} />
                  </div>
                </div>
                <p className={`text-3xl font-bold mb-1 ${isYellow ? 'text-[#131212]' : 'text-white'} group-hover:scale-105 transition-transform origin-right`}>
                  {stat.value.toLocaleString('fa-IR')}
                </p>
                <p className={`text-sm ${isYellow ? 'text-[#131212]/70' : 'text-white/70'}`}>
                  {stat.label}
                </p>
                {/* Hover arrow indicator */}
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                  <ChevronRight size={16} className={isYellow ? 'text-[#131212]/40' : 'text-white/40'} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stats Cards - Extra Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {extraStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`
                ${stat.bgColor} rounded-2xl p-6 shadow-lg ${stat.shadow} 
                hover:shadow-xl hover:-translate-y-1 
                transition-all duration-300 group relative overflow-hidden
                ${index === 0 ? 'animate-slideDown [animation-delay:300ms]' : ''}
                ${index === 1 ? 'animate-slideDown [animation-delay:400ms]' : ''}
              `}
            >
              {/* Animated background pattern */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-xl ${stat.iconBg} 
                    flex items-center justify-center shadow-md
                    group-hover:scale-110 group-hover:rotate-6 
                    transition-all duration-300
                  `}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white group-hover:scale-105 transition-transform origin-right">
                      {stat.formatter ? stat.formatter(stat.value) : stat.value.toLocaleString('fa-IR')}
                    </p>
                  </div>
                </div>
                {/* Pulse indicator for pending orders */}
                {stat.label === 'سفارش‌های در انتظار' && stat.value > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-lg shadow-blue-50 border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-slideDown [animation-delay:500ms]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-blue-50 bg-gradient-to-r from-blue-50/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Clock size={20} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-[#131212]">سفارش‌های اخیر</h2>
            {recentOrders.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                {recentOrders.length} سفارش
              </span>
            )}
          </div>
          <Link
            to="/admin/orders"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all duration-300 font-medium hover:gap-2 group"
          >
            مشاهده همه
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">سفارشی یافت نشد</p>
            <p className="text-sm text-gray-300 mt-1">هیچ سفارشی برای نمایش وجود ندارد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-blue-50/30">
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">شماره سفارش</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">مبلغ</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">وضعیت</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">تاریخ</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">شهر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {recentOrders.map((order, index) => {
                  const status = order.status || 'PENDING';
                  return (
                    <tr 
                      key={order.id} 
                      className={`
                        hover:bg-blue-50/30 transition-all duration-200 group
                        ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/10'}
                      `}
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
                      <td className="px-6 py-4">
                        <span className={`
                          inline-flex px-3 py-1 rounded-full text-xs font-medium border 
                          ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600 border-gray-200'}
                          transition-all duration-300 hover:scale-105 hover:shadow-md
                        `}>
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
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block"></span>
                          {order.shipping_city || '—'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
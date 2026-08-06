import { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
  Users,
  Loader2,
  Search,
  UserCheck,
  UserX,
  Shield,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  UserPlus,
  Activity,
  ChevronLeft,
} from 'lucide-react';

export default function AdminUsersPage() {
  const { users, toggleUserActive } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [toggleLoading, setToggleLoading] = useState(null);

  const isLoading = users.isLoading;
  const userList = users.data || [];

  // Filter by search (name, phone, or email)
  const filteredUsers = searchQuery.trim()
    ? userList.filter((u) =>
        u.first_name?.includes(searchQuery) ||
        u.last_name?.includes(searchQuery) ||
        u.phone_number?.includes(searchQuery) ||
        u.email?.includes(searchQuery)
      )
    : userList;

  // Calculate stats
  const totalUsers = userList.length;
  const activeUsers = userList.filter(u => u.is_active).length;
  const adminUsers = userList.filter(u => u.is_admin).length;

  const handleToggle = (userId) => {
    setToggleLoading(userId);
    toggleUserActive.mutate(userId, {
      onSettled: () => setToggleLoading(null),
    });
  };

  // Quick stats cards
  const stats = [
    {
      label: 'کل کاربران',
      value: totalUsers,
      icon: Users,
      bgColor: 'bg-blue-600',
      iconBg: 'bg-blue-500',
      shadow: 'shadow-blue-200',
    },
    {
      label: 'کاربران فعال',
      value: activeUsers,
      icon: UserCheck,
      bgColor: 'bg-[#fbb710]',
      iconBg: 'bg-[#e5a50f]',
      shadow: 'shadow-yellow-200',
      textColor: 'text-[#131212]',
    },
    {
      label: 'مدیران',
      value: adminUsers,
      icon: Shield,
      bgColor: 'bg-[#131212]',
      iconBg: 'bg-gray-700',
      shadow: 'shadow-gray-200',
      textColor: 'text-white',
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
                <Users size={22} className="text-white" />
              </span>
              مدیریت کاربران
            </h1>
            <p className="text-blue-500 text-sm mr-13">مشاهده و مدیریت کاربران فروشگاه</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-blue-400 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <Activity size={16} />
            <span>{totalUsers} کاربر ثبت‌نام شده</span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-30"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg shadow-blue-50 border border-blue-100 p-4 mb-6 hover:shadow-xl transition-shadow duration-300 animate-slideDown [animation-delay:300ms]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              type="text"
              placeholder="جستجو بر اساس نام، نام خانوادگی، شماره موبایل یا ایمیل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pr-10 pl-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all hover:bg-blue-50"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <UserPlus size={16} />
            <span>{filteredUsers.length} کاربر یافت شد</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg shadow-blue-50 border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-slideDown [animation-delay:400ms]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users size={20} className="text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-blue-600 font-medium animate-pulse">بارگذاری کاربران...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Users size={40} className="text-blue-300" />
            </div>
            <p className="text-gray-400 font-medium">کاربری یافت نشد</p>
            <p className="text-sm text-gray-300 mt-1">
              {searchQuery ? 'با جستجوی دیگری امتحان کنید' : 'هنوز کاربری ثبت‌نام نکرده است'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-blue-50/30">
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">کاربر</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">موبایل</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">ایمیل</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">تاریخ عضویت</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">نقش</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">وضعیت</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-blue-700 uppercase tracking-wider">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {filteredUsers.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className={`
                      hover:bg-blue-50/30 transition-all duration-200 group
                      ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/10'}
                    `}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-full 
                          ${user.is_admin ? 'bg-[#131212]' : 'bg-blue-600'}
                          flex items-center justify-center text-white text-xs font-bold shadow-md
                          group-hover:scale-110 transition-transform duration-300
                        `}>
                          {user.first_name?.[0] || user.last_name?.[0] || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#131212] group-hover:text-blue-600 transition-colors">
                            {user.first_name} {user.last_name}
                          </p>
                          {user.is_admin && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#131212] font-medium bg-gray-100 px-2 py-0.5 rounded-full mt-0.5">
                              <Shield size={10} />
                              مدیر
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <Phone size={14} className="text-blue-400" />
                        {user.phone_number || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-blue-400" />
                        {user.email || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} className="text-blue-400" />
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString('fa-IR')
                          : '—'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.is_admin ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#131212] text-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
                          <Shield size={12} />
                          مدیر
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-md">
                          <UserCheck size={12} />
                          کاربر
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex px-2.5 py-1 rounded-full text-xs font-medium 
                        ${user.is_active 
                          ? 'bg-green-100 text-green-700 border border-green-200 hover:shadow-md' 
                          : 'bg-red-100 text-red-700 border border-red-200 hover:shadow-md'
                        }
                        transition-all duration-300 hover:scale-105
                      `}>
                        {user.is_active ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(user.id)}
                        disabled={toggleLoading === user.id}
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300
                          ${user.is_active
                            ? 'text-red-600 hover:bg-red-50 bg-red-50/50 hover:scale-105 hover:shadow-md'
                            : 'text-green-600 hover:bg-green-50 bg-green-50/50 hover:scale-105 hover:shadow-md'
                          }
                          ${toggleLoading === user.id ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
                          shadow-sm
                        `}
                      >
                        {toggleLoading === user.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : user.is_active ? (
                          <>
                            <UserX size={14} />
                            غیرفعال کردن
                          </>
                        ) : (
                          <>
                            <UserCheck size={14} />
                            فعال کردن
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
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
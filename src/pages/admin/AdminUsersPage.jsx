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

  const handleToggle = (userId) => {
    setToggleLoading(userId);
    toggleUserActive.mutate(userId, {
      onSettled: () => setToggleLoading(null),
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#131212] mb-1">مدیریت کاربران</h1>
          <p className="text-gray-500 text-sm">مشاهده و مدیریت کاربران فروشگاه</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="جستجو بر اساس نام، نام خانوادگی یا شماره موبایل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pr-10 pl-4 bg-[#f5f7fa] border-none rounded-lg text-sm text-[#131212] focus:outline-none focus:ring-2 focus:ring-[#131212]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[#131212]" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <Users size={48} className="mx-auto mb-3 opacity-30" />
            <p>کاربری یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">کاربر</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">موبایل</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">ایمیل</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">تاریخ عضویت</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">نقش</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">وضعیت</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#131212] flex items-center justify-center text-white text-xs font-medium">
                          {user.first_name?.[0] || user.last_name?.[0] || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#131212]">
                            {user.first_name} {user.last_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        {user.phone_number || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        {user.email || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} className="text-gray-400" />
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString('fa-IR')
                          : '—'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.is_admin ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#131212] text-white">
                          <Shield size={12} />
                          مدیر
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          <UserCheck size={12} />
                          کاربر
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.is_active ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(user.id)}
                        disabled={toggleLoading === user.id}
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                          ${user.is_active
                            ? 'text-red-600 hover:bg-red-50 bg-red-50/50'
                            : 'text-green-600 hover:bg-green-50 bg-green-50/50'
                          }
                          ${toggleLoading === user.id ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {toggleLoading === user.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : user.is_active ? (
                          <>
                            <UserX size={12} />
                            غیرفعال کردن
                          </>
                        ) : (
                          <>
                            <UserCheck size={12} />
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
    </div>
  );
}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Calendar, Smartphone, Lock, ArrowRight, Loader2, Eye, EyeOff, Shield, UserCircle, ChevronLeft } from 'lucide-react';

export default function ProfilePage() {
  const { profile, changePassword } = useAuth();
  const user = profile.data;
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
  });

  if (profile.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <UserCircle size={20} className="text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="text-blue-600 font-medium animate-pulse">بارگذاری پروفایل...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <User size={40} className="text-red-300" />
        </div>
        <h2 className="text-2xl font-bold text-[#131212] mb-3">اطلاعات کاربر یافت نشد</h2>
        <p className="text-gray-400 mb-6">لطفاً دوباره وارد شوید</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 bg-[#131212] text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-gray-200 font-medium group"
        >
          <span>ورود به حساب</span>
          <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  const handlePasswordChange = (e) => {
    e.preventDefault();
    changePassword.mutate(passwordData, {
      onSuccess: () => {
        setPasswordData({ old_password: '', new_password: '' });
        setShowPasswordForm(false);
      },
    });
  };

  return (
    <div className="px-4 lg:px-0 animate-fadeIn">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors font-medium">
          صفحه اصلی
        </Link>
        <ChevronLeft size={14} className="text-gray-300" />
        <span className="text-[#131212] font-bold">پروفایل</span>
      </nav>

      {/* Header */}
      <div className="mb-10 relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#131212] mb-2 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <UserCircle size={22} className="text-white" />
              </span>
              پروفایل کاربری
            </h1>
            <p className="text-blue-500 mr-13 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse"></span>
              {user.first_name} {user.last_name}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-blue-400 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <Shield size={16} />
            <span>{user.is_admin ? 'مدیر سیستم' : 'کاربر'}</span>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-30"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* User info card */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-blue-100 p-8 shadow-lg shadow-blue-50 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-blue-50">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-200">
                {user.first_name?.[0] || user.last_name?.[0] || '?'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#131212]">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${user.is_admin ? 'bg-[#fbb710]' : 'bg-emerald-400'} inline-block`}></span>
                  {user.is_admin ? 'مدیر سیستم' : 'کاربر عادی'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-xl hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Smartphone size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">شماره موبایل</p>
                  <p className="text-sm font-bold text-[#131212]">{user.phone_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-xl hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mail size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">ایمیل</p>
                  <p className="text-sm font-bold text-[#131212]">{user.email || 'تنظیم نشده'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-xl hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Calendar size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">تاریخ تولد</p>
                  <p className="text-sm font-bold text-[#131212]">
                    {user.date_of_birth
                      ? new Date(user.date_of_birth).toLocaleDateString('fa-IR')
                      : 'تنظیم نشده'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-xl hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <User size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">آخرین ورود</p>
                  <p className="text-sm font-bold text-[#131212]">
                    {user.last_login_at
                      ? new Date(user.last_login_at).toLocaleDateString('fa-IR')
                      : 'نامشخص'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password change */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-lg shadow-blue-50 hover:shadow-xl transition-shadow duration-300 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#fbb710] flex items-center justify-center shadow-md shadow-yellow-200">
                <Lock size={18} className="text-[#131212]" />
              </div>
              <h2 className="text-lg font-bold text-[#131212]">تغییر رمز عبور</h2>
            </div>

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="w-full bg-[#131212] text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-gray-200 font-bold text-sm group"
              >
                <span className="flex items-center justify-center gap-2">
                  تغییر رمز عبور
                  <Lock size={16} className="group-hover:scale-110 transition-transform" />
                </span>
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#131212] mb-2">
                    رمز عبور فعلی <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={passwordData.old_password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, old_password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full pr-12 pl-12 py-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder:text-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#131212] transition-colors"
                    >
                      {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#131212] mb-2">
                    رمز عبور جدید <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, new_password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full pr-12 pl-12 py-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder:text-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#131212] transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="flex-1 bg-gray-100 text-[#131212] px-4 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium text-sm"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={changePassword.isPending}
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {changePassword.isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        در حال ذخیره...
                      </>
                    ) : (
                      <>
                        <span>ذخیره</span>
                        <CheckCircle size={16} className="group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
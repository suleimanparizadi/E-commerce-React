import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Calendar, Smartphone, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

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
      <div className="flex justify-center py-20">
        <Loader2 size={48} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">اطلاعات کاربر یافت نشد</p>
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
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-900">صفحه اصلی</Link>
        <ArrowRight size={14} />
        <span className="text-gray-900">پروفایل</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">پروفایل کاربری</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* User info card */}
        <div className="flex-1 bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {user.first_name?.[0] || user.last_name?.[0] || '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-sm text-gray-500">
                {user.is_admin ? 'مدیر سیستم' : 'کاربر'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Smartphone size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">شماره موبایل</p>
                <p className="text-sm font-medium">{user.phone_number}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">ایمیل</p>
                <p className="text-sm font-medium">{user.email || 'تنظیم نشده'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">تاریخ تولد</p>
                <p className="text-sm font-medium">
                  {user.date_of_birth
                    ? new Date(user.date_of_birth).toLocaleDateString('fa-IR')
                    : 'تنظیم نشده'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">آخرین ورود</p>
                <p className="text-sm font-medium">
                  {user.last_login_at
                    ? new Date(user.last_login_at).toLocaleDateString('fa-IR')
                    : 'نامشخص'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Password change */}
        <div className="w-full lg:w-96">
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={20} className="text-gray-600" />
              <h2 className="font-bold text-lg">تغییر رمز عبور</h2>
            </div>

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                تغییر رمز عبور
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    رمز عبور فعلی
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={passwordData.old_password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, old_password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full pr-10 pl-10 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    رمز عبور جدید
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, new_password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full pr-10 pl-10 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={changePassword.isPending}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {changePassword.isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        در حال ذخیره...
                      </>
                    ) : (
                      'ذخیره'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
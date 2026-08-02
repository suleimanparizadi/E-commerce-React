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
        <Loader2 size={48} className="animate-spin text-amado-primary" />
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
    <div className="px-4 lg:px-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 uppercase">
        <Link to="/" className="hover:text-amado-primary">صفحه اصلی</Link>
        <ArrowRight size={14} />
        <span className="text-amado-dark">پروفایل</span>
      </div>

      <div className="w-[80px] h-[3px] bg-amado-primary mb-4" />
      <h1 className="text-3xl text-amado-dark font-normal mb-8">پروفایل کاربری</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* User info card */}
        <div className="flex-1 bg-white border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-amado-primary text-white flex items-center justify-center text-2xl font-normal">
              {user.first_name?.[0] || user.last_name?.[0] || '?'}
            </div>
            <div>
              <h2 className="text-xl text-amado-dark font-normal">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-sm text-gray-500">
                {user.is_admin ? 'مدیر سیستم' : 'کاربر'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-amado-bg">
              <Smartphone size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase">شماره موبایل</p>
                <p className="text-sm font-medium text-amado-dark">{user.phone_number}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-amado-bg">
              <Mail size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase">ایمیل</p>
                <p className="text-sm font-medium text-amado-dark">{user.email || 'تنظیم نشده'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-amado-bg">
              <Calendar size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase">تاریخ تولد</p>
                <p className="text-sm font-medium text-amado-dark">
                  {user.date_of_birth
                    ? new Date(user.date_of_birth).toLocaleDateString('fa-IR')
                    : 'تنظیم نشده'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-amado-bg">
              <User size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase">آخرین ورود</p>
                <p className="text-sm font-medium text-amado-dark">
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
          <div className="bg-white border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Lock size={20} className="text-amado-dark" />
              <h2 className="text-lg text-amado-dark font-normal uppercase">تغییر رمز عبور</h2>
            </div>

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="w-full h-[55px] bg-amado-bg text-amado-dark text-sm uppercase font-normal hover:bg-gray-200 transition-colors"
              >
                تغییر رمز عبور
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-500 uppercase mb-2">
                    رمز عبور فعلی
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
                      className="w-full pr-12 pl-12 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-amado-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amado-dark"
                    >
                      {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-500 uppercase mb-2">
                    رمز عبور جدید
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
                      className="w-full pr-12 pl-12 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-amado-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amado-dark"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="flex-1 h-[55px] bg-amado-bg text-amado-dark text-sm uppercase font-normal hover:bg-gray-200 transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={changePassword.isPending}
                    className="flex-1 amado-btn text-base flex items-center justify-center gap-2 disabled:opacity-50"
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
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, ArrowRight, Loader2, Smartphone, Lock } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, sendOTP, verifyOTP } = useAuth();
  const [mode, setMode] = useState('password'); // 'password' or 'otp'
  const [step, setStep] = useState('phone'); // 'phone' or 'code' for OTP mode
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    login.mutate(
      { phone_number: phone, password },
      {
        onSuccess: () => navigate('/'),
      }
    );
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    sendOTP.mutate(
      { phone_number: phone },
      {
        onSuccess: () => setStep('code'),
      }
    );
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    verifyOTP.mutate(
      { phone_number: phone, otp_code: otpCode },
      {
        onSuccess: () => navigate('/'),
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ورود به حساب</h1>
          <p className="text-gray-500 text-sm">
            {mode === 'password'
              ? 'شماره موبایل و رمز عبور خود را وارد کنید'
              : step === 'phone'
              ? 'شماره موبایل خود را وارد کنید'
              : 'کد تأیید را وارد کنید'}
          </p>
        </div>

        {/* Password Login Form */}
        {mode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                شماره موبایل
              </label>
              <div className="relative">
                <Smartphone size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                رمز عبور
              </label>
              <div className="relative">
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-10 pl-10 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {login.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  در حال ورود...
                </>
              ) : (
                'ورود'
              )}
            </button>
          </form>
        )}

        {/* OTP Login Form - Phone Step */}
        {mode === 'otp' && step === 'phone' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                شماره موبایل
              </label>
              <div className="relative">
                <Smartphone size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={sendOTP.isPending}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sendOTP.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  در حال ارسال...
                </>
              ) : (
                'ارسال کد تأیید'
              )}
            </button>
          </form>
        )}

        {/* OTP Login Form - Code Step */}
        {mode === 'otp' && step === 'code' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500">
                کد تأیید به شماره <span className="font-medium text-gray-900">{phone}</span> ارسال شد
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                کد تأیید
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="۱۲۳۴۵۶"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 text-center text-2xl tracking-widest"
                required
              />
            </div>

            <button
              type="submit"
              disabled={verifyOTP.isPending}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {verifyOTP.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  در حال بررسی...
                </>
              ) : (
                'تأیید و ورود'
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-sm text-gray-500 hover:text-gray-900 py-2"
            >
              ارسال مجدد / تغییر شماره
            </button>
          </form>
        )}

        {/* Toggle mode */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === 'password' ? 'otp' : 'password');
              setStep('phone');
              setOtpCode('');
            }}
            className="text-sm text-gray-500 hover:text-gray-900 underline"
          >
            {mode === 'password' ? 'ورود با کد تأیید' : 'ورود با رمز عبور'}
          </button>
        </div>

        {/* Register link */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            حساب کاربری ندارید؟{' '}
            <Link to="/register" className="text-gray-900 font-medium hover:underline">
              ثبت نام
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
          >
            <ArrowRight size={14} />
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}
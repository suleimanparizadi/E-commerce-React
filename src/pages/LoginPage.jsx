import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, ArrowRight, Loader2, Smartphone, Lock } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, sendOTP, verifyOTP } = useAuth();
  const [mode, setMode] = useState('password');
  const [step, setStep] = useState('phone');
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
    <div className="min-h-screen flex items-center justify-center bg-amado-bg px-4">
      <div className="w-full max-w-md bg-white p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl text-amado-dark font-normal mb-2 uppercase">ورود به حساب</h1>
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
          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-500 uppercase mb-2">
                شماره موبایل
              </label>
              <div className="relative">
                <Smartphone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full pr-12 pl-4 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-amado-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 uppercase mb-2">
                رمز عبور
              </label>
              <div className="relative">
                <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-12 pl-12 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-amado-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amado-dark"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full amado-btn text-base flex items-center justify-center gap-2 disabled:opacity-50"
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
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-500 uppercase mb-2">
                شماره موبایل
              </label>
              <div className="relative">
                <Smartphone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full pr-12 pl-4 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-amado-primary"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={sendOTP.isPending}
              className="w-full amado-btn text-base flex items-center justify-center gap-2 disabled:opacity-50"
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
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500">
                کد تأیید به شماره <span className="font-medium text-amado-dark">{phone}</span> ارسال شد
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 uppercase mb-2">
                کد تأیید
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="۱۲۳۴۵۶"
                maxLength={6}
                className="w-full px-4 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-amado-primary text-center text-2xl tracking-widest"
                required
              />
            </div>

            <button
              type="submit"
              disabled={verifyOTP.isPending}
              className="w-full amado-btn text-base flex items-center justify-center gap-2 disabled:opacity-50"
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
              className="w-full text-sm text-gray-500 hover:text-amado-dark py-2"
            >
              ارسال مجدد / تغییر شماره
            </button>
          </form>
        )}

        {/* Toggle mode */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setMode(mode === 'password' ? 'otp' : 'password');
              setStep('phone');
              setOtpCode('');
            }}
            className="text-sm text-gray-500 hover:text-amado-primary underline transition-colors"
          >
            {mode === 'password' ? 'ورود با کد تأیید' : 'ورود با رمز عبور'}
          </button>
        </div>

        {/* Register link */}
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            حساب کاربری ندارید؟{' '}
            <Link to="/register" className="text-amado-dark font-medium hover:text-amado-primary transition-colors">
              ثبت نام
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-amado-dark transition-colors"
          >
            <ArrowRight size={14} />
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}
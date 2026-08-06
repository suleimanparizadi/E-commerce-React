import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, ArrowRight, Loader2, Smartphone, Lock, LogIn, Shield, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-white to-[#fbb710]/5 px-4 animate-fadeIn">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-blue-100 p-8 shadow-2xl shadow-blue-100/50 hover:shadow-blue-200/50 transition-shadow duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#131212] mb-2">ورود به حساب</h1>
            <p className="text-gray-400 text-sm">
              {mode === 'password'
                ? 'شماره موبایل و رمز عبور خود را وارد کنید'
                : step === 'phone'
                ? 'شماره موبایل خود را وارد کنید'
                : 'کد تأیید را وارد کنید'}
            </p>
          </div>

          {/* Password Login Form */}
          {mode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#131212] mb-2">
                  شماره موبایل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Smartphone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full pr-12 pl-4 py-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#131212] mb-2">
                  رمز عبور <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-12 pl-12 py-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder:text-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#131212] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={login.isPending}
                className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 group"
              >
                {login.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    در حال ورود...
                  </>
                ) : (
                  <>
                    <span>ورود</span>
                    <LogIn size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* OTP Login Form - Phone Step */}
          {mode === 'otp' && step === 'phone' && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#131212] mb-2">
                  شماره موبایل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Smartphone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full pr-12 pl-4 py-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={sendOTP.isPending}
                className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 group"
              >
                {sendOTP.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <span>ارسال کد تأیید</span>
                    <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* OTP Login Form - Code Step */}
          {mode === 'otp' && step === 'code' && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="text-center mb-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                <p className="text-sm text-gray-600">
                  کد تأیید به شماره <span className="font-bold text-[#131212]">{phone}</span> ارسال شد
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#131212] mb-2">
                  کد تأیید <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="۱۲۳۴۵۶"
                  maxLength={6}
                  className="w-full px-4 py-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 text-center text-2xl tracking-widest placeholder:text-gray-300"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={verifyOTP.isPending}
                className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {verifyOTP.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    در حال بررسی...
                  </>
                ) : (
                  <>
                    <span>تأیید و ورود</span>
                    <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors py-2 hover:gap-1 flex items-center justify-center gap-0.5"
              >
                <ArrowRight size={14} />
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
              className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors hover:gap-1 flex items-center justify-center gap-0.5 w-full"
            >
              {mode === 'password' ? 'ورود با کد تأیید' : 'ورود با رمز عبور'}
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Register link */}
          <div className="mt-6 pt-6 border-t border-blue-100 text-center">
            <p className="text-sm text-gray-400">
              حساب کاربری ندارید؟{' '}
              <Link to="/register" className="text-[#131212] font-bold hover:text-blue-600 transition-colors">
                ثبت نام
              </Link>
            </p>
          </div>

          {/* Back to home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-[#131212] transition-colors group"
            >
              <ArrowRight size={14} className="group-hover:-translate-x-1 transition-transform" />
              بازگشت به فروشگاه
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
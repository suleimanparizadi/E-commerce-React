import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, ArrowRight, Loader2, Smartphone, Lock, User, Mail, Calendar, Check } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerInitiate, register } = useAuth();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'details'
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    date_of_birth: '',
    terms_accepted: false,
  });

  const handleSendOTP = (e) => {
    e.preventDefault();
    registerInitiate.mutate(
      { phone_number: phone },
      {
        onSuccess: () => setStep('otp'),
      }
    );
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setStep('details');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    register.mutate(
      {
        phone_number: phone,
        otp_code: otpCode,
        ...formData,
      },
      {
        onSuccess: () => navigate('/'),
      }
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ثبت نام</h1>
          <p className="text-gray-500 text-sm">
            {step === 'phone' && 'شماره موبایل خود را وارد کنید'}
            {step === 'otp' && 'کد تأیید را وارد کنید'}
            {step === 'details' && 'اطلاعات خود را تکمیل کنید'}
          </p>
        </div>

        {/* Step 1: Phone */}
        {step === 'phone' && (
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
              disabled={registerInitiate.isPending}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {registerInitiate.isPending ? (
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

        {/* Step 2: OTP */}
        {step === 'otp' && (
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
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              ادامه
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

        {/* Step 3: Details */}
        {step === 'details' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  نام
                </label>
                <div className="relative">
                  <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="علی"
                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="احمدی"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ایمیل (اختیاری)
              </label>
              <div className="relative">
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                تاریخ تولد (اختیاری)
              </label>
              <div className="relative">
                <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="terms_accepted"
                checked={formData.terms_accepted}
                onChange={handleChange}
                className="mt-1 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                required
              />
              <span className="text-sm text-gray-600">
                <Check size={14} className="inline ml-1" />
                با <a href="#" className="underline">قوانین و مقررات</a> موافقم
              </span>
            </label>

            <button
              type="submit"
              disabled={register.isPending}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {register.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  در حال ثبت نام...
                </>
              ) : (
                'ثبت نام'
              )}
            </button>
          </form>
        )}

        {/* Login link */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            قبلاً ثبت نام کرده‌اید؟{' '}
            <Link to="/login" className="text-gray-900 font-medium hover:underline">
              ورود
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
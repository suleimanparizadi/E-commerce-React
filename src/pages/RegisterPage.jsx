import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, ArrowRight, Loader2, Smartphone, Lock, User, Mail, Calendar, Check } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerInitiate, register } = useAuth();
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [formData, setFormData] = useState({
    phone_number: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    date_of_birth: '',
    terms_accepted: false,
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setFormError('');
  };

    const handleSendOTP = (e) => {
    e.preventDefault();
    setFormError('');

    // Client-side validation
    if (formData.password !== formData.confirm_password) {
      setFormError('رمز عبور و تکرار آن یکسان نیستند');
      return;
    }
    if (formData.password.length < 4) {
      setFormError('رمز عبور باید حداقل ۴ کاراکتر باشد');
      return;
    }
    if (!formData.terms_accepted) {
      setFormError('پذیرش قوانین و مقررات الزامی است');
      return;
    }

    // Build payload — MUST include password_confirm!
    const payload = {
      phone_number: formData.phone_number,
      first_name: formData.first_name,
      last_name: formData.last_name,
      password: formData.password,
      password_confirm: formData.confirm_password,  // <-- THIS WAS MISSING!
    };

    if (formData.email?.trim()) {
      payload.email = formData.email.trim();
    }
    if (formData.date_of_birth) {
      payload.date_of_birth = formData.date_of_birth;
    }

    registerInitiate.mutate(payload, {
      onSuccess: () => setStep('otp'),
      onError: (error) => {
        console.error('Full error:', error.response?.data);
        const data = error.response?.data || {};
        setFormError(
          data.message ||
          data.phone_number?.[0] ||
          data.password?.[0] ||
          data.password_confirm?.[0] ||
          data.first_name?.[0] ||
          data.last_name?.[0] ||
          data.email?.[0] ||
          data.non_field_errors?.[0] ||
          'خطا در ارسال کد تأیید. لطفاً دوباره تلاش کنید.'
        );
      },
    });
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setFormError('');

    // Django expects 'code', not 'otp_code'
    register.mutate(
      {
        phone_number: formData.phone_number,
        code: otpCode,
      },
      {
        onSuccess: () => navigate('/'),
        onError: (error) => {
          setFormError(
            error.response?.data?.message || 'کد تأیید نامعتبر است.'
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amado-bg px-4">
      <div className="w-full max-w-md bg-white p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl text-amado-dark font-normal mb-2 uppercase">ثبت نام</h1>
          <p className="text-gray-500 text-sm">
            {step === 'form' && 'اطلاعات خود را وارد کنید'}
            {step === 'otp' && 'کد تأیید را وارد کنید'}
          </p>
        </div>

        {/* Error banner */}
        {formError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {formError}
          </div>
        )}

        {/* Step 1: Full Registration Form */}
        {step === 'form' && (
          <form onSubmit={handleSendOTP} className="space-y-5">
            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-500 uppercase mb-2">
                شماره موبایل *
              </label>
              <div className="relative">
                <Smartphone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full pr-12 pl-4 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-amado-primary"
                  required
                />
              </div>
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 uppercase mb-2">
                  نام *
                </label>
                <div className="relative">
                  <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="علی"
                    className="w-full pr-12 pl-4 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-amado-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 uppercase mb-2">
                  نام خانوادگی *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="احمدی"
                  className="w-full px-4 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-amado-primary"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-500 uppercase mb-2">
                ایمیل (اختیاری)
              </label>
              <div className="relative">
                <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full pr-12 pl-4 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-amado-primary"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-500 uppercase mb-2">
                رمز عبور *
              </label>
              <div className="relative">
                <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pr-12 pl-12 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-amado-primary"
                  required
                  minLength={6}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-500 uppercase mb-2">
                تکرار رمز عبور *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-amado-primary"
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm text-gray-500 uppercase mb-2">
                تاریخ تولد (اختیاری)
              </label>
              <div className="relative">
                <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full pr-12 pl-4 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-amado-primary"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="terms_accepted"
                checked={formData.terms_accepted}
                onChange={handleChange}
                className="mt-1 rounded-none border-gray-300 text-amado-primary focus:ring-amado-primary w-4 h-4"
                required
              />
              <span className="text-sm text-gray-600">
                با <a href="#" className="underline hover:text-amado-primary">قوانین و مقررات</a> موافقم *
              </span>
            </label>

            <button
              type="submit"
              disabled={registerInitiate.isPending}
              className="w-full amado-btn text-base flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {registerInitiate.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  در حال ارسال کد...
                </>
              ) : (
                'ارسال کد تأیید'
              )}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500">
                کد تأیید به شماره{' '}
                <span className="font-medium text-amado-dark">{formData.phone_number}</span>{' '}
                ارسال شد
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-500 uppercase mb-2">
                کد تأیید *
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
              disabled={register.isPending}
              className="w-full amado-btn text-base flex items-center justify-center gap-2 disabled:opacity-50"
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

            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-full text-sm text-gray-500 hover:text-amado-dark py-2"
            >
              بازگشت و ارسال مجدد
            </button>
          </form>
        )}

        {/* Login link */}
        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            قبلاً ثبت نام کرده‌اید؟{' '}
            <Link to="/login" className="text-amado-dark font-medium hover:text-amado-primary transition-colors">
              ورود
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
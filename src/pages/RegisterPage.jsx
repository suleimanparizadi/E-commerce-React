import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, ArrowRight, Loader2, Smartphone, Lock, User, Mail, Calendar, Check, UserPlus, Shield, ChevronRight } from 'lucide-react';

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
      password_confirm: formData.confirm_password,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-white to-[#fbb710]/5 px-4 animate-fadeIn">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-blue-100 p-8 shadow-2xl shadow-blue-100/50 hover:shadow-blue-200/50 transition-shadow duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#fbb710] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-200">
              <UserPlus size={28} className="text-[#131212]" />
            </div>
            <h1 className="text-2xl font-bold text-[#131212] mb-2">ثبت نام</h1>
            <p className="text-gray-400 text-sm">
              {step === 'form' && 'اطلاعات خود را وارد کنید'}
              {step === 'otp' && 'کد تأیید را وارد کنید'}
            </p>
          </div>

          {/* Error banner */}
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 animate-slideDown">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <span className="font-medium text-sm">{formError}</span>
            </div>
          )}

          {/* Step 1: Full Registration Form */}
          {step === 'form' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-[#131212] mb-2">
                  شماره موبایل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Smartphone size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full pr-12 pl-4 py-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#131212] mb-2">
                    نام <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="علی"
                      className="w-full pr-12 pl-4 py-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#131212] mb-2">
                    نام خانوادگی <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="احمدی"
                    className="w-full px-4 py-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#131212] mb-2">
                  ایمیل <span className="text-gray-400 text-xs">(اختیاری)</span>
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="w-full pr-12 pl-4 py-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#131212] mb-2">
                  رمز عبور <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pr-12 pl-12 py-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder:text-gray-400"
                    required
                    minLength={6}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-[#131212] mb-2">
                  تکرار رمز عبور <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300 placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-[#131212] mb-2">
                  تاریخ تولد <span className="text-gray-400 text-xs">(اختیاری)</span>
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full pr-12 pl-4 py-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer p-3 bg-blue-50/30 rounded-xl border border-blue-100/50 hover:bg-blue-50/50 transition-colors">
                <input
                  type="checkbox"
                  name="terms_accepted"
                  checked={formData.terms_accepted}
                  onChange={handleChange}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  required
                />
                <span className="text-sm text-gray-600">
                  با <a href="#" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">قوانین و مقررات</a> موافقم <span className="text-red-500">*</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={registerInitiate.isPending}
                className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 group"
              >
                {registerInitiate.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    در حال ارسال کد...
                  </>
                ) : (
                  <>
                    <span>ارسال کد تأیید</span>
                    <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="text-center p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <p className="text-sm text-gray-600">
                  کد تأیید به شماره{' '}
                  <span className="font-bold text-[#131212]">{formData.phone_number}</span>{' '}
                  ارسال شد
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
                disabled={register.isPending}
                className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-blue-200 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {register.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    در حال ثبت نام...
                  </>
                ) : (
                  <>
                    <span>ثبت نام</span>
                    <Check size={18} className="group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors py-2 hover:gap-1 flex items-center justify-center gap-0.5"
              >
                <ArrowRight size={14} />
                بازگشت و ارسال مجدد
              </button>
            </form>
          )}

          {/* Login link */}
          <div className="mt-6 pt-6 border-t border-blue-100 text-center">
            <p className="text-sm text-gray-400">
              قبلاً ثبت نام کرده‌اید؟{' '}
              <Link to="/login" className="text-[#131212] font-bold hover:text-blue-600 transition-colors">
                ورود
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
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
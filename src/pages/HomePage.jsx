import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../features/products/components/ProductCard';
import { ArrowRight, Loader2, ShoppingBag, Truck, Shield, Headphones, Laptop, Star, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const { data: products, isLoading } = useProducts();

  const featuredProducts = Array.isArray(products) ? products.slice(0, 6) : [];
  
  const features = [
    {
      icon: ShoppingBag,
      title: 'تنوع محصولات',
      desc: 'جدیدترین لپ‌تاپ‌های روز دنیا',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hoverBg: 'group-hover:bg-blue-600',
      hoverIconBg: 'group-hover:bg-blue-500',
    },
    {
      icon: Truck,
      title: 'ارسال سریع',
      desc: 'تحویل در کمترین زمان ممکن',
      bgColor: 'bg-[#fbb710]/10',
      iconBg: 'bg-[#fbb710]/20',
      iconColor: 'text-[#fbb710]',
      hoverBg: 'group-hover:bg-[#fbb710]',
      hoverIconBg: 'group-hover:bg-[#e5a50f]',
    },
    {
      icon: Shield,
      title: 'ضمانت اصالت',
      desc: 'کالای ۱۰۰٪ اورجینال',
      bgColor: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      hoverBg: 'group-hover:bg-emerald-600',
      hoverIconBg: 'group-hover:bg-emerald-500',
    },
    {
      icon: Headphones,
      title: 'پشتیبانی ۲۴/۷',
      desc: 'همیشه در کنار شما هستیم',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      hoverBg: 'group-hover:bg-purple-600',
      hoverIconBg: 'group-hover:bg-purple-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Laptop size={20} className="text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="text-blue-600 font-medium animate-pulse">بارگذاری محصولات...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <div className="relative h-[500px] lg:h-[600px] mb-12 overflow-hidden rounded-3xl shadow-2xl shadow-blue-100">
        <div className="absolute inset-0 bg-gradient-to-br from-[#131212] via-[#131212]/90 to-blue-900/80">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl"></div>
          <div className="absolute top-20 right-20 w-48 h-48 rounded-full bg-[#fbb710]/20 blur-2xl"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="px-10 lg:px-20 max-w-2xl relative">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#fbb710] animate-pulse"></span>
              <span className="text-blue-200 text-sm font-medium">فروشگاه تخصصی لپ‌تاپ</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              بهترین لپ‌تاپ‌ها
              <br />
              <span className="bg-gradient-to-r from-[#fbb710] to-yellow-400 bg-clip-text text-transparent">
                با بهترین قیمت
              </span>
            </h1>
            
            <p className="text-blue-100/80 mb-8 text-lg leading-relaxed max-w-lg">
              از میان صدها مدل لپ‌تاپ، بهترین انتخاب را برای نیازهای خود داشته باشید
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-[#fbb710] text-[#131212] px-8 py-3.5 rounded-xl hover:bg-[#e5a50f] transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-yellow-200 font-bold group"
              >
                <span>مشاهده محصولات</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 font-medium group"
              >
                <span>مشاوره رایگان</span>
                <Star size={18} className="text-[#fbb710] group-hover:scale-110 transition-transform" />
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/10">
              <div>
                <p className="text-2xl font-bold text-white">۵۰۰+</p>
                <p className="text-blue-200/70 text-sm">محصولات</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <p className="text-2xl font-bold text-white">۹۸٪</p>
                <p className="text-blue-200/70 text-sm">رضایت مشتریان</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <p className="text-2xl font-bold text-white">۲۴/۷</p>
                <p className="text-blue-200/70 text-sm">پشتیبانی</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className={`
                bg-white rounded-2xl border border-blue-100 p-8 text-center 
                hover:shadow-xl hover:-translate-y-2 hover:border-blue-200 
                transition-all duration-300 group relative overflow-hidden
                ${index === 0 ? 'animate-slideDown [animation-delay:0ms]' : ''}
                ${index === 1 ? 'animate-slideDown [animation-delay:100ms]' : ''}
                ${index === 2 ? 'animate-slideDown [animation-delay:200ms]' : ''}
                ${index === 3 ? 'animate-slideDown [animation-delay:300ms]' : ''}
              `}
            >
              {/* Animated background */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-blue-50/50 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10">
                <div className={`
                  w-16 h-16 ${feature.bgColor} rounded-2xl 
                  flex items-center justify-center mx-auto mb-4 
                  group-hover:scale-110 group-hover:rotate-6 
                  transition-all duration-300 shadow-lg
                  ${feature.hoverBg}
                `}>
                  <Icon size={24} className={`${feature.iconColor} group-hover:text-white transition-colors duration-300`} />
                </div>
                <h3 className="text-base font-bold text-[#131212] mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Featured Products */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#131212] mb-2 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <TrendingUp size={22} className="text-white" />
              </span>
              محصولات ویژه
            </h2>
            <p className="text-blue-500 mr-13 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse"></span>
              جدیدترین و بهترین لپ‌تاپ‌های موجود
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all duration-300 font-medium hover:gap-2 group"
          >
            <span>مشاهده همه</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
            </div>
            <p className="text-blue-600 font-medium">بارگذاری محصولات...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`
                  ${index === 0 ? 'animate-slideDown [animation-delay:400ms]' : ''}
                  ${index === 1 ? 'animate-slideDown [animation-delay:500ms]' : ''}
                  ${index === 2 ? 'animate-slideDown [animation-delay:600ms]' : ''}
                  ${index === 3 ? 'animate-slideDown [animation-delay:700ms]' : ''}
                  ${index === 4 ? 'animate-slideDown [animation-delay:800ms]' : ''}
                  ${index === 5 ? 'animate-slideDown [animation-delay:900ms]' : ''}
                `}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="relative h-[300px] overflow-hidden rounded-3xl shadow-2xl shadow-blue-100 mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#131212] via-blue-900/90 to-[#131212]">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-600/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#fbb710]/20 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/30 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fbb710] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fbb710]"></span>
              </span>
              <span className="text-blue-200 text-sm font-medium">راهنمای خرید هوشمند</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              راهنمای خرید لپ‌تاپ
            </h2>
            <p className="text-blue-100/80 mb-8 max-w-md mx-auto">
              با دستیار هوشمند ما، بهترین لپ‌تاپ متناسب با نیاز خود را پیدا کنید
            </p>
            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 bg-[#fbb710] text-[#131212] px-8 py-3.5 rounded-xl hover:bg-[#e5a50f] transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-yellow-200 font-bold group"
            >
              <span>مشاوره رایگان</span>
              <Star size={18} className="group-hover:scale-110 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
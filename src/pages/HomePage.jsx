import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../features/products/components/ProductCard';
import { ArrowRight, Loader2, ShoppingBag, Truck, Shield, Headphones } from 'lucide-react';

export default function HomePage() {
  const { data: products, isLoading } = useProducts();

const featuredProducts = Array.isArray(products) ? products.slice(0, 6) : [];
  const features = [
    {
      icon: ShoppingBag,
      title: 'تنوع محصولات',
      desc: 'جدیدترین لپ‌تاپ‌های روز دنیا',
    },
    {
      icon: Truck,
      title: 'ارسال سریع',
      desc: 'تحویل در کمترین زمان ممکن',
    },
    {
      icon: Shield,
      title: 'ضمانت اصالت',
      desc: 'کالای ۱۰۰٪ اورجینال',
    },
    {
      icon: Headphones,
      title: 'پشتیبانی ۲۴/۷',
      desc: 'همیشه در کنار شما هستیم',
    },
  ];

  return (
    <div>
      {/* Hero Section - Amado Style */}
      <div className="relative h-[500px] lg:h-[600px] mb-12 overflow-hidden">
        <img
          src="/hero-bg.jpg"
          alt="Laptop Store"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        {/* Fallback gradient if image fails */}
        <div className="absolute inset-0 bg-gradient-to-l from-gray-900/80 to-transparent flex items-center">
          <div className="px-10 lg:px-20 max-w-xl">
            <p className="text-amado-primary text-sm uppercase tracking-widest mb-4">
              فروشگاه لپ‌تاپ
            </p>
            <h1 className="text-4xl lg:text-6xl font-normal text-white mb-6 leading-tight">
              بهترین لپ‌تاپ‌ها
              <br />
              <span className="text-amado-primary">با بهترین قیمت</span>
            </h1>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              از میان صدها مدل لپ‌تاپ، بهترین انتخاب را برای نیازهای خود داشته باشید
            </p>
            <Link
              to="/products"
              className="inline-block amado-btn text-center"
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </div>

      {/* Features - Amado Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mb-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 p-8 text-center group hover:shadow-lg transition-all duration-500"
          >
            <div className="w-16 h-16 bg-amado-bg rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amado-primary transition-colors duration-500">
              <feature.icon size={24} className="text-amado-dark group-hover:text-white transition-colors duration-500" />
            </div>
            <h3 className="text-base text-amado-dark mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Featured Products - Amado Style */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8 px-4 lg:px-0">
          <h2 className="text-2xl text-amado-dark font-normal">محصولات ویژه</h2>
          <Link
            to="/products"
            className="text-sm text-gray-500 hover:text-amado-primary transition-colors flex items-center gap-1 uppercase"
          >
            مشاهده همه
            <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={48} className="animate-spin text-amado-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner - Amado Style */}
      <div className="relative h-[300px] overflow-hidden mb-12">
        <div className="absolute inset-0 bg-amado-dark flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-3xl lg:text-4xl text-white font-normal mb-4">
              راهنمای خرید لپ‌تاپ
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              با دستیار هوشمند ما، بهترین لپ‌تاپ متناسب با نیاز خود را پیدا کنید
            </p>
            <Link
              to="/assistant"
              className="inline-block amado-btn text-center"
            >
              مشاوره رایگان
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
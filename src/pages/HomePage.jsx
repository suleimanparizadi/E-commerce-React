import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/features/products/components/ProductCard';
import { ArrowRight, Loader2, ShoppingBag, Truck, Shield, Headphones } from 'lucide-react';

export default function HomePage() {
  const { data: products, isLoading } = useProducts();

  const featuredProducts = products?.slice(0, 6) || [];

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
      {/* Hero Section */}
      <div className="bg-gray-900 rounded-2xl p-8 lg:p-12 mb-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <p className="text-amber-400 font-medium mb-2">فروشگاه لپ‌تاپ</p>
          <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
            بهترین لپ‌تاپ‌ها
            <br />
            با بهترین قیمت
          </h1>
          <p className="text-gray-300 mb-8 text-lg">
            از میان صدها مدل لپ‌تاپ، بهترین انتخاب را برای نیازهای خود داشته باشید
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            مشاهده محصولات
            <ArrowRight size={18} />
          </Link>
        </div>
        {/* Decorative element */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white border border-gray-100 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <feature.icon size={24} className="text-gray-700" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Featured Products */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">محصولات ویژه</h2>
          <Link
            to="/products"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
          >
            مشاهده همه
            <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={48} className="animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          راهنمای خرید لپ‌تاپ
        </h2>
        <p className="text-gray-600 mb-6">
          با دستیار هوشمند ما، بهترین لپ‌تاپ متناسب با نیاز خود را پیدا کنید
        </p>
        <Link
          to="/assistant"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          <Headphones size={18} />
          مشاوره رایگان
        </Link>
      </div>
    </div>
  );
}
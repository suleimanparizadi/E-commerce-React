import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useReviews } from '../hooks/useReviews';
import { useCart } from '../hooks/useCart';
import {
  ArrowRight,
  Loader2,
  Star,
  ShoppingCart,
  Heart,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  Package,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, isLoading: productLoading } = useProduct(slug);
  const { reviews } = useReviews(slug);
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addStatus, setAddStatus] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const images =
    product?.images?.length > 0
      ? product.images.map((img) => img.image)
      : [product?.thumbnail || '/placeholder-image.jpg'];

  const reviewsList = Array.isArray(reviews.data) ? reviews.data : [];
  const reviewsLoading = reviews.isLoading;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (images.length <= 1) return;
      if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => (prev + 1) % images.length);
      }
      if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
      }
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  if (productLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Package size={20} className="text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="text-blue-600 font-medium animate-pulse">بارگذاری محصول...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <Package size={40} className="text-red-300" />
        </div>
        <h2 className="text-2xl font-bold text-[#131212] mb-3">محصول یافت نشد</h2>
        <p className="text-gray-400 mb-6">محصول مورد نظر موجود نمی‌باشد</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-[#131212] text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-gray-200 font-medium group"
        >
          <span>بازگشت به فروشگاه</span>
          <ArrowRight size={18} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setAddStatus(null);
    addItem.mutate(
      {
        product_slug: product.slug,
        quantity,
        product: product,
      },
      {
        onSuccess: () => {
          setAddStatus('success');
          setTimeout(() => setAddStatus(null), 3000);
        },
        onError: (error) => {
          console.error('Add to cart failed:', error);
          setAddStatus('error');
          setTimeout(() => setAddStatus(null), 3000);
        },
      }
    );
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const avgRating = Math.round(product.average_rating || 0);

  // Format price with English numbers and no Toman
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  return (
    <div className="px-4 lg:px-0 relative animate-fadeIn">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/products" className="hover:text-blue-600 transition-colors font-medium">
          فروشگاه
        </Link>
        <ChevronLeft size={14} className="text-gray-300" />
        <span className="text-[#131212] font-bold">{product.name}</span>
      </nav>

      {/* Feedback toast */}
      {addStatus === 'success' && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 animate-slideDown">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle size={18} className="text-emerald-600" />
          </div>
          <span className="font-medium">محصول با موفقیت به سبد اضافه شد</span>
        </div>
      )}
      {addStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 animate-slideDown">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle size={18} className="text-red-600" />
          </div>
          <span className="font-medium">خطا در افزودن به سبد. لطفاً دوباره تلاش کنید</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* ===== IMAGE GALLERY ===== */}
        <div className="lg:w-1/2 space-y-4">
          <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-blue-100 shadow-lg shadow-blue-50 group">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            />

            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
            >
              <ZoomIn size={20} className="text-[#131212]" />
            </button>

            {/* Stock badge */}
            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg ${
              product.is_in_stock 
                ? 'bg-emerald-500 text-white shadow-emerald-200' 
                : 'bg-red-500 text-white shadow-red-200'
            }`}>
              {product.is_in_stock ? 'موجود' : 'ناموجود'}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                  aria-label="تصویر قبلی"
                >
                  <ChevronLeft size={20} className="text-[#131212]" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                  aria-label="تصویر بعدی"
                >
                  <ChevronRight size={20} className="text-[#131212]" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#131212]/80 backdrop-blur-sm text-white text-xs font-medium rounded-xl">
                  {selectedImage + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={`thumb-${idx}`}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === idx
                      ? 'border-blue-600 ring-2 ring-blue-200 shadow-md'
                      : 'border-blue-100 hover:border-blue-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} - ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== PRODUCT INFO ===== */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl border border-blue-100 p-8 shadow-lg shadow-blue-50">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                {product.brand && (
                  <p className="text-sm text-blue-600 font-medium uppercase tracking-wider mb-1">
                    {product.brand}
                  </p>
                )}
                <h1 className="text-2xl font-bold text-[#131212]">
                  {product.name}
                </h1>
              </div>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-10 h-10 rounded-xl border border-blue-100 flex items-center justify-center hover:bg-blue-50 transition-all duration-300 hover:scale-110 group"
              >
                <Heart 
                  size={18} 
                  className={`transition-colors duration-300 ${
                    isWishlisted 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-gray-400 group-hover:text-red-400'
                  }`} 
                />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50/50 rounded-xl">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={`star-${star}`}
                    size={16}
                    className={
                      star <= avgRating
                        ? 'text-[#fbb710] fill-[#fbb710]'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-[#131212]">
                {product.average_rating || 0}
              </span>
              <span className="text-sm text-gray-400">
                ({reviewsList.length} نظر)
              </span>
            </div>

            {/* Price - English numbers, no Toman */}
            <div className="flex items-end gap-3 mb-6">
              <p className="text-3xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </p>
              {product.compare_price && product.compare_price > product.price && (
                <p className="text-lg text-gray-400 line-through">
                  {formatPrice(product.compare_price)}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed border-b border-blue-50 pb-6">
              {product.description}
            </p>

            {/* Specs */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[#131212] mb-4 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-blue-600 inline-block"></span>
                مشخصات فنی
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  {
                    label: 'پردازنده',
                    value: `${product.cpu?.manufacturer || ''} ${product.cpu?.series || ''}`,
                  },
                  {
                    label: 'مدل CPU',
                    value: product.cpu?.model || '-',
                  },
                  {
                    label: 'هسته‌ها',
                    value: product.cpu?.cores ? `${product.cpu.cores} هسته` : '-',
                  },
                  { label: 'RAM', value: `${product.ram}GB` },
                  {
                    label: 'حافظه',
                    value:
                      product.storage >= 1024
                        ? `${product.storage / 1024}TB`
                        : `${product.storage}GB`,
                  },
                  { label: 'GPU', value: product.gpu || '-' },
                  {
                    label: 'GPU آنبرد',
                    value: product.on_board_gpu ? 'دارد' : 'ندارد',
                  },
                  {
                    label: 'صفحه نمایش',
                    value: `${product.display_size || '-'} اینچ ${product.touch_screen ? '(لمسی)' : ''}`,
                  },
                  {
                    label: 'دسته‌بندی',
                    value: product.category?.name || '-',
                  },
                ].map((spec, idx) => (
                  <div
                    key={`spec-${idx}`}
                    className="flex justify-between items-center p-2 bg-blue-50/30 rounded-lg"
                  >
                    <span className="text-gray-400 text-xs">{spec.label}</span>
                    <span className="text-[#131212] font-medium text-xs">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Add to cart - Yellow button */}
            <div className="flex gap-3">
              <div className="flex items-center border border-blue-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-blue-50 text-[#131212] transition-colors duration-200"
                >
                  -
                </button>
                <span className="px-4 py-3 font-bold w-12 text-center text-sm text-[#131212]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="px-4 py-3 hover:bg-blue-50 text-[#131212] transition-colors duration-200"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.is_in_stock || addItem.isPending}
                className="flex-1 bg-[#fbb710] text-[#131212] px-6 py-3 rounded-xl hover:bg-[#e5a50f] transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-yellow-200 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
                {addItem.isPending ? 'در حال افزودن...' : 'افزودن به سبد'}
              </button>
            </div>

            {/* Quick info */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-blue-50 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Award size={14} className="text-blue-600" />
                ضمانت اصالت
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp size={14} className="text-blue-600" />
                ارسال سریع
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== REVIEWS ===== */}
      <div className="mt-16">
        <div className="relative mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#131212] flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#fbb710] flex items-center justify-center shadow-lg shadow-yellow-200">
                  <Star size={22} className="text-[#131212]" />
                </span>
                نظرات مشتریان
              </h2>
              <p className="text-blue-500 mr-13 flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block animate-pulse"></span>
                {reviewsList.length} نظر ثبت شده
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-lg font-bold text-[#131212]">
                {product.average_rating || 0}
                <Star size={16} className="text-[#fbb710] fill-[#fbb710]" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#fbb710] to-transparent opacity-30"></div>
        </div>

        {reviewsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-100 rounded-full animate-spin border-t-blue-600"></div>
            </div>
            <p className="text-blue-600 font-medium">بارگذاری نظرات...</p>
          </div>
        ) : reviewsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsList.map((review, idx) => (
              <div
                key={review.id ?? `review-${idx}`}
                className="bg-white rounded-2xl border border-blue-100 p-6 shadow-lg shadow-blue-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slideDown"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                    {review.user?.first_name?.[0] || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#131212]">
                      {review.user?.first_name} {review.user?.last_name}
                    </p>
                    <div className="flex mt-1 gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={`review-${idx}-star-${star}`}
                          size={14}
                          className={
                            star <= review.rating
                              ? 'text-[#fbb710] fill-[#fbb710]'
                              : 'text-gray-200'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(review.created_at).toLocaleDateString('fa-IR')}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-blue-100">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Star size={32} className="text-blue-300" />
            </div>
            <p className="text-gray-400 font-medium">هنوز نظری ثبت نشده</p>
            <p className="text-sm text-gray-300 mt-1">اولین نفری باشید که نظر می‌دهید</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 p-3 rounded-xl text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X size={32} />
          </button>
          <img
            src={images[selectedImage]}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight size={28} />
              </button>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white text-sm font-medium">
                {selectedImage + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}

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
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
import { useReviews } from '@/hooks/useReviews';
import { useCart } from '@/hooks/useCart';
import {
  Heart,
  ShoppingCart,
  Star,
  ArrowRight,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useProduct(slug);
  const { data: reviewsData } = useReviews(slug);
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images =
    product?.images?.length > 0
      ? product.images.map((img) => img.image || img)
      : [product?.thumbnail || '/placeholder-image.jpg'];

  const reviews = reviewsData?.results || reviewsData || [];

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

  if (productError) {
    console.error('Product fetch error:', productError);
    return (
      <div className="text-center py-20">
        <p className="text-lg text-red-500">خطا در بارگذاری محصول</p>
        <p className="text-sm text-gray-500 mt-2">{productError.message}</p>
        <Link
          to="/products"
          className="text-gray-900 underline mt-4 inline-block"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  if (productLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={48} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-500">محصول یافت نشد</p>
        <Link
          to="/products"
          className="text-gray-900 underline mt-2 inline-block"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem.mutate({ product_slug: product.slug, quantity });
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const avgRating = Math.round(product.average_rating || 0);

  return (
    <div className="relative">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/products" className="hover:text-gray-900 transition-colors">
          فروشگاه
        </Link>
        <ArrowRight size={14} />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ===== IMAGE GALLERY ===== */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
              onClick={() => setIsLightboxOpen(true)}
            />

            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ZoomIn size={20} className="text-gray-700" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-70 hover:opacity-100 transition-opacity shadow-md"
                  aria-label="تصویر قبلی"
                >
                  <ChevronLeft size={24} className="text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-70 hover:opacity-100 transition-opacity shadow-md"
                  aria-label="تصویر بعدی"
                >
                  <ChevronRight size={24} className="text-gray-700" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
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
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-gray-900 ring-2 ring-gray-900/20'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} - ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== PRODUCT INFO ===== */}
        <div>
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Rating with number */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={`star-${star}`}
                  size={18}
                  className={
                    star <= avgRating
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {product.average_rating || 0}
            </span>
            <span className="text-sm text-gray-500">
              ({reviews?.length || 0} نظر)
            </span>
          </div>

          {/* Price - English digits, no Toman */}
          <p className="text-3xl font-bold text-gray-900 mb-6">
            {new Intl.NumberFormat('en-US').format(product.price)}
          </p>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Specs - showing all fields */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold mb-3">مشخصات فنی</h3>
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
                { label: 'GPU', value: product.gpu },
                {
                  label: 'GPU آنبرد',
                  value: product.on_board_gpu ? 'دارد' : 'ندارد',
                },
                {
                  label: 'صفحه نمایش',
                  value: `${product.display_size} اینچ ${product.touch_screen ? '(لمسی)' : ''}`,
                },
                {
                  label: 'دسته‌بندی',
                  value: product.category?.name || '-',
                },
                {
                  label: 'موجودی',
                  value: product.stock > 0 ? `${product.stock} عدد` : 'ناموجود',
                  color: product.stock > 0 ? 'text-green-600' : 'text-red-500',
                },
              ].map((spec, idx) => (
                <div key={`spec-${idx}`} className="flex justify-between">
                  <span className="text-gray-500">{spec.label}</span>
                  <span className={spec.color || ''}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <div className="flex gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span className="px-4 py-3 font-medium w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="px-4 py-3 hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addItem.isPending}
              className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              {addItem.isPending ? 'در حال افزودن...' : 'افزودن به سبد'}
            </button>
            <button className="w-14 h-14 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== REVIEWS - Blue background, yellow stars ===== */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">نظرات مشتریان</h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <div
                key={review.id ?? `review-${idx}`}
                className="bg-blue-50 border border-blue-100 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-900">
                    {review.user?.first_name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.user?.first_name || 'کاربر'} {review.user?.last_name || ''}
                    </p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={`review-${idx}-star-${star}`}
                          size={14}
                          className={
                            star <= review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <span className="mr-auto text-sm text-gray-400">
                    {review.created_at
                      ? new Date(review.created_at).toLocaleDateString('fa-IR')
                      : ''}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">هنوز نظری ثبت نشده</p>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:text-gray-300"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X size={32} />
          </button>
          <img
            src={images[selectedImage]}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white/20"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white/20"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
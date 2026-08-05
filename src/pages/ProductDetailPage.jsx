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
      <div className="flex justify-center py-20">
        <Loader2 size={48} className="animate-spin text-amado-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-500">محصول یافت نشد</p>
        <Link
          to="/products"
          className="text-amado-primary underline mt-2 inline-block"
        >
          بازگشت به فروشگاه
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

  return (
    <div className="px-4 lg:px-0 relative">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 uppercase">
        <Link
          to="/products"
          className="hover:text-amado-primary transition-colors"
        >
          فروشگاه
        </Link>
        <ArrowRight size={14} />
        <span className="text-amado-dark">{product.name}</span>
      </nav>

      {/* Feedback toast */}
      {addStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-green-700">
          <CheckCircle size={18} />
          <span>محصول با موفقیت به سبد اضافه شد</span>
        </div>
      )}
      {addStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-red-700">
          <AlertCircle size={18} />
          <span>خطا در افزودن به سبد. لطفاً دوباره تلاش کنید</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* ===== IMAGE GALLERY ===== */}
        <div className="lg:w-1/2 space-y-4">
          <div className="relative aspect-square bg-white overflow-hidden group">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            />

            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ZoomIn size={20} className="text-gray-700" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm opacity-70 hover:opacity-100 transition-opacity shadow-md"
                  aria-label="تصویر قبلی"
                >
                  <ChevronLeft size={24} className="text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm opacity-70 hover:opacity-100 transition-opacity shadow-md"
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
                  className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-amado-primary ring-2 ring-amado-primary/20'
                      : 'border-transparent hover:border-gray-300'
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
          <p className="text-sm text-gray-500 uppercase mb-2">
            {product.brand}
          </p>
          <h1 className="text-3xl text-amado-dark font-normal mb-4">
            {product.name}
          </h1>

          {/* Rating with number */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={`star-${star}`}
                  size={16}
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
              ({reviewsList.length} نظر)
            </span>
          </div>

          {/* Price - English digits, no Toman */}
          <div className="w-[80px] h-[3px] bg-amado-primary mb-4" />
          <p className="text-3xl text-amado-primary font-normal mb-6">
            {new Intl.NumberFormat('en-US').format(product.price)}
          </p>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Specs - showing all fields */}
          <div className="bg-amado-bg p-6 mb-8">
            <h3 className="text-base uppercase text-amado-dark mb-4">
              مشخصات فنی
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
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
                  value: product.is_in_stock ? 'موجود' : 'ناموجود',
                  color: product.is_in_stock ? 'text-green-600' : 'text-red-500',
                },
              ].map((spec, idx) => (
                <div
                  key={`spec-${idx}`}
                  className="flex justify-between border-b border-gray-200 pb-2"
                >
                  <span className="text-gray-500">{spec.label}</span>
                  <span className={`text-amado-dark ${spec.color || ''}`}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <div className="flex gap-4 mb-8">
            <div className="flex items-center border border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 hover:bg-amado-bg text-amado-dark"
              >
                -
              </button>
              <span className="px-4 py-3 font-medium w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="px-4 py-3 hover:bg-amado-bg text-amado-dark"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.is_in_stock || addItem.isPending}
              className="flex-1 amado-btn text-base flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              {addItem.isPending ? 'در حال افزودن...' : 'افزودن به سبد'}
            </button>
            <button className="w-14 h-14 border border-gray-200 flex items-center justify-center hover:bg-amado-bg transition-colors">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== REVIEWS - Blue background, yellow stars ===== */}
      <div className="mt-16">
        <div className="w-[80px] h-[3px] bg-amado-primary mb-6" />
        <h2 className="text-2xl text-amado-dark font-normal mb-8">
          نظرات مشتریان
        </h2>

        {reviewsLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={32} className="animate-spin text-amado-primary" />
          </div>
        ) : reviewsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {reviewsList.map((review, idx) => (
              <div
                key={review.id ?? `review-${idx}`}
                className="bg-blue-50 border border-blue-100 p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-200 flex items-center justify-center text-sm font-bold text-blue-900">
                    {review.user?.first_name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-amado-dark">
                      {review.user?.first_name} {review.user?.last_name}
                    </p>
                    <div className="flex mt-1">
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
                    {new Date(review.created_at).toLocaleDateString('fa-IR')}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
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
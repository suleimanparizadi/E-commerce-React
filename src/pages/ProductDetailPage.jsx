import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useReviews } from '../hooks/useReviews';
import { useCart } from '../hooks/useCart';
import { ArrowRight, Loader2, Star, ShoppingCart, Heart } from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, isLoading: productLoading } = useProduct(slug);
  const { reviews } = useReviews(slug);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

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
        <Link to="/products" className="text-amado-primary underline mt-2 inline-block">
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem.mutate({ product_slug: product.slug, quantity });
  };

  const images = product.images?.length > 0
    ? product.images.map((img) => img.image)
    : [product.thumbnail];

  // Get reviews data safely
  const reviewsList = Array.isArray(reviews.data) ? reviews.data : [];
  const reviewsLoading = reviews.isLoading;

  return (
    <div className="px-4 lg:px-0">
      {/* Breadcrumb - Amado Style */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 uppercase">
        <Link to="/products" className="hover:text-amado-primary">فروشگاه</Link>
        <ArrowRight size={14} />
        <span className="text-amado-dark">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Images - Amado Style */}
        <div className="lg:w-1/2">
          <div className="aspect-square bg-white overflow-hidden mb-4">
            <img
              src={images[selectedImage] || product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 overflow-hidden border-2 ${
                    selectedImage === idx ? 'border-amado-primary' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info - Amado Style */}
        <div className="lg:w-1/2">
          <p className="text-sm text-gray-500 uppercase mb-2">{product.brand}</p>
          <h1 className="text-3xl text-amado-dark font-normal mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={
                    star <= Math.round(product.average_rating || 0)
                      ? 'text-amado-primary fill-amado-primary'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({reviewsList.length} نظر)
            </span>
          </div>

          {/* Price - Amado Style */}
          <div className="w-[80px] h-[3px] bg-amado-primary mb-4" />
          <p className="text-3xl text-amado-primary font-normal mb-6">
            {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
          </p>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

          {/* Specs */}
          <div className="bg-amado-bg p-6 mb-8">
            <h3 className="text-base uppercase text-amado-dark mb-4">مشخصات فنی</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">پردازنده</span>
                <span className="text-amado-dark">{product.cpu?.manufacturer} {product.cpu?.series}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">RAM</span>
                <span className="text-amado-dark">{product.ram}GB</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">حافظه</span>
                <span className="text-amado-dark">{product.storage >= 1024 ? `${product.storage / 1024}TB` : `${product.storage}GB`}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">GPU</span>
                <span className="text-amado-dark">{product.gpu}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">صفحه نمایش</span>
                <span className="text-amado-dark">{product.display_size} اینچ {product.touch_screen ? '(لمسی)' : ''}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">موجودی</span>
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                  {product.stock > 0 ? `${product.stock} عدد` : 'ناموجود'}
                </span>
              </div>
            </div>
          </div>

          {/* Add to cart - Amado Style */}
          <div className="flex gap-4 mb-8">
            <div className="flex items-center border border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 hover:bg-amado-bg text-amado-dark"
              >
                -
              </button>
              <span className="px-4 py-3 font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="px-4 py-3 hover:bg-amado-bg text-amado-dark"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addItem.isPending}
              className="flex-1 amado-btn text-base flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart size={18} />
              افزودن به سبد
            </button>
            <button className="w-14 h-14 border border-gray-200 flex items-center justify-center hover:bg-amado-bg transition-colors">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews section - Amado Style */}
      <div className="mt-16">
        <div className="w-[80px] h-[3px] bg-amado-primary mb-6" />
        <h2 className="text-2xl text-amado-dark font-normal mb-8">نظرات مشتریان</h2>
        
        {reviewsLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={32} className="animate-spin text-amado-primary" />
          </div>
        ) : reviewsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {reviewsList.map((review) => (
              <div key={review.id} className="bg-white border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amado-bg flex items-center justify-center text-sm font-bold text-amado-dark">
                    {review.user.first_name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-amado-dark">{review.user.first_name} {review.user.last_name}</p>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={
                            star <= review.rating
                              ? 'text-amado-primary fill-amado-primary'
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
                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">هنوز نظری ثبت نشده</p>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
import { useReviews } from '@/hooks/useReviews';
import { useCart } from '@/hooks/useCart';
import { Heart, ShoppingCart, Star, ArrowRight, Loader2 } from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, isLoading: productLoading } = useProduct(slug);
  const { data: reviews } = useReviews(slug).reviews;
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

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
        <Link to="/products" className="text-gray-900 underline mt-2 inline-block">
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

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/products" className="hover:text-gray-900">فروشگاه</Link>
        <ArrowRight size={14} />
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
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
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx ? 'border-gray-900' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={
                    star <= Math.round(product.average_rating || 0)
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({reviews?.length || 0} نظر)
            </span>
          </div>

          {/* Price */}
          <p className="text-3xl font-bold text-gray-900 mb-6">
            {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
          </p>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Specs */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold mb-3">مشخصات فنی</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">پردازنده</span>
                <span>{product.cpu?.manufacturer} {product.cpu?.series}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">RAM</span>
                <span>{product.ram}GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">حافظه</span>
                <span>{product.storage >= 1024 ? `${product.storage / 1024}TB` : `${product.storage}GB`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">GPU</span>
                <span>{product.gpu}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">صفحه نمایش</span>
                <span>{product.display_size} اینچ {product.touch_screen ? '(لمسی)' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">موجودی</span>
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                  {product.stock > 0 ? `${product.stock} عدد` : 'ناموجود'}
                </span>
              </div>
            </div>
          </div>

          {/* Add to cart */}
          <div className="flex gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-3 font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="px-4 py-3 hover:bg-gray-100"
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
              افزودن به سبد
            </button>
            <button className="w-14 h-14 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">نظرات مشتریان</h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">
                    {review.user.first_name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{review.user.first_name} {review.user.last_name}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={
                            star <= review.rating
                              ? 'text-amber-500 fill-amber-500'
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
                <p className="text-gray-600">{review.comment}</p>
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
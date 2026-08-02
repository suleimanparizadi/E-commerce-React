import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { ArrowRight, Package, Calendar, MapPin, Hash, Loader2 } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_LABELS = {
  pending: 'در انتظار',
  processing: 'در حال پردازش',
  shipped: 'ارسال شده',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { useOrder } = useOrders();
  const { data: order, isLoading } = useOrder(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={48} className="animate-spin text-amado-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-500">سفارش یافت نشد</p>
        <Link to="/orders" className="text-amado-primary underline mt-2 inline-block">
          بازگشت به سفارشات
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 uppercase">
        <Link to="/orders" className="hover:text-amado-primary">سفارشات</Link>
        <ArrowRight size={14} />
        <span className="text-amado-dark">سفارش #{order.id}</span>
      </div>

      <div className="w-[80px] h-[3px] bg-amado-primary mb-4" />
      <h1 className="text-3xl text-amado-dark font-normal mb-8">جزئیات سفارش</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Order info */}
        <div className="flex-1 space-y-6">
          {/* Status card */}
          <div className="bg-white border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amado-bg flex items-center justify-center">
                  <Package size={24} className="text-amado-dark" />
                </div>
                <div>
                  <p className="font-bold text-amado-dark">سفارش #{order.id}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Calendar size={14} />
                    {new Date(order.created_at).toLocaleDateString('fa-IR')}
                  </div>
                </div>
              </div>
              <span className={`px-4 py-2 text-sm font-normal uppercase ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white border border-gray-100 p-8">
            <h2 className="text-lg text-amado-dark font-normal mb-6 uppercase">کالاها</h2>
            <div className="space-y-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <Link to={`/products/${item.product.slug}`} className="shrink-0">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover bg-gray-50"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="text-base text-amado-dark hover:text-amado-primary transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{item.product.brand}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-500">
                        {item.quantity} عدد
                      </span>
                      <div className="text-left">
                        <p className="text-sm text-gray-400 line-through">
                          {new Intl.NumberFormat('fa-IR').format(item.product.price)} تومان
                        </p>
                        <p className="text-xl text-amado-primary font-normal">
                          {new Intl.NumberFormat('fa-IR').format(item.price_at_purchase)} تومان
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping info */}
          <div className="bg-white border border-gray-100 p-8">
            <h2 className="text-lg text-amado-dark font-normal mb-6 flex items-center gap-2 uppercase">
              <MapPin size={20} />
              آدرس تحویل
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-4">
                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-500 uppercase text-xs mb-1">آدرس</p>
                  <p className="text-amado-dark">{order.shipping_address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Hash size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-500 uppercase text-xs mb-1">کد پستی</p>
                  <p className="text-amado-dark">{order.shipping_postal_code}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-500 uppercase text-xs mb-1">شهر</p>
                  <p className="text-amado-dark">{order.shipping_city}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white border border-gray-100 p-8 sticky top-6">
            <h2 className="text-lg text-amado-dark font-normal mb-6 uppercase">خلاصه فاکتور</h2>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">تعداد کالا</span>
                <span>{order.items.reduce((sum, i) => sum + i.quantity, 0)} عدد</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">مجموع</span>
                <span>
                  {new Intl.NumberFormat('fa-IR').format(
                    order.items.reduce((sum, i) => sum + i.price_at_purchase * i.quantity, 0)
                  )} تومان
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">حمل و نقل</span>
                <span className="text-green-600">رایگان</span>
              </div>
            </div>

            <div className="w-full h-[2px] bg-gray-100 mb-6" />

            <div className="flex justify-between font-bold text-lg">
              <span>مبلغ پرداخت شده</span>
              <span className="text-amado-primary">{new Intl.NumberFormat('fa-IR').format(order.total_amount)} تومان</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
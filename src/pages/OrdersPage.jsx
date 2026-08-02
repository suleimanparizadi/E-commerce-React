import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { Package, ArrowRight, Loader2, Calendar, MapPin } from 'lucide-react';

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

export default function OrdersPage() {
  const { orders } = useOrders();

  if (orders.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={48} className="animate-spin text-amado-primary" />
      </div>
    );
  }

  if (!orders.data || orders.data.length === 0) {
    return (
      <div className="text-center py-20">
        <Package size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-amado-dark mb-2">سفارشی ثبت نشده</h2>
        <p className="text-gray-500 mb-6">اولین سفارش خود را ثبت کنید</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 amado-btn text-base"
        >
          <ArrowRight size={18} />
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-0">
      <div className="w-[80px] h-[3px] bg-amado-primary mb-4" />
      <h1 className="text-3xl text-amado-dark font-normal mb-8">سفارشات من</h1>

      <div className="space-y-0">
        {orders.data.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="block bg-white border border-gray-100 p-8 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
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

              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 text-sm font-normal uppercase ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
                <span className="text-xl text-amado-primary font-normal">
                  {new Intl.NumberFormat('fa-IR').format(order.total_amount)} تومان
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-100 pt-4">
              <MapPin size={14} />
              <span>{order.shipping_city} — {order.shipping_address}</span>
            </div>

            <div className="flex gap-2 mt-4">
              {order.items.slice(0, 3).map((item, idx) => (
                <img
                  key={idx}
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  className="w-14 h-14 object-cover bg-gray-50"
                />
              ))}
              {order.items.length > 3 && (
                <div className="w-14 h-14 bg-amado-bg flex items-center justify-center text-sm text-gray-500">
                  +{order.items.length - 3}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
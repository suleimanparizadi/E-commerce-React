import { Link } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
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
        <Loader2 size={48} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!orders.data || orders.data.length === 0) {
    return (
      <div className="text-center py-20">
        <Package size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">سفارشی ثبت نشده</h2>
        <p className="text-gray-500 mb-6">اولین سفارش خود را ثبت کنید</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <ArrowRight size={18} />
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">سفارشات من</h1>

      <div className="space-y-4">
        {orders.data.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="block bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">سفارش #{order.id}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Calendar size={14} />
                    {new Date(order.created_at).toLocaleDateString('fa-IR')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
                <span className="font-bold text-lg">
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
                  className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                />
              ))}
              {order.items.length > 3 && (
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">
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
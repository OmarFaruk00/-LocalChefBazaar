import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';

type Order = {
  _id: string;
  mealName: string;
  orderStatus: 'pending' | 'accepted' | 'cancelled' | 'delivered';
  price: number;
  quantity: number;
  orderTime: string;
  chefName: string;
  chefId: string;
  paymentStatus: 'pending' | 'paid';
};

function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    document.title = 'My Orders - LocalChefBazaar';
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.orders || []);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handlePay = async (order: Order) => {
    try {
      const totalPrice = order.price * order.quantity;
      const res = await api.post('/payments/checkout', {
        orderId: order._id,
        amount: totalPrice,
      });
      // In a real implementation, redirect to Stripe checkout
      // For now, simulate payment success
      await api.post('/payments/success', {
        orderId: order._id,
        amount: totalPrice,
      });
      Swal.fire('Payment successful!', '', 'success');
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? { ...o, paymentStatus: 'paid' as const } : o))
      );
    } catch (error) {
      toast.error('Payment failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold text-slate-900">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-slate-600">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">{order.mealName}</p>
                <p className="text-xs text-slate-500">
                  Chef: {order.chefName} · {order.chefId}
                </p>
                <p className="text-xs text-slate-500">
                  Delivery: {new Date(order.orderTime).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 capitalize">Status: {order.orderStatus}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-orange-600">
                  ${order.price} x {order.quantity} = ${order.price * order.quantity}
                </p>
                <p className="text-xs text-slate-500 capitalize">Payment: {order.paymentStatus}</p>
                {order.paymentStatus === 'pending' && order.orderStatus === 'accepted' && (
                  <button
                    onClick={() => handlePay(order)}
                    className="mt-2 rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Pay
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;


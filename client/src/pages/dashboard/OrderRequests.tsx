import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

type Order = {
  _id: string;
  mealName: string;
  price: number;
  quantity: number;
  orderStatus: 'pending' | 'accepted' | 'cancelled' | 'delivered';
  userEmail: string;
  orderTime: string;
  userAddress: string;
  paymentStatus: 'pending' | 'paid';
};

function OrderRequests() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Order Requests - LocalChefBazaar';
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/chef');
        setOrders(res.data.orders || []);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: status as any } : o))
      );
      toast.success(`Order ${status} successfully`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const canCancel = (order: Order) => order.orderStatus === 'pending';
  const canAccept = (order: Order) => order.orderStatus === 'pending';
  const canDeliver = (order: Order) => order.orderStatus === 'accepted';

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold text-slate-900">Order Requests</h1>
      {orders.length === 0 ? (
        <p className="text-center text-slate-600">No order requests yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">{order.mealName}</p>
                <p className="text-xs text-slate-500">
                  Qty: {order.quantity} · Price: ${order.price} · Total: ${order.price * order.quantity}
                </p>
                <p className="text-xs text-slate-500">User: {order.userEmail}</p>
                <p className="text-xs text-slate-500">Address: {order.userAddress}</p>
                <p className="text-xs text-slate-500">
                  Time: {new Date(order.orderTime).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 capitalize">Status: {order.orderStatus}</p>
                <p className="text-xs text-slate-500 capitalize">Payment: {order.paymentStatus}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateOrderStatus(order._id, 'cancelled')}
                  disabled={!canCancel(order)}
                  className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateOrderStatus(order._id, 'accepted')}
                  disabled={!canAccept(order)}
                  className="rounded-lg border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateOrderStatus(order._id, 'delivered')}
                  disabled={!canDeliver(order)}
                  className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Deliver
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderRequests;


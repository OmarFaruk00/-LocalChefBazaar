import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

type Stats = {
  totalPayment: number;
  totalUsers: number;
  ordersPending: number;
  ordersDelivered: number;
};

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6'];

function PlatformStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Platform Statistics - LocalChefBazaar';
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/platform');
        setStats(res.data);
      } catch (error) {
        toast.error('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-center text-slate-600">Failed to load statistics</p>;
  }

  const orderData = [
    { name: 'Pending', value: stats.ordersPending },
    { name: 'Delivered', value: stats.ordersDelivered },
  ];

  const paymentData = [
    { name: 'Total Payments', amount: stats.totalPayment },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Platform Statistics</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase text-slate-500">Total Payments</p>
          <p className="text-2xl font-bold text-slate-900">${stats.totalPayment.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase text-slate-500">Total Users</p>
          <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase text-slate-500">Orders Pending</p>
          <p className="text-2xl font-bold text-slate-900">{stats.ordersPending}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs uppercase text-slate-500">Orders Delivered</p>
          <p className="text-2xl font-bold text-slate-900">{stats.ordersDelivered}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Orders Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Payment Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="amount" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default PlatformStats;


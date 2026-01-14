import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

type User = {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'chef' | 'admin';
  status: 'active' | 'fraud';
};

function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Manage Users - LocalChefBazaar';
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data.users || []);
      } catch (error) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleMakeFraud = async (userId: string) => {
    const result = await Swal.fire({
      title: 'Mark as fraud?',
      text: 'This user will be flagged as fraud and restricted.',
      showCancelButton: true,
      confirmButtonText: 'Mark as Fraud',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/users/${userId}/fraud`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: 'fraud' as const } : u))
        );
        toast.success('User marked as fraud');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to mark user as fraud');
      }
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
      <h1 className="text-xl font-semibold text-slate-900">Manage Users</h1>
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-3 font-semibold text-slate-800">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3 text-slate-600 capitalize">{user.role}</td>
                <td className="px-4 py-3 text-slate-600 capitalize">{user.status}</td>
                <td className="px-4 py-3">
                  {user.role !== 'admin' && user.status !== 'fraud' && (
                    <button
                      onClick={() => handleMakeFraud(user._id)}
                      className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                    >
                      Make Fraud
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;


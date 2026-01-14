import { useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

function Profile() {
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    document.title = 'Profile - LocalChefBazaar';
  }, []);

  const handleBeChef = async () => {
    if (!user) return;
    try {
      await api.post('/requests', { requestType: 'chef' });
      Swal.fire('Request submitted!', 'Your request to become a chef has been sent to admin.', 'success');
    } catch (error) {
      toast.error('Failed to submit request');
    }
  };

  const handleBeAdmin = async () => {
    if (!user) return;
    try {
      await api.post('/requests', { requestType: 'admin' });
      Swal.fire('Request submitted!', 'Your request to become an admin has been sent.', 'success');
    } catch (error) {
      toast.error('Failed to submit request');
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">My Profile</h1>
      {user?.photoURL && (
        <div className="mt-4 flex justify-center">
          <img src={user.photoURL} alt={user.name} className="h-24 w-24 rounded-full object-cover" />
        </div>
      )}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Name</p>
          <p className="text-sm font-semibold text-slate-800">{user?.name || 'N/A'}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Email</p>
          <p className="text-sm font-semibold text-slate-800">{user?.email || 'N/A'}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Address</p>
          <p className="text-sm font-semibold text-slate-800">{user?.address || 'N/A'}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Role</p>
          <p className="text-sm font-semibold text-slate-800 capitalize">{user?.role || 'user'}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Status</p>
          <p className="text-sm font-semibold text-slate-800 capitalize">{user?.status || 'active'}</p>
        </div>
        {user?.chefId && (
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Chef ID</p>
            <p className="text-sm font-semibold text-slate-800">{user.chefId}</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex gap-3">
        {user?.role !== 'chef' && user?.role !== 'admin' && (
          <button
            onClick={handleBeChef}
            className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Be a Chef
          </button>
        )}
        {user?.role !== 'admin' && (
          <button
            onClick={handleBeAdmin}
            className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Be an Admin
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;


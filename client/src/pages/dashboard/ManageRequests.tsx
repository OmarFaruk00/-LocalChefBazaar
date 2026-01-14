import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

type Request = {
  _id: string;
  userName: string;
  userEmail: string;
  requestType: 'chef' | 'admin';
  requestStatus: 'pending' | 'approved' | 'rejected';
  requestTime: string;
};

function ManageRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Manage Requests - LocalChefBazaar';
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/requests');
        setRequests(res.data.requests || []);
      } catch (error) {
        toast.error('Failed to load requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    try {
      await api.patch(`/requests/${requestId}`, { action: 'accept' });
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, requestStatus: 'approved' as const } : r))
      );
      Swal.fire('Request approved!', 'The user role has been updated.', 'success');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleReject = async (requestId: string) => {
    const result = await Swal.fire({
      title: 'Reject this request?',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/requests/${requestId}`, { action: 'reject' });
        setRequests((prev) =>
          prev.map((r) => (r._id === requestId ? { ...r, requestStatus: 'rejected' as const } : r))
        );
        Swal.fire('Request rejected', '', 'info');
      } catch (error) {
        toast.error('Failed to reject request');
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
      <h1 className="text-xl font-semibold text-slate-900">Manage Requests</h1>
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">User Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Request Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Request Time</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-600">
                  No requests found
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id} className="border-t">
                  <td className="px-4 py-3 font-semibold text-slate-800">{req.userName}</td>
                  <td className="px-4 py-3 text-slate-600">{req.userEmail}</td>
                  <td className="px-4 py-3 text-slate-600 capitalize">{req.requestType}</td>
                  <td className="px-4 py-3 text-slate-600 capitalize">{req.requestStatus}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(req.requestTime).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {req.requestStatus === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(req._id)}
                          className="rounded-lg border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-green-600 hover:bg-green-100"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(req._id)}
                          className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 capitalize">{req.requestStatus}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageRequests;


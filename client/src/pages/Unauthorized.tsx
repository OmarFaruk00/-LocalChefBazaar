import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
  useEffect(() => {
    document.title = 'Unauthorized - LocalChefBazaar';
  }, []);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow">
        <p className="text-sm font-semibold text-orange-600">Access denied</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Unauthorized</h1>
        <p className="mt-2 text-sm text-slate-600">You do not have permission to view this page.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;









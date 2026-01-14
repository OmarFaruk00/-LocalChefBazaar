import { useEffect } from 'react';

function LoadingPage() {
  useEffect(() => {
    document.title = 'Loading - LocalChefBazaar';
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
    </div>
  );
}

export default LoadingPage;









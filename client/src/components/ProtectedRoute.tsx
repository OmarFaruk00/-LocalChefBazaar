import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../features/auth/authSlice';
import LoadingPage from '../pages/LoadingPage';

type Props = {
  allowedRoles?: Array<'user' | 'chef' | 'admin'>;
};

function ProtectedRoute({ allowedRoles }: Props) {
  const user = useAppSelector((s) => s.auth.user);
  const [loading, setLoading] = useState(!user);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.user) {
            dispatch(setCredentials({ user: res.data.user, token: '' }));
          }
        } catch (error) {
          // Not authenticated
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [user, dispatch]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;









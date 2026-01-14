import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import api from '../lib/axios';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCredentials, clearCredentials } from '../features/auth/authSlice';
import LoadingPage from '../pages/LoadingPage';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    // If Firebase auth is not configured, skip auth state listener
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !user) {
        try {
          const res = await api.post('/auth/login', {
            email: firebaseUser.email,
            name: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            address: '',
          });
          dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
        } catch (error) {
          console.error('Auth sync failed', error);
        }
      } else if (!firebaseUser && user) {
        dispatch(clearCredentials());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch, user]);

  if (loading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
}


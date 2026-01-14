import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import api from '../../lib/axios';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCredentials } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

type LoginForm = {
  email: string;
  password: string;
};

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    document.title = 'Login - LocalChefBazaar';
  }, []);

  useEffect(() => {
    if (user) {
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    }
  }, [user, navigate, location]);

  const onSubmit = async (data: LoginForm) => {
    if (!auth) {
      toast.error('Firebase is not configured. Please set up your environment variables.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const res = await api.post('/auth/login', {
        email: userCredential.user.email,
        name: userCredential.user.displayName || '',
        photoURL: userCredential.user.photoURL || '',
        address: '',
      });
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      toast.success('Login successful!');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col-reverse items-center gap-10 px-4 py-12 md:flex-row">
      <div className="flex-1">
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Login with your email and password.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-xs text-red-500">Email required</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-500">Password required</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          No account?{' '}
          <Link to="/register" className="font-semibold text-orange-600">
            Register
          </Link>
        </p>
      </div>
      <div className="flex-1">
        <div className="aspect-square rounded-3xl bg-gradient-to-br from-orange-200 to-amber-100" />
      </div>
    </div>
  );
}

export default Login;









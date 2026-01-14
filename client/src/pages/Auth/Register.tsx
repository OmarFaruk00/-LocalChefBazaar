import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import api from '../../lib/axios';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  photoURL: string;
};

function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = 'Register - LocalChefBazaar';
  }, []);

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!auth) {
      toast.error('Firebase is not configured. Please set up your environment variables.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, {
        displayName: data.name,
        photoURL: data.photoURL,
      });
      const res = await api.post('/auth/login', {
        email: data.email,
        name: data.name,
        photoURL: data.photoURL,
        address: data.address,
      });
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-10 px-4 py-12 md:flex-row">
      <div className="flex-1">
        <h1 className="text-3xl font-semibold text-slate-900">Create account</h1>
        <p className="mt-2 text-sm text-slate-600">Register as a customer; role defaults to user.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input
              {...register('name', { required: true })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Your name"
            />
            {errors.name && <p className="text-xs text-red-500">Name required</p>}
          </div>
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
              {...register('password', { required: true, minLength: 6 })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-500">Min 6 characters</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: true,
                validate: (val) => val === watch('password'),
              })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-xs text-red-500">Passwords must match</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Photo URL</label>
            <input
              {...register('photoURL', { required: true })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="https://..."
            />
            {errors.photoURL && <p className="text-xs text-red-500">Photo is required</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-slate-700">Address</label>
            <input
              {...register('address', { required: true })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Full address"
            />
            {errors.address && <p className="text-xs text-red-500">Address required</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-orange-600">
            Login
          </Link>
        </p>
      </div>
      <div className="flex-1">
        <div className="aspect-square rounded-3xl bg-gradient-to-br from-orange-200 to-amber-100" />
      </div>
    </div>
  );
}

export default Register;









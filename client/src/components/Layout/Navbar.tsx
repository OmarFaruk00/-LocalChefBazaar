import { Link, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { clearCredentials } from '../../features/auth/authSlice';
import { auth } from '../../lib/firebase';
import toast from 'react-hot-toast';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium ${isActive ? 'text-orange-600' : 'text-slate-700 hover:text-orange-600'}`;

function Navbar() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      dispatch(clearCredentials());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600" />
          <div>
            <p className="text-base font-bold text-slate-800">LocalChefBazaar</p>
            <p className="text-[11px] text-slate-500">Homemade meals, nearby</p>
          </div>
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/meals" className={navLinkClass}>
            Meals
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {!user && (
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Link to="/login" className="rounded-full border px-4 py-2 text-slate-800">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-slate-900 px-4 py-2 text-white">
                Register
              </Link>
            </div>
          )}
          {user && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Logout
              </button>
              <div className="flex items-center gap-2 rounded-full border px-2 py-1">
                <img
                  src={user.photoURL || 'https://i.pravatar.cc/40'}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-xs font-medium text-slate-700">{user.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;









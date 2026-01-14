import { NavLink, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-semibold ${
    isActive ? 'bg-orange-100 text-orange-700' : 'text-slate-700 hover:bg-slate-100'
  }`;

function DashboardLayout() {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[240px,1fr]">
      <aside className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
          <p className="text-xs text-slate-500">{user?.email || 'email@example.com'}</p>
          <p className="text-xs text-slate-500 capitalize">Role: {user?.role || 'user'}</p>
        </div>
        <div className="mt-4 space-y-1">
          <NavLink to="/dashboard/profile" className={linkClass}>
            My Profile
          </NavLink>
          <NavLink to="/dashboard/orders" className={linkClass}>
            My Orders
          </NavLink>
          <NavLink to="/dashboard/reviews" className={linkClass}>
            My Reviews
          </NavLink>
          <NavLink to="/dashboard/favorites" className={linkClass}>
            Favorite Meals
          </NavLink>
          {user?.role === 'chef' && (
            <>
              <NavLink to="/dashboard/create-meal" className={linkClass}>
                Create Meal
              </NavLink>
              <NavLink to="/dashboard/my-meals" className={linkClass}>
                My Meals
              </NavLink>
              <NavLink to="/dashboard/order-requests" className={linkClass}>
                Order Requests
              </NavLink>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <NavLink to="/dashboard/manage-users" className={linkClass}>
                Manage Users
              </NavLink>
              <NavLink to="/dashboard/manage-requests" className={linkClass}>
                Manage Requests
              </NavLink>
              <NavLink to="/dashboard/platform-stats" className={linkClass}>
                Platform Statistics
              </NavLink>
            </>
          )}
        </div>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
}

export default DashboardLayout;









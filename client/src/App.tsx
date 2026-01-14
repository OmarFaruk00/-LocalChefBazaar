import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './components/AuthProvider';
import Layout from './components/Layout/Layout';
import DashboardLayout from './components/Layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Meals from './pages/Meals';
import MealDetails from './pages/MealDetails';
import Order from './pages/Order';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import LoadingPage from './pages/LoadingPage';
import ErrorPage from './pages/ErrorPage';
import Unauthorized from './pages/Unauthorized';
import Profile from './pages/dashboard/Profile';
import MyOrders from './pages/dashboard/MyOrders';
import MyReviews from './pages/dashboard/MyReviews';
import Favorites from './pages/dashboard/Favorites';
import CreateMeal from './pages/dashboard/CreateMeal';
import MyMeals from './pages/dashboard/MyMeals';
import OrderRequests from './pages/dashboard/OrderRequests';
import ManageUsers from './pages/dashboard/ManageUsers';
import ManageRequests from './pages/dashboard/ManageRequests';
import PlatformStats from './pages/dashboard/PlatformStats';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/meals" element={<Meals />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/meals/:id" element={<MealDetails />} />
            <Route path="/order/:id" element={<Order />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard/profile" replace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="reviews" element={<MyReviews />} />
              <Route path="favorites" element={<Favorites />} />
              <Route element={<ProtectedRoute allowedRoles={['chef']} />}>
                <Route path="create-meal" element={<CreateMeal />} />
                <Route path="my-meals" element={<MyMeals />} />
                <Route path="order-requests" element={<OrderRequests />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="manage-users" element={<ManageUsers />} />
                <Route path="manage-requests" element={<ManageRequests />} />
                <Route path="platform-stats" element={<PlatformStats />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      </AuthProvider>
    </Provider>
  );
}

export default App;


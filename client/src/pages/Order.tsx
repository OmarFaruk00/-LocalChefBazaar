import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '../store/hooks';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

type OrderForm = {
  quantity: number;
  userAddress: string;
};

type Meal = {
  _id: string;
  foodName: string;
  chefName: string;
  chefId: string;
  price: number;
};

function Order() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderForm>({
    defaultValues: {
      quantity: 1,
      userAddress: user?.address || '',
    },
  });

  useEffect(() => {
    document.title = 'Order - LocalChefBazaar';
  }, []);

  useEffect(() => {
    const fetchMeal = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.get(`/meals/${id}`);
        setMeal(res.data.meal);
      } catch (error) {
        toast.error('Failed to load meal');
        navigate('/meals');
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id, navigate]);

  const onSubmit = async (data: OrderForm) => {
    if (!meal || !user) return;
    const totalPrice = meal.price * data.quantity;

    const result = await Swal.fire({
      title: `Your total price is $${totalPrice}.`,
      text: 'Do you want to confirm the order?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await api.post('/orders', {
          foodId: meal._id,
          mealName: meal.foodName,
          price: meal.price,
          quantity: data.quantity,
          chefId: meal.chefId,
          userAddress: data.userAddress,
        });
        Swal.fire('Order placed successfully!', '', 'success');
        navigate('/dashboard/orders');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to place order');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <p className="text-center text-slate-600">Meal not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Confirm Order</h1>
      <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">Meal Name</p>
            <p className="text-lg font-semibold text-slate-900">{meal.foodName}</p>
          </div>
          <p className="text-xl font-semibold text-orange-600">${meal.price}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-slate-600">Chef: {meal.chefName} ({meal.chefId})</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Price (auto-filled)</label>
          <input type="text" value={`$${meal.price}`} disabled className="mt-1 w-full rounded-lg border bg-slate-50 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Quantity</label>
          <input
            type="number"
            min={1}
            {...register('quantity', { required: true, valueAsNumber: true, min: 1 })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
          {errors.quantity && <p className="text-xs text-red-500">Enter at least 1</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Delivery Address</label>
          <textarea
            {...register('userAddress', { required: true })}
            placeholder="Enter delivery address"
            rows={3}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
          {errors.userAddress && <p className="text-xs text-red-500">Address is required</p>}
        </div>
        <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Confirm Order
        </button>
      </form>
    </div>
  );
}

export default Order;


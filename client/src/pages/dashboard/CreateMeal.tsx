import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '../../store/hooks';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

type MealForm = {
  foodName: string;
  chefName: string;
  price: number;
  rating: number;
  ingredients: string;
  estimatedDeliveryTime: string;
  chefExperience: string;
  chefId: string;
  foodImage: string;
  deliveryArea?: string;
};

function CreateMeal() {
  const user = useAppSelector((s) => s.auth.user);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<MealForm>({
    defaultValues: {
      rating: 0,
      chefName: user?.name || '',
      chefId: user?.chefId || '',
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Create Meal - LocalChefBazaar';
  }, []);

  const onSubmit = async (data: MealForm) => {
    if (!user?.chefId) {
      toast.error('You need to be a chef to create meals');
      return;
    }
    setLoading(true);
    try {
      const ingredientsArray = data.ingredients.split(',').map((i) => i.trim()).filter(Boolean);
      await api.post('/meals', {
        foodName: data.foodName,
        chefName: data.chefName,
        chefId: data.chefId,
        price: data.price,
        rating: data.rating,
        ingredients: ingredientsArray,
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience: data.chefExperience,
        foodImage: data.foodImage,
        deliveryArea: data.deliveryArea,
      });
      toast.success('Meal created successfully!');
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Create Meal</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Food Name</label>
          <input
            {...register('foodName', { required: true })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="e.g., Chicken Biriyani"
          />
          {errors.foodName && <p className="text-xs text-red-500">Required</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Chef Name</label>
          <input
            {...register('chefName', { required: true })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            readOnly
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Price</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { required: true, valueAsNumber: true, min: 0 })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="0.00"
          />
          {errors.price && <p className="text-xs text-red-500">Required</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Rating (0-5)</label>
          <input
            type="number"
            step="0.1"
            min={0}
            max={5}
            {...register('rating', { required: true, valueAsNumber: true })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="0"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-slate-700">Ingredients (comma separated)</label>
          <textarea
            {...register('ingredients', { required: true })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            rows={3}
            placeholder="Chicken, Rice, Spices, Onion"
          />
          {errors.ingredients && <p className="text-xs text-red-500">Required</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Estimated Delivery Time</label>
          <input
            {...register('estimatedDeliveryTime', { required: true })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="e.g., 30 minutes"
          />
          {errors.estimatedDeliveryTime && <p className="text-xs text-red-500">Required</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Chef Experience</label>
          <input
            {...register('chefExperience', { required: true })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="e.g., 5 years of experience"
          />
          {errors.chefExperience && <p className="text-xs text-red-500">Required</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Chef ID</label>
          <input
            {...register('chefId', { required: true })}
            className="mt-1 w-full rounded-lg border bg-slate-50 px-3 py-2 text-sm"
            readOnly
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Delivery Area (optional)</label>
          <input
            {...register('deliveryArea')}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="e.g., Dhaka"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Food Image URL</label>
          <input
            {...register('foodImage', { required: true })}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="https://example.com/image.jpg"
          />
          {errors.foodImage && <p className="text-xs text-red-500">Required</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Meal'}
        </button>
      </form>
    </div>
  );
}

export default CreateMeal;


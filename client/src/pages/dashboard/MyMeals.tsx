import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

type Meal = {
  _id: string;
  foodName: string;
  foodImage: string;
  price: number;
  rating: number;
  ingredients: string[];
  estimatedDeliveryTime: string;
  chefName: string;
  chefId: string;
};

type MealForm = {
  foodName: string;
  price: number;
  rating: number;
  ingredients: string;
  estimatedDeliveryTime: string;
  foodImage: string;
  deliveryArea?: string;
};

function MyMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MealForm>();

  useEffect(() => {
    document.title = 'My Meals - LocalChefBazaar';
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await api.get('/meals/mine');
        setMeals(res.data.meals || []);
      } catch (error) {
        toast.error('Failed to load meals');
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete this meal?',
      text: 'This action cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/meals/${id}`);
        setMeals((prev) => prev.filter((m) => m._id !== id));
        toast.success('Meal deleted successfully');
      } catch (error) {
        toast.error('Failed to delete meal');
      }
    }
  };

  const handleUpdate = (meal: Meal) => {
    setEditingId(meal._id);
    setValue('foodName', meal.foodName);
    setValue('price', meal.price);
    setValue('rating', meal.rating);
    setValue('ingredients', meal.ingredients.join(', '));
    setValue('estimatedDeliveryTime', meal.estimatedDeliveryTime);
    setValue('foodImage', meal.foodImage);
  };

  const onSubmitUpdate = async (data: MealForm, mealId: string) => {
    try {
      const ingredientsArray = data.ingredients.split(',').map((i) => i.trim()).filter(Boolean);
      await api.put(`/meals/${mealId}`, {
        ...data,
        ingredients: ingredientsArray,
      });
      setMeals((prev) =>
        prev.map((m) =>
          m._id === mealId
            ? {
                ...m,
                ...data,
                ingredients: ingredientsArray,
              }
            : m
        )
      );
      setEditingId(null);
      reset();
      toast.success('Meal updated successfully');
    } catch (error) {
      toast.error('Failed to update meal');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold text-slate-900">My Meals</h1>
      {meals.length === 0 ? (
        <p className="text-center text-slate-600">No meals created yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <div key={meal._id} className="rounded-2xl border bg-white p-4 shadow-sm">
              {editingId === meal._id ? (
                <form
                  onSubmit={handleSubmit((data) => onSubmitUpdate(data, meal._id))}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs font-medium text-slate-700">Food Name</label>
                    <input
                      {...register('foodName', { required: true })}
                      className="mt-1 w-full rounded-lg border px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('price', { required: true, valueAsNumber: true })}
                      className="mt-1 w-full rounded-lg border px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">Ingredients</label>
                    <textarea
                      {...register('ingredients', { required: true })}
                      rows={2}
                      className="mt-1 w-full rounded-lg border px-2 py-1 text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-slate-900 px-2 py-1 text-xs font-semibold text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        reset();
                      }}
                      className="flex-1 rounded-lg border px-2 py-1 text-xs font-semibold text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="aspect-video overflow-hidden rounded-xl bg-slate-100">
                    <img src={meal.foodImage} alt={meal.foodName} className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-800">{meal.foodName}</p>
                  <p className="text-xs text-slate-500">
                    Price: ${meal.price} · {meal.rating} ★
                  </p>
                  <p className="text-xs text-slate-500">
                    Chef: {meal.chefName} ({meal.chefId})
                  </p>
                  <p className="text-xs text-slate-500">ETA: {meal.estimatedDeliveryTime}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleUpdate(meal)}
                      className="flex-1 rounded-lg border px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(meal._id)}
                      className="flex-1 rounded-lg border px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyMeals;


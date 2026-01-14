import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import api from '../lib/axios';
import toast from 'react-hot-toast';

type Meal = {
  _id: string;
  foodName: string;
  chefName: string;
  chefId: string;
  price: number;
  rating: number;
  deliveryArea?: string;
  foodImage: string;
};

function Meals() {
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    document.title = 'Meals - LocalChefBazaar';
  }, []);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/meals?page=${page}&limit=10&sort=${sort}`);
        setMeals(res.data.items || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        toast.error('Failed to load meals');
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [page, sort]);

  const handleSeeDetails = (mealId: string) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/meals/${mealId}` } } });
    } else {
      navigate(`/meals/${mealId}`);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Meals</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600">Sort by price:</span>
          <button
            onClick={() => setSort(sort === 'asc' ? 'desc' : 'asc')}
            className="rounded-lg border px-3 py-1 font-semibold text-slate-800"
          >
            {sort === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-600">Pagination 10 per page. Total pages: {totalPages}</p>

      {loading ? (
        <div className="mt-6 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <div key={meal._id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                <img src={meal.foodImage} alt={meal.foodName} className="h-full w-full object-cover" />
              </div>
              <div className="mt-3 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{meal.foodName}</p>
                  <p className="text-xs text-slate-500">
                    {meal.chefName} · {meal.chefId}
                  </p>
                  {meal.deliveryArea && <p className="text-xs text-slate-500">Delivery area: {meal.deliveryArea}</p>}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-orange-600">${meal.price}</p>
                  <p className="text-xs text-slate-500">{meal.rating} ★</p>
                </div>
              </div>
              <button
                onClick={() => handleSeeDetails(meal._id)}
                className="mt-3 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
              >
                See Details
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-lg border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <div className="text-sm text-slate-700">
          Page {page} of {totalPages}
        </div>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="rounded-lg border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Meals;


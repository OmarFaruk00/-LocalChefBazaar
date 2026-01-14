import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

type Meal = {
  _id: string;
  foodName: string;
  chefName: string;
  chefId: string;
  foodImage: string;
  price: number;
  rating: number;
  deliveryArea?: string;
};

type Review = {
  _id: string;
  reviewerName: string;
  reviewerImage?: string;
  rating: number;
  comment: string;
  date: string;
};

function Home() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    document.title = 'Home - LocalChefBazaar';
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mealsRes = await api.get('/meals?limit=6');
        const mealsData = mealsRes.data.items || [];
        setMeals(mealsData);
        
        // Fetch reviews from first few meals
        if (mealsData.length > 0) {
          const reviewPromises = mealsData.slice(0, 3).map((meal: Meal) =>
            api.get(`/reviews/${meal._id}`).catch(() => ({ data: { reviews: [] } }))
          );
          const reviewResults = await Promise.all(reviewPromises);
          const allReviews = reviewResults.flatMap((res) => res.data.reviews || []).slice(0, 3);
          setReviews(allReviews);
        }
        setMeals(mealsRes.data.items || []);
        setReviews(reviewsRes.data.reviews || []);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSeeDetails = (mealId: string) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/meals/${mealId}` } } });
    } else {
      navigate(`/meals/${mealId}`);
    }
  };
  return (
    <div className="bg-gradient-to-b from-orange-50 via-white to-white">
      <section className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-4 pb-16 pt-10 md:flex-row md:py-16">
        <div className="flex-1">
          <motion.h1
            className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Fresh homemade meals,
            <br />
            delivered from local chefs.
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Explore daily menus, check chef availability, and track your order in real time.
          </motion.p>
          <motion.div
            className="mt-6 flex gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/meals"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
            >
              Browse Meals
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900"
            >
              Become a Chef
            </Link>
          </motion.div>
        </div>
        <div className="flex-1">
          <motion.div
            className="relative rounded-3xl bg-white p-6 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-orange-200 to-amber-100" />
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-orange-50 p-3">
                <p className="text-xs uppercase text-orange-600">Trusted chefs</p>
                <p className="text-base font-semibold text-slate-900">Verified & local</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase text-slate-500">Delivery</p>
                <p className="text-base font-semibold text-slate-900">Fast & tracked</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs uppercase text-slate-500">Payments</p>
                <p className="text-base font-semibold text-slate-900">Secure with Stripe</p>
              </div>
              <div className="rounded-xl bg-orange-50 p-3">
                <p className="text-xs uppercase text-orange-600">Rating</p>
                <p className="text-base font-semibold text-slate-900">Community reviews</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Daily Meals</h2>
          <Link to="/meals" className="text-sm font-semibold text-orange-600">
            View all
          </Link>
        </div>
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
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{meal.foodName}</p>
                    <p className="text-xs text-slate-500">
                      {meal.chefName} · {meal.chefId}
                    </p>
                    {meal.deliveryArea && <p className="text-xs text-slate-500">Area: {meal.deliveryArea}</p>}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-orange-600">${meal.price}</span>
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
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold text-slate-900">Customer Reviews</h2>
        {loading ? (
          <div className="mt-6 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div key={review._id} className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={review.reviewerImage || 'https://i.pravatar.cc/40'}
                    alt={review.reviewerName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{review.reviewerName}</p>
                    <p className="text-xs text-slate-500">
                      {review.rating} ★ · {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-600">No reviews yet.</p>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl bg-slate-900 px-6 py-10 text-white shadow-lg md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Extra: Become a featured chef</h3>
              <p className="mt-2 text-sm text-slate-200">
                Apply to list your kitchen, reach local food lovers, and earn more.
              </p>
            </div>
            <Link to="/register" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900">
              Start now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;









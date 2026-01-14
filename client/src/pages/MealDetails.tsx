import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '../store/hooks';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

type Meal = {
  _id: string;
  foodName: string;
  chefName: string;
  chefId: string;
  price: number;
  rating: number;
  ingredients: string[];
  deliveryArea?: string;
  estimatedDeliveryTime: string;
  chefExperience: string;
  foodImage: string;
};

type Review = {
  _id: string;
  reviewerName: string;
  reviewerImage?: string;
  rating: number;
  comment: string;
  date: string;
  userEmail: string;
};

type ReviewForm = {
  rating: number;
  comment: string;
};

function MealDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewForm>();

  useEffect(() => {
    document.title = meal ? `${meal.foodName} - LocalChefBazaar` : 'Meal Details - LocalChefBazaar';
  }, [meal]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [mealRes, reviewsRes] = await Promise.all([
          api.get(`/meals/${id}`),
          api.get(`/reviews/${id}`),
        ]);
        setMeal(mealRes.data.meal);
        setReviews(reviewsRes.data.reviews || []);
      } catch (error) {
        toast.error('Failed to load meal details');
        navigate('/meals');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleOrder = () => {
    if (!meal) return;
    navigate(`/order/${meal._id}`);
  };

  const handleFavorite = async () => {
    if (!meal || !user) return;
    try {
      await api.post('/favorites', {
        mealId: meal._id,
        mealName: meal.foodName,
        chefId: meal.chefId,
        chefName: meal.chefName,
        price: meal.price,
      });
      toast.success('Added to favorites!');
    } catch (error: any) {
      if (error.response?.data?.message === 'Already in favorites') {
        toast.error('Already in favorites');
      } else {
        toast.error('Failed to add to favorites');
      }
    }
  };

  const onSubmitReview = async (data: ReviewForm) => {
    if (!id || !user) return;
    try {
      const res = await api.post(`/reviews/${id}`, {
        rating: data.rating,
        comment: data.comment,
        reviewerImage: user.photoURL,
      });
      setReviews([res.data.review, ...reviews]);
      reset();
      setShowReviewForm(false);
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit review');
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
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-center text-slate-600">Meal not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="aspect-video overflow-hidden rounded-2xl bg-slate-100">
            <img src={meal.foodImage} alt={meal.foodName} className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="md:col-span-2">
          <h1 className="text-2xl font-semibold text-slate-900">{meal.foodName}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {meal.chefName} · {meal.chefId}
          </p>
          <p className="mt-3 text-xl font-semibold text-orange-600">${meal.price}</p>
          <p className="text-sm text-slate-600">Rating: {meal.rating} ★</p>
          {meal.deliveryArea && <p className="mt-2 text-sm text-slate-600">Delivery: {meal.deliveryArea}</p>}
          <p className="text-sm text-slate-600">ETA: {meal.estimatedDeliveryTime}</p>
          <p className="text-sm text-slate-600">Chef experience: {meal.chefExperience}</p>
          <p className="mt-3 text-sm font-semibold text-slate-800">Ingredients</p>
          <ul className="mt-1 list-disc pl-5 text-sm text-slate-600">
            {meal.ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3">
            <button
              onClick={handleOrder}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Order Now
            </button>
            <button
              onClick={handleFavorite}
              className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-800"
            >
              Add to Favorite
            </button>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-800"
            >
              Give Review
            </button>
          </div>
        </div>
      </div>

      {showReviewForm && (
        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Add Review</h3>
          <form onSubmit={handleSubmit(onSubmitReview)} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Rating (1-5)</label>
              <input
                type="number"
                min={1}
                max={5}
                {...register('rating', { required: true, valueAsNumber: true, min: 1, max: 5 })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
              {errors.rating && <p className="text-xs text-red-500">Rating is required (1-5)</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Comment</label>
              <textarea
                {...register('comment', { required: true })}
                rows={4}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                placeholder="Write your review..."
              />
              {errors.comment && <p className="text-xs text-red-500">Comment is required</p>}
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  reset();
                }}
                className="rounded-xl border px-4 py-2 text-sm font-semibold text-slate-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No reviews yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {reviews.map((review) => (
              <div key={review._id} className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={review.reviewerImage || 'https://i.pravatar.cc/50'}
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
        )}
      </section>
    </div>
  );
}

export default MealDetails;


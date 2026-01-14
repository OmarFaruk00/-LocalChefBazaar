import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

type Review = {
  _id: string;
  foodId: string;
  mealName?: string;
  rating: number;
  comment: string;
  date: string;
};

type ReviewForm = {
  rating: number;
  comment: string;
};

function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<ReviewForm>();

  useEffect(() => {
    document.title = 'My Reviews - LocalChefBazaar';
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews');
        setReviews(res.data.reviews || []);
      } catch (error) {
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This review will be deleted permanently.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/reviews/item/${id}`);
        setReviews((prev) => prev.filter((r) => r._id !== id));
        toast.success('Review deleted successfully');
      } catch (error) {
        toast.error('Failed to delete review');
      }
    }
  };

  const handleUpdate = (review: Review) => {
    setEditingId(review._id);
    setValue('rating', review.rating);
    setValue('comment', review.comment);
  };

  const onSubmitUpdate = async (data: ReviewForm, reviewId: string) => {
    try {
      await api.put(`/reviews/item/${reviewId}`, data);
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? { ...r, rating: data.rating, comment: data.comment } : r))
      );
      setEditingId(null);
      reset();
      toast.success('Review updated successfully');
    } catch (error) {
      toast.error('Failed to update review');
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
      <h1 className="text-xl font-semibold text-slate-900">My Reviews</h1>
      {reviews.length === 0 ? (
        <p className="text-center text-slate-600">No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="rounded-2xl border bg-white p-4 shadow-sm">
            {editingId === review._id ? (
              <form
                onSubmit={handleSubmit((data) => onSubmitUpdate(data, review._id))}
                className="space-y-3"
              >
                <div>
                  <label className="text-sm font-medium text-slate-700">Rating (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    {...register('rating', { required: true, valueAsNumber: true })}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Comment</label>
                  <textarea
                    {...register('comment', { required: true })}
                    rows={3}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      reset();
                    }}
                    className="rounded-lg border px-3 py-1 text-xs font-semibold text-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Meal ID: {review.foodId}</p>
                  <p className="text-xs text-slate-500">
                    {review.rating} ★ · {new Date(review.date).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(review)}
                    className="rounded-lg border px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="rounded-lg border px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MyReviews;


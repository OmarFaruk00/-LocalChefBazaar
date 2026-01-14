import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

type Favorite = {
  _id: string;
  mealName: string;
  chefName: string;
  price: number;
  addedTime: string;
};

function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Favorite Meals - LocalChefBazaar';
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/favorites');
        setFavorites(res.data.favorites || []);
      } catch (error) {
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Remove from favorites?',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/favorites/${id}`);
        setFavorites((prev) => prev.filter((f) => f._id !== id));
        toast.success('Meal removed from favorites successfully');
      } catch (error) {
        toast.error('Failed to remove favorite');
      }
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
      <h1 className="text-xl font-semibold text-slate-900">Favorite Meals</h1>
      {favorites.length === 0 ? (
        <p className="text-center text-slate-600">No favorite meals yet.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Meal Name</th>
                <th className="px-4 py-3">Chef Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Date Added</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((fav) => (
                <tr key={fav._id} className="border-t">
                  <td className="px-4 py-3 font-semibold text-slate-800">{fav.mealName}</td>
                  <td className="px-4 py-3 text-slate-600">{fav.chefName}</td>
                  <td className="px-4 py-3 text-slate-600">${fav.price}</td>
                  <td className="px-4 py-3 text-slate-600">{new Date(fav.addedTime).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(fav._id)}
                      className="rounded-lg border px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Favorites;


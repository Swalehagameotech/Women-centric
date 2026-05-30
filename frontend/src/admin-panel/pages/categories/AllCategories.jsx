import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageShell from '../../components/AdminPageShell';
import AdminTable from '../../components/AdminTable';
import { deleteAdminCategory, fetchAdminCategories } from '../../utils/adminApi';

function AllCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAdminCategories();
      setCategories(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteAdminCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <AdminPageShell
      title="All Categories"
      description={`${categories.length} categor(ies) in database`}
    >
      <div className="mb-4 flex justify-end">
        <Link
          to="/admin/categories/add"
          className="rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-medium text-white hover:bg-[#6d28d9]"
        >
          + Add Category
        </Link>
      </div>

      {loading && <p className="text-sm text-black/55">Loading categories…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <AdminTable columns={['Image', 'Name', 'Subcategories', 'Actions']}>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-10 text-center text-black/50">
                No categories yet.
              </td>
            </tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat._id}>
                <td className="px-4 py-3">
                  <img
                    src={cat.image}
                    alt=""
                    className="h-12 w-12 rounded object-cover bg-stone-100"
                  />
                </td>
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="max-w-xs px-4 py-3 text-xs text-black/65">
                  {(cat.subcategory || []).length > 0
                    ? cat.subcategory.join(', ')
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/admin/categories/edit/${cat._id}`}
                      className="rounded border border-[#7c3aed] px-2.5 py-1 text-xs font-medium text-[#7c3aed] hover:bg-[#7c3aed]/10"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat._id, cat.name)}
                      className="rounded border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </AdminTable>
      )}
    </AdminPageShell>
  );
}

export default AllCategories;

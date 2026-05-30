import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageShell from '../../components/AdminPageShell';
import CategoryForm from '../../components/CategoryForm';
import { fetchAdminCategory, updateAdminCategory } from '../../utils/adminApi';

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminCategory(id)
      .then((res) => setCategory(res.data))
      .catch((err) => setError(err.message || 'Category not found'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (body) => {
    setLoading(true);
    try {
      await updateAdminCategory(id, body);
      navigate('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminPageShell title="Edit Category">
        <p className="text-sm text-black/55">Loading…</p>
      </AdminPageShell>
    );
  }

  if (error || !category) {
    return (
      <AdminPageShell title="Edit Category">
        <p className="text-sm text-red-600">{error || 'Category not found'}</p>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell title="Edit Category" description={category.name}>
      <CategoryForm
        initial={category}
        submitLabel="Update Category"
        onSubmit={handleSubmit}
        loading={loading}
      />
    </AdminPageShell>
  );
}

export default EditCategory;

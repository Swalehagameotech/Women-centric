import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageShell from '../../components/AdminPageShell';
import CategoryForm from '../../components/CategoryForm';
import { createAdminCategory } from '../../utils/adminApi';

function AddCategory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (body) => {
    setLoading(true);
    try {
      await createAdminCategory(body);
      navigate('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageShell title="Add Category" description="Create a new category.">
      <CategoryForm submitLabel="Create Category" onSubmit={handleSubmit} loading={loading} />
    </AdminPageShell>
  );
}

export default AddCategory;

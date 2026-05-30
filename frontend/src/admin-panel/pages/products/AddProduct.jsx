import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageShell from '../../components/AdminPageShell';
import ProductForm from '../../components/ProductForm';
import { createAdminProduct } from '../../utils/adminApi';

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (body) => {
    setLoading(true);
    try {
      await createAdminProduct(body);
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageShell title="Add Product" description="Create a new product in the database.">
      <ProductForm submitLabel="Create Product" onSubmit={handleSubmit} loading={loading} />
    </AdminPageShell>
  );
}

export default AddProduct;

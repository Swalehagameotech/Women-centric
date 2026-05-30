import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminPageShell from '../../components/AdminPageShell';
import ProductForm from '../../components/ProductForm';
import { fetchAdminProduct, updateAdminProduct } from '../../utils/adminApi';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminProduct(id)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.message || 'Product not found'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (body) => {
    setLoading(true);
    try {
      await updateAdminProduct(id, body);
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminPageShell title="Edit Product">
        <p className="text-sm text-black/55">Loading…</p>
      </AdminPageShell>
    );
  }

  if (error || !product) {
    return (
      <AdminPageShell title="Edit Product">
        <p className="text-sm text-red-600">{error || 'Product not found'}</p>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell title="Edit Product" description={product.name}>
      <ProductForm
        initial={product}
        submitLabel="Update Product"
        onSubmit={handleSubmit}
        loading={loading}
      />
    </AdminPageShell>
  );
}

export default EditProduct;

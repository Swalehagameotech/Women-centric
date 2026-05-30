import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageShell from '../../components/AdminPageShell';
import AdminTable from '../../components/AdminTable';
import ProductDetailModal from '../../components/ProductDetailModal';
import { deleteAdminProduct, fetchAdminProducts } from '../../utils/adminApi';
import { formatPrice } from '../../../utils/products';

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAdminProducts();
      setProducts(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteAdminProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setSelectedProduct((prev) => (prev?._id === id ? null : prev));
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <AdminPageShell
      title="All Products"
      description={`${products.length} product(s) in database`}
    >
      <div className="mb-4 flex justify-end">
        <Link
          to="/admin/products/add"
          className="rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-medium text-white hover:bg-[#6d28d9]"
        >
          + Add Product
        </Link>
      </div>

      {loading && <p className="text-sm text-black/55">Loading products…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <AdminTable
          columns={['Image', 'Name', 'Brand', 'Categories', 'Stock', 'Price', 'Actions']}
        >
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-black/50">
                No products yet.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product._id}
                onClick={() => setSelectedProduct(product)}
                className="cursor-pointer text-black/80 transition hover:bg-[#7c3aed]/5"
              >
                <td className="px-4 py-3">
                  <img
                    src={product.images?.[0]}
                    alt=""
                    className="h-14 w-11 rounded object-cover bg-stone-100"
                  />
                </td>
                <td className="max-w-[160px] px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3">{product.brand || '—'}</td>
                <td className="max-w-[140px] px-4 py-3 text-xs">
                  {(product.categories || []).join(', ')}
                </td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="font-medium">{formatPrice(product.discounted_price)}</span>
                  {product.discount_percent > 0 && (
                    <span className="ml-1 text-xs text-black/45 line-through">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="rounded border border-[#7c3aed] px-2.5 py-1 text-xs font-medium text-[#7c3aed] hover:bg-[#7c3aed]/10"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id, product.name)}
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

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </AdminPageShell>
  );
}

export default AllProducts;

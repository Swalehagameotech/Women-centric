import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageShell from '../../components/AdminPageShell';
import AdminTable from '../../components/AdminTable';
import ProductDetailModal from '../../components/ProductDetailModal';
import { deleteAdminProduct, fetchAdminCategories, fetchAdminProducts } from '../../utils/adminApi';
import { formatPrice } from '../../../utils/products';

const PAGE_SIZE = 50;

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAdminProducts({
        page,
        limit: PAGE_SIZE,
        category: activeCategory === 'All' ? undefined : activeCategory,
        search: searchTerm.trim() || undefined,
      });
      setProducts(res.data || []);
      setTotalProducts(res.total ?? 0);
      setTotalPages(res.totalPages ?? 1);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, page, searchTerm]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    fetchAdminCategories()
      .then((res) => {
        const names = (res.data || []).map((item) => item.name).filter(Boolean);
        setCategoryOptions(names);
      })
      .catch(() => {
        setCategoryOptions([]);
      });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, searchTerm]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteAdminProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setTotalProducts((prev) => Math.max(0, prev - 1));
      setSelectedProduct((prev) => (prev?._id === id ? null : prev));
      load();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <AdminPageShell
      title="All Products"
      description={`${totalProducts} product(s) in database`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by product, brand, or category"
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none ring-primary/20 placeholder:text-black/35 focus:ring-2 sm:max-w-md"
        />
        <Link
          to="/admin/products/add"
          className="rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-medium text-white hover:bg-[#6d28d9]"
        >
          + Add Product
        </Link>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {['All', ...categoryOptions].map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                isActive
                  ? 'border-primary bg-primary text-white'
                  : 'border-black/15 bg-white text-black/75 hover:bg-black/5'
              }`}
            >
              {category}
            </button>
          );
        })}
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
                No products match this filter.
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

      {!loading && !error && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="rounded border border-black/15 px-3 py-1.5 text-sm text-black/80 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-black/70">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="rounded border border-black/15 px-3 py-1.5 text-sm text-black/80 disabled:opacity-40"
          >
            Next
          </button>
        </div>
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

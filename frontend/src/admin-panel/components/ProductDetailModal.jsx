import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/products';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function ProductDetailModal({ product, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-black/10 px-6 py-4">
          <div className="min-w-0">
            <h2 id="product-detail-title" className="text-lg font-semibold text-[#1a1d2e]">
              {product.name}
            </h2>
            {product.brand && (
              <p className="mt-0.5 text-sm text-black/55">{product.brand}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black/50 transition hover:bg-black/5 hover:text-black"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {(product.images || []).length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((url, i) => (
                <img
                  key={url + i}
                  src={url}
                  alt=""
                  className="h-40 w-32 shrink-0 rounded-lg object-cover bg-stone-100"
                />
              ))}
            </div>
          )}

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Product ID
              </dt>
              <dd className="mt-1 break-all text-sm text-black/80">{product._id}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Subcategory
              </dt>
              <dd className="mt-1 text-sm">{product.subcategory || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Categories
              </dt>
              <dd className="mt-1 text-sm">{(product.categories || []).join(', ') || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Stock
              </dt>
              <dd className="mt-1 text-sm font-medium">{product.stock}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Original price
              </dt>
              <dd className="mt-1 text-sm">{formatPrice(product.original_price)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Discount
              </dt>
              <dd className="mt-1 text-sm">{product.discount_percent ?? 0}%</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Sale price
              </dt>
              <dd className="mt-1 text-sm font-semibold text-[#7c3aed]">
                {formatPrice(product.discounted_price)}
              </dd>
            </div>
            {product.ratings != null && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-black/45">
                  Ratings
                </dt>
                <dd className="mt-1 text-sm">{product.ratings} / 5</dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Created
              </dt>
              <dd className="mt-1 text-sm">{formatDate(product.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Updated
              </dt>
              <dd className="mt-1 text-sm">{formatDate(product.updatedAt)}</dd>
            </div>
          </dl>

          <div className="mt-5">
            <dt className="text-xs font-semibold uppercase tracking-wide text-black/45">
              Description
            </dt>
            <dd className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-black/75">
              {product.description || '—'}
            </dd>
          </div>

          {(product.images || []).length > 0 && (
            <div className="mt-5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-black/45">
                Image URLs
              </dt>
              <ul className="mt-2 space-y-1">
                {product.images.map((url, i) => (
                  <li key={url + i} className="break-all text-xs text-black/55">
                    {url}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-black/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5"
          >
            Close
          </button>
          <Link
            to={`/admin/products/edit/${product._id}`}
            className="rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-medium text-white hover:bg-[#6d28d9]"
          >
            Edit Product
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;

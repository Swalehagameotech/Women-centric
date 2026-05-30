import { useEffect, useState } from 'react';
import { fetchAdminCategories } from '../utils/adminApi';

const COLLECTION_OPTIONS = ['Bestseller', 'New Launch', 'Discount'];

const emptyForm = {
  name: '',
  brand: '',
  description: '',
  subcategory: '',
  stock: '0',
  original_price: '',
  discount_percent: '0',
  images: '',
};

function ProductForm({ initial, onSubmit, submitLabel, loading }) {
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!initial) return;
    setForm({
      name: initial.name || '',
      brand: initial.brand || '',
      description: initial.description || '',
      subcategory: initial.subcategory || '',
      stock: String(initial.stock ?? 0),
      original_price: String(initial.original_price ?? ''),
      discount_percent: String(initial.discount_percent ?? 0),
      images: (initial.images || []).join('\n'),
    });
    setSelectedCategories(initial.categories || []);
  }, [initial]);

  const toggleCategory = (name) => {
    setSelectedCategories((prev) => {
      if (prev.includes(name)) return prev.filter((c) => c !== name);
      if (prev.length >= 4) return prev;
      return [...prev, name];
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const images = form.images
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!form.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (images.length === 0) {
      setError('Add at least one image URL (one per line).');
      return;
    }
    if (selectedCategories.length === 0) {
      setError('Select at least one category.');
      return;
    }
    if (!form.subcategory.trim()) {
      setError('Subcategory is required.');
      return;
    }
    if (!form.original_price || Number(form.original_price) < 0) {
      setError('Valid original price is required.');
      return;
    }

    try {
      await onSubmit({
        name: form.name.trim(),
        brand: form.brand.trim(),
        description: form.description.trim(),
        subcategory: form.subcategory.trim(),
        stock: Number(form.stock) || 0,
        original_price: Number(form.original_price),
        discount_percent: Number(form.discount_percent) || 0,
        images,
        categories: selectedCategories,
      });
    } catch (err) {
      setError(err.message || 'Failed to save product');
    }
  };

  const categoryOptions = [
    ...categories.map((c) => c.name),
    ...COLLECTION_OPTIONS.filter((n) => !categories.some((c) => c.name === n)),
  ];

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-black/70">Product name *</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-black/70">Brand</span>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-black/70">Subcategory *</span>
          <input
            name="subcategory"
            value={form.subcategory}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-black/70">Stock *</span>
          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-black/70">Original price (₹) *</span>
          <input
            name="original_price"
            type="number"
            min="0"
            step="0.01"
            value={form.original_price}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-black/70">Discount %</span>
          <input
            name="discount_percent"
            type="number"
            min="0"
            max="100"
            value={form.discount_percent}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-black/70">Description *</span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-black/70">Image URLs * (one per line)</span>
        <textarea
          name="images"
          value={form.images}
          onChange={handleChange}
          rows={3}
          placeholder="https://..."
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
          required
        />
      </label>

      <fieldset>
        <legend className="text-sm font-medium text-black/70">Categories * (max 4)</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {categoryOptions.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => toggleCategory(name)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                selectedCategories.includes(name)
                  ? 'border-[#7c3aed] bg-[#7c3aed] text-white'
                  : 'border-black/15 bg-white text-black/70 hover:border-[#7c3aed]'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-[#7c3aed] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#6d28d9] disabled:opacity-60"
      >
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}

export default ProductForm;

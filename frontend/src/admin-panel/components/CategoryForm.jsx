import { useEffect, useState } from 'react';

const emptyForm = {
  name: '',
  image: '',
  subcategory: '',
};

function CategoryForm({ initial, onSubmit, submitLabel, loading }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initial) return;
    setForm({
      name: initial.name || '',
      image: initial.image || '',
      subcategory: (initial.subcategory || []).join(', '),
    });
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Category name is required.');
      return;
    }
    if (!form.image.trim()) {
      setError('Image URL is required.');
      return;
    }

    const subcategory = form.subcategory
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await onSubmit({
        name: form.name.trim(),
        image: form.image.trim(),
        subcategory,
      });
    } catch (err) {
      setError(err.message || 'Failed to save category');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <label className="block">
        <span className="text-sm font-medium text-black/70">Category name *</span>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-black/70">Image URL *</span>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://..."
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
          required
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-black/70">Subcategories (comma separated)</span>
        <input
          name="subcategory"
          value={form.subcategory}
          onChange={handleChange}
          placeholder="Dresses, Tops, Kurtis"
          className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#7c3aed]"
        />
      </label>

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

export default CategoryForm;

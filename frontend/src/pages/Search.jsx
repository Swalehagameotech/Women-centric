import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../utils/products';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setError('');
      return undefined;
    }

    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await fetchProducts({ search: query, signal: controller.signal });
        setProducts(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Search failed');
        }
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-black sm:text-4xl">Search</h1>

      {query ? (
        <p className="mt-2 text-sm text-black/70">
          Showing results for &ldquo;<span className="font-medium text-black">{query}</span>&rdquo;
        </p>
      ) : (
        <p className="mt-2 text-sm text-black/70">Type in the search bar to find products.</p>
      )}

      {loading && (
        <p className="mt-10 text-center text-sm text-black/60">Searching products...</p>
      )}

      {error && (
        <p className="mt-10 text-center text-sm text-red-600">{error}</p>
      )}

      {!loading && !error && query && products.length === 0 && (
        <div className="mt-12 rounded-2xl border border-black/10 bg-white p-10 text-center">
          <p className="text-black/70">No products found for your search.</p>
          <Link to="/" className="btn-solid mt-6 inline-block">
            Continue shopping
          </Link>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="mt-8 grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} compact />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;

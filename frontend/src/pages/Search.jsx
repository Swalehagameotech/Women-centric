import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageEmptyState from '../components/PageEmptyState';
import PageLayout from '../components/PageLayout';
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
    <PageLayout
      title="Search"
      description={
        query
          ? `Showing results for “${query}”`
          : 'Type in the search bar to find products.'
      }
    >

      {loading && (
        <p className="mt-10 text-center text-sm text-black/60">Searching products...</p>
      )}

      {error && (
        <p className="mt-10 text-center text-sm text-red-600">{error}</p>
      )}

      {!loading && !error && query && products.length === 0 && (
        <PageEmptyState
          message="No products found for your search."
          hint="Try different keywords or browse our categories from the home page."
        >
          <Link to="/" className="btn-solid inline-block">
            Go to Home
          </Link>
        </PageEmptyState>
      )}

      {!loading && !error && !query && (
        <PageEmptyState
          message="Search for products by name or brand."
          hint="Use the search bar at the top of the page to get started."
        />
      )}

      {!loading && products.length > 0 && (
        <div className="product-grid mt-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} compact />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default Search;

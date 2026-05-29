import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { fetchProducts } from '../utils/products';

const bestsellerBadgeImage =
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779714263/sc-3_bu9enf.webp';

const HOME_LIMIT = 8;

function BestsellerCategoriesSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const data = await fetchProducts({ category: 'Bestseller', signal: controller.signal });
        setProducts(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load bestseller products:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    return () => controller.abort();
  }, []);

  const homeProducts = products.slice(0, HOME_LIMIT);
  const hasMore = products.length > HOME_LIMIT;

  return (
    <section className="mx-auto max-w-[1600px] px-4 pb-10 pt-2 sm:px-6 sm:pb-12 md:px-8">
      <div className="text-center">
        <h2 className="font-serif text-3xl text-center font-medium text-black sm:text-4xl">Bestseller</h2>
      </div>

      {loading ? (
        <p className="mt-8 text-center text-black/70">Loading products...</p>
      ) : homeProducts.length === 0 ? (
        <p className="mt-8 text-center text-black/70">No bestseller products yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 justify-items-center gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {homeProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              compact
              showBestsellerBadge
              bestsellerBadgeImage={bestsellerBadgeImage}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <Link to="/category/bestseller" className="btn-solid inline-flex items-center gap-2 shadow-[0_12px_24px_rgba(94,48,62,0.2)]">
            View All Categories
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </section>
  );
}

export default BestsellerCategoriesSection;

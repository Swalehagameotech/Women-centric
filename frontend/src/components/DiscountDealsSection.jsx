import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { fetchProducts } from '../utils/products';

const discountBannerDesktop =
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779790733/Untitled_1920_x_200_px_1920_x_150_px_1850_x_650_px_1850_x_350_px_xfc0ng.png';

const discountBannerMobile =
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1780051133/ChatGPT_Image_May_29_2026_04_01_00_PM_ys1db7.png';

const HOME_LIMIT = 8;

function DiscountDealsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const data = await fetchProducts({ category: 'Discount', signal: controller.signal });
        setProducts(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load discount products:', error);
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
    <section className="pb-10 pt-2 sm:pb-12">
      <Link to="/category/discount" className="block w-full overflow-hidden">
        <img
          src={discountBannerMobile}
          alt="Special discount deals"
          className="block h-auto w-full max-w-full transition hover:opacity-95 md:hidden"
        />
        <img
          src={discountBannerDesktop}
          alt="Special discount deals"
          className="hidden h-auto w-full max-w-full transition hover:opacity-95 md:block"
        />
      </Link>

      <div className="mx-auto mt-6 max-w-[1600px] px-4 sm:mt-8 sm:px-6 md:px-8">
        {loading ? (
          <p className="text-center text-black/70">Loading products...</p>
        ) : homeProducts.length === 0 ? (
          <p className="text-center text-black/70">No discount products yet.</p>
        ) : (
          <div className="grid grid-cols-2 justify-items-center gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {homeProducts.map((product) => (
              <ProductCard key={product._id} product={product} compact />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="mt-8 text-center">
            <Link to="/category/discount" className="btn-solid inline-flex items-center gap-2">
              View all deals
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default DiscountDealsSection;

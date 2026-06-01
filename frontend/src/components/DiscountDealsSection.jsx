import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductsEmptyState from './ProductsEmptyState';
import ProductsLoader from './ProductsLoader';
import { fetchProducts } from '../utils/products';

const discountBannerDesktop =
  'https://res.cloudinary.com/dsafvwkrf/video/upload/v1780137922/Untitled_1920_x_200_px_1920_x_150_px_1850_x_650_px_1850_x_350_px_1_hmxsuh.mp4';

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

  return (
    <section className="w-full">
      <Link to="/category/discount" className="block w-full overflow-hidden md:rounded-none">
        <img
          src={discountBannerMobile}
          alt="Special discount deals"
          className="block aspect-[16/9] w-full object-cover object-center transition hover:opacity-95 md:hidden"
        />
        <video
          className="hidden h-auto w-full max-w-full object-cover transition hover:opacity-95 md:block"
          src={discountBannerDesktop}
          autoPlay
          loop
          muted
          playsInline
          aria-label="Special discount deals"
        />
      </Link>

      <div className="mx-auto mt-4 max-w-[1600px] px-4 sm:mt-8 sm:px-6 md:px-8">
        {loading ? (
          <ProductsLoader variant="section" label="Loading deals…" />
        ) : homeProducts.length === 0 ? (
          <ProductsEmptyState />
        ) : (
          <div className="product-grid">
            {homeProducts.map((product) => (
              <ProductCard key={product._id} product={product} compact priceOnly />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default DiscountDealsSection;

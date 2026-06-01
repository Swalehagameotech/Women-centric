import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductsEmptyState from './ProductsEmptyState';
import ProductsLoader from './ProductsLoader';
import { NEW_LAUNCH_BADGE_IMAGE } from '../utils/badges';
import { fetchMixedHomeProducts } from '../utils/products';

const NEW_LAUNCH_MIX = [
  { category: 'Womens Wear', subcategory: 'Sarees', count: 4, sareesOnly: true },
  { category: 'Bags', count: 2 },
  { category: 'Luxury Accessories', count: 2 },
  { category: 'Luxury Essentials', count: 1 },
  { category: 'Footwear', count: 1 },
];

const featuredImageDesktop =
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779793668/Untitled_1920_x_200_px_1920_x_150_px_1850_x_650_px_1850_x_400_px_1080_x_650_px_640_x_650_px_690_x_650_px_talxpq.png';

const featuredImageMobile =
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1780050814/ChatGPT_Image_May_29_2026_04_02_40_PM_ueos2b.png';

const HOME_LIMIT = 10;

function NewLaunchSection() {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const data = await fetchMixedHomeProducts({
          signal: controller.signal,
          primaryCategory: 'New Launch',
          supplemental: NEW_LAUNCH_MIX,
          limit: HOME_LIMIT,
        });
        setProducts(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load new launch products:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    return () => controller.abort();
  }, []);

  const homeProducts = products.slice(0, HOME_LIMIT);

  const scrollRow = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction * 300, behavior: 'smooth' });
  };

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-8">
      <div className="mb-6 flex justify-center text-center sm:mb-8">
        <h2 className="font-serif text-2xl font-medium text-black sm:text-3xl md:text-4xl">New Launch</h2>
      </div>

      {loading ? (
        <ProductsLoader variant="section" label="Loading new launches…" />
      ) : homeProducts.length === 0 ? (
        <ProductsEmptyState />
      ) : (
        <>
          {/* Mobile: featured image + 2 products visible with horizontal scroll */}
          <div className="md:hidden">
            <Link to="/category/new-launch" className="block overflow-hidden rounded-xl">
              <img
                src={featuredImageMobile}
                alt="New launch featured collection"
                className="block aspect-[4/5] w-full object-cover transition hover:opacity-95"
                loading="lazy"
              />
            </Link>

            <div className="mt-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                <div className="flex gap-2">
                  {homeProducts.map((product) => (
                    <div
                      key={product._id}
                      className="w-[calc((100vw-2rem-0.75rem)/2)] max-w-[240px] shrink-0 snap-start"
                    >
                      <ProductCard
                        product={product}
                        featured
                        showNewLaunchBadge
                        newLaunchBadgeImage={NEW_LAUNCH_BADGE_IMAGE}
                        priceOnly
                      />
                    </div>
                  ))}
                </div>
              </div>
          </div>

          {/* Desktop / tablet: horizontal row with tall featured image */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => scrollRow(-1)}
              className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-xl text-primary shadow-md lg:flex"
              aria-label="Previous new launch"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => scrollRow(1)}
              className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-xl text-primary shadow-md lg:flex"
              aria-label="Next new launch"
            >
              →
            </button>

            <div ref={scrollRef} className="overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex min-w-max items-center justify-start gap-4">
                <Link
                  to="/category/new-launch"
                  className="relative block shrink-0 overflow-hidden rounded-xl"
                >
                  <img
                    src={featuredImageDesktop}
                    alt="New launch featured collection"
                    className="h-[330px] object-cover transition hover:opacity-95 lg:h-[420px]"
                    loading="lazy"
                  />
                </Link>

                {homeProducts.map((product) => (
                  <div key={product._id} className="w-[260px] shrink-0">
                    <ProductCard
                      product={product}
                      featured
                      showNewLaunchBadge
                      newLaunchBadgeImage={NEW_LAUNCH_BADGE_IMAGE}
                      priceOnly
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

    </section>
  );
}

export default NewLaunchSection;

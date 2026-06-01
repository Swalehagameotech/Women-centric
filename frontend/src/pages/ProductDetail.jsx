import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EmailSubscribeSection from '../components/EmailSubscribeSection';
import ProductRecommendationsRow from '../components/ProductRecommendationsRow';
import ProductsLoader from '../components/ProductsLoader';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  fetchProductById,
  fetchProducts,
  formatPrice,
  getPrimaryCategory,
  shuffleProducts,
} from '../utils/products';

const RECOMMENDATION_LIMIT = 10;

function HeartIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m12 20-1.2-1.1C5.2 13.9 2 11 2 7.5 2 5 4 3 6.5 3c1.7 0 3.4.8 4.5 2.1C12.1 3.8 13.8 3 15.5 3 18 3 20 5 20 7.5c0 3.5-3.2 6.4-8.8 11.4Z" />
    </svg>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [alsoViewedProducts, setAlsoViewedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [alsoViewedLoading, setAlsoViewedLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError('');
      setRelatedProducts([]);
      setAlsoViewedProducts([]);

      try {
        const data = await fetchProductById(id, { signal: controller.signal });
        setProduct(data);
        setQuantity(1);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load product');
        }
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!product) return undefined;

    const controller = new AbortController();
    const category = getPrimaryCategory(product.categories);

    const loadRecommendations = async () => {
      setRelatedLoading(true);
      setAlsoViewedLoading(true);
      setRelatedProducts([]);
      setAlsoViewedProducts([]);

      try {
        const [categoryProducts, allProducts] = await Promise.all([
          category
            ? fetchProducts({ category, signal: controller.signal })
            : Promise.resolve([]),
          fetchProducts({ signal: controller.signal }),
        ]);

        const excludeId = product._id;

        const related = shuffleProducts(
          categoryProducts.filter((item) => item._id !== excludeId),
        ).slice(0, RECOMMENDATION_LIMIT);

        const relatedIds = new Set(related.map((item) => item._id));

        const alsoViewed = shuffleProducts(
          allProducts.filter((item) => item._id !== excludeId && !relatedIds.has(item._id)),
        ).slice(0, RECOMMENDATION_LIMIT);

        setRelatedProducts(related);
        setAlsoViewedProducts(alsoViewed);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to load recommendations:', err);
        }
      } finally {
        setRelatedLoading(false);
        setAlsoViewedLoading(false);
      }
    };

    loadRecommendations();

    return () => controller.abort();
  }, [product]);

  if (loading) {
    return (
      <div className="page-shell mx-auto max-w-6xl">
        <ProductsLoader variant="page" label="Loading product…" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-shell mx-auto max-w-6xl text-center">
        <p className="font-medium text-black/70">{error || 'Product not found'}</p>
        <Link to="/" className="btn-solid mt-6 inline-block">
          Continue shopping
        </Link>
      </div>
    );
  }

  const image = product.images?.[0];
  const hasDiscount =
    product.discount_percent > 0 && product.original_price > product.discounted_price;
  const isFavourite = isInWishlist(product._id);
  const displayBrand = product.brand?.trim() || product.name;

  const handleAddToBag = () => {
    requireAuth(() => {
      addItem(product, quantity);
    });
  };

  const handleBuyNow = () => {
    requireAuth(() => {
      navigate('/checkout', {
        state: {
          buyNow: {
            product,
            quantity,
          },
        },
      });
    });
  };

  return (
    <>
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-12 md:items-start">
        <div className="relative aspect-[4/5] w-full max-w-[320px] overflow-hidden bg-stone-100 sm:max-w-[360px] lg:max-w-[420px]">
          <button
            type="button"
            onClick={() => toggleItem(product)}
            className={`absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm ${
              isFavourite ? 'text-primary' : 'text-primary/70'
            }`}
            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            aria-pressed={isFavourite}
          >
            <HeartIcon filled={isFavourite} />
          </button>

          {image ? (
            <img src={image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-black/40">No image</div>
          )}
        </div>

        <div className="flex flex-col font-medium text-black">
          <h1 className="text-2xl font-bold text-black sm:text-3xl">{displayBrand}</h1>
          {product.brand?.trim() && product.name !== displayBrand && (
            <p className="mt-2 text-base font-semibold text-black/80">{product.name}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-xl font-bold text-black">
              {formatPrice(product.discounted_price)}
            </span>
            {hasDiscount && (
              <span className="text-lg font-semibold text-black/45 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          <section className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-black/70">
              Description
            </h2>
            <p className="mt-3 text-sm font-medium leading-relaxed text-black/80">
              {product.description}
            </p>
          </section>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-wider text-black/70">Quantity</p>
            <div className="mt-3 inline-flex items-center border border-black/20">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="px-4 py-2 text-lg font-semibold text-black hover:bg-black/5"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-[3rem] border-x border-black/20 px-4 py-2 text-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                className="px-4 py-2 text-lg font-semibold text-black hover:bg-black/5"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleAddToBag}
              className="btn-outline w-full py-3 font-semibold"
            >
              Add to bag
            </button>
            <button type="button" onClick={handleBuyNow} className="btn-solid w-full py-3 font-semibold">
              Buy now
            </button>
          </div>
        </div>
      </div>

    </div>

    <div className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-8 sm:px-6 sm:pt-10 md:px-8">
      <ProductRecommendationsRow
        title="You may also like"
        products={relatedProducts}
        loading={relatedLoading}
      />

      <ProductRecommendationsRow
        title="Customers also viewed"
        products={alsoViewedProducts}
        loading={alsoViewedLoading}
      />

      <EmailSubscribeSection />
    </div>
    </>
  );
}

export default ProductDetail;

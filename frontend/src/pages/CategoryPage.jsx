import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { PageTitle } from '../components/PageEmptyState';
import ProductCard from '../components/ProductCard';
import ProductsEmptyState from '../components/ProductsEmptyState';
import ProductsLoader from '../components/ProductsLoader';
import { NEW_LAUNCH_BADGE_IMAGE } from '../utils/badges';
import {
  applyFixedDiscountPercent,
  COLLECTION_BY_SLUG,
  DISCOUNT_PROMO_PERCENT,
  fetchCategories,
  fetchProducts,
  formatPrice,
  resolveCategoryFromSlug,
  shuffleProducts,
} from '../utils/products';

function FilterDotsIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="5" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="12" cy="19" r="1.75" />
    </svg>
  );
}

function PriceFilterControls({ priceBounds, priceMax, setPriceMax, onDone }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-black/55">
        Min {formatPrice(priceBounds.min)} – Max {formatPrice(Number(priceMax) || priceBounds.max)}
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <div className="text-sm">
          <span className="font-medium text-black/80">Min price</span>
          <p className="mt-1 rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 font-medium">
            {formatPrice(priceBounds.min)}
          </p>
        </div>
        <label className="block text-sm">
          <span className="font-medium text-black/80">Max price (₹)</span>
          <input
            type="number"
            min={priceBounds.min}
            max={priceBounds.max}
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="mt-1 w-full min-w-[120px] rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setPriceMax(String(priceBounds.max))}
          className="flex-1 rounded-full border border-primary/30 py-2 text-sm font-medium text-primary hover:bg-primary/5"
        >
          Reset
        </button>
        {onDone && (
          <button type="button" onClick={onDone} className="btn-solid flex-1 py-2 text-sm">
            Apply
          </button>
        )}
      </div>
    </div>
  );
}

function CategoryPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubcategory = searchParams.get('subcategory') || '';

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterMenuRef = useRef(null);

  const isNewLaunchPage = slug === 'new-launch';
  const isCollectionPage = Boolean(COLLECTION_BY_SLUG[slug]);
  const hasSubcategories = !isCollectionPage && category?.subcategory?.length > 0;

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const categories = await fetchCategories({ signal: controller.signal });
        const matchedCategory = resolveCategoryFromSlug(categories, slug);

        if (!matchedCategory) {
          setCategory(null);
          setProducts([]);
          setError('Category not found');
          return;
        }

        setCategory(matchedCategory);

        const categoryProducts = await fetchProducts({
          category: matchedCategory.name,
          subcategory: activeSubcategory || undefined,
          signal: controller.signal,
        });

        const displayProducts =
          slug === 'discount'
            ? categoryProducts.map((product) =>
                applyFixedDiscountPercent(product, DISCOUNT_PROMO_PERCENT),
              )
            : categoryProducts;

        setProducts(shuffleProducts(displayProducts));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load category');
        }
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [slug, activeSubcategory]);

  const priceBounds = useMemo(() => {
    if (!products.length) {
      return { min: 0, max: 0 };
    }
    const prices = products.map((p) => Number(p.discounted_price) || 0);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  useEffect(() => {
    if (!products.length) {
      setPriceMax('');
      return;
    }
    setPriceMax(String(priceBounds.max));
  }, [products, priceBounds.max, activeSubcategory]);

  const filteredProducts = useMemo(() => {
    if (!products.length) return [];

    const min = priceBounds.min;
    const max = Number(priceMax);
    if (!Number.isFinite(max)) return products;

    return products.filter((product) => {
      const price = Number(product.discounted_price) || 0;
      return price >= min && price <= max;
    });
  }, [products, priceBounds.min, priceMax]);

  const handleSubcategoryClick = (subcategory) => {
    setFilterOpen(false);
    if (!subcategory) {
      setSearchParams({});
      return;
    }

    setSearchParams({ subcategory });
  };

  useEffect(() => {
    if (!filterOpen) return undefined;

    const handlePointerDown = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [filterOpen]);

  const showFilterBar = hasSubcategories || products.length > 0;

  if (loading) {
    return (
      <div className="page-shell mx-auto max-w-[1600px]">
        <ProductsLoader variant="page" skeleton label="Loading products…" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="page-shell mx-auto max-w-[1600px] text-center">
        <PageTitle>Category not found</PageTitle>
        <Link to="/" className="btn-solid mt-6 inline-block">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6 md:px-8">
      {showFilterBar && (
        <div className="sticky-subcategory-bar -mx-4 border-b border-black/5 bg-white px-4 py-3 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
          <div className="flex items-center gap-2 md:gap-4">
            {products.length > 0 && (
              <div ref={filterMenuRef} className="relative shrink-0 md:hidden">
                <button
                  type="button"
                  onClick={() => setFilterOpen((open) => !open)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                    filterOpen
                      ? 'border-primary bg-primary text-white'
                      : 'border-black/15 text-primary hover:bg-primary/5'
                  }`}
                  aria-label="Open price filter"
                  aria-expanded={filterOpen}
                >
                  <FilterDotsIcon />
                </button>
                {filterOpen && (
                  <div className="absolute left-0 top-full z-[60] mt-2 w-[min(100vw-2rem,280px)] rounded-xl border border-black/10 bg-white p-4 shadow-lg">
                    <p className="mb-3 text-sm font-semibold text-black">Price filter</p>
                    <PriceFilterControls
                      priceBounds={priceBounds}
                      priceMax={priceMax}
                      setPriceMax={setPriceMax}
                      onDone={() => setFilterOpen(false)}
                    />
                  </div>
                )}
              </div>
            )}

            {hasSubcategories ? (
              <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button
                  type="button"
                  onClick={() => handleSubcategoryClick('')}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                    !activeSubcategory
                      ? 'bg-primary text-white'
                      : 'border border-primary/30 text-primary hover:bg-primary/5'
                  }`}
                >
                  All
                </button>
                {category.subcategory.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => handleSubcategoryClick(sub)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeSubcategory === sub
                        ? 'bg-primary text-white'
                        : 'border border-primary/30 text-primary hover:bg-primary/5'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            ) : (
              <div className="min-w-0 flex-1 md:hidden" />
            )}

            {products.length > 0 && (
              <div
                className={`hidden shrink-0 items-center gap-2 md:flex md:gap-3 ${
                  hasSubcategories ? 'border-l border-black/10 pl-4' : 'ml-auto'
                }`}
              >
                <span className="text-xs text-black/55">
                  Min {formatPrice(priceBounds.min)}
                </span>
                <label className="flex items-center gap-1.5 text-sm whitespace-nowrap">
                  <span className="text-black/70">Max ₹</span>
                  <input
                    type="number"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-[100px] rounded-full border border-black/15 px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setPriceMax(String(priceBounds.max))}
                  className="shrink-0 rounded-full border border-primary/30 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="pt-6">
        {filteredProducts.length === 0 ? (
          <div className="mt-8 text-center">
            <ProductsEmptyState className="py-4" />
            <Link to="/" className="btn-solid mt-2 inline-block">
              Go to Home
            </Link>
          </div>
        ) : (
          <div className="product-grid mt-1">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                compact
                showNewLaunchBadge={isNewLaunchPage}
                newLaunchBadgeImage={NEW_LAUNCH_BADGE_IMAGE}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;

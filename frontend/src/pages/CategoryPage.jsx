import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import PageEmptyState, { PageTitle } from '../components/PageEmptyState';
import ProductCard from '../components/ProductCard';
import { NEW_LAUNCH_BADGE_IMAGE } from '../utils/badges';
import {
  COLLECTION_BY_SLUG,
  fetchCategories,
  fetchProducts,
  resolveCategoryFromSlug,
  shuffleProducts,
} from '../utils/products';

function CategoryPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubcategory = searchParams.get('subcategory') || '';

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isNewLaunchPage = slug === 'new-launch';
  const isCollectionPage = Boolean(COLLECTION_BY_SLUG[slug]);

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

        setProducts(shuffleProducts(categoryProducts));
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

  const handleSubcategoryClick = (subcategory) => {
    if (!subcategory) {
      setSearchParams({});
      return;
    }

    setSearchParams({ subcategory });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-16 text-center text-black/70 sm:px-6">
        Loading...
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-16 text-center sm:px-6">
        <h1 className="font-serif text-3xl text-black">Category not found</h1>
        <Link to="/" className="btn-solid mt-6 inline-block">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6 md:px-8">
      {!isCollectionPage && category.subcategory?.length > 0 && (
        <div className="sticky-subcategory-bar -mx-4 border-b border-black/5 bg-white px-4 py-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => handleSubcategoryClick('')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
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
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeSubcategory === sub
                    ? 'bg-primary text-white'
                    : 'border border-primary/30 text-primary hover:bg-primary/5'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-6">
        <PageTitle>{category.name}</PageTitle>
        {activeSubcategory && (
          <p className="mt-2 text-sm text-black/70">{activeSubcategory}</p>
        )}

        {products.length === 0 ? (
          <PageEmptyState
            message={`There are no products in ${category.name} yet.`}
            hint="Check back soon or explore other categories from the home page."
          >
            <Link to="/" className="btn-solid inline-block">
              Go to Home
            </Link>
          </PageEmptyState>
        ) : (
        <div className="product-grid mt-8">
          {products.map((product) => (
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

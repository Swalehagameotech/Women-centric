import { SectionTitle } from './PageEmptyState';
import ProductCard from './ProductCard';
import ProductsEmptyState, { NO_PRODUCTS_MESSAGE } from './ProductsEmptyState';
import ProductsLoader from './ProductsLoader';

function ProductRecommendationsRow({
  title,
  products,
  loading,
  emptyMessage = NO_PRODUCTS_MESSAGE,
}) {
  return (
    <section className="mb-10 last:mb-0 sm:mb-12">
      <SectionTitle align="left" size="md">
        {title}
      </SectionTitle>

      {loading ? (
        <ProductsLoader className="sm:mt-2" variant="inline" label="Loading products…" />
      ) : products.length === 0 ? (
        <ProductsEmptyState className="mt-4 sm:mt-6" message={emptyMessage} />
      ) : (
        <div className="product-recommendations-scroll mt-6 overflow-x-auto pb-2 scrollbar-hide sm:mt-8">
          <div className="flex w-max gap-3 pr-4 sm:gap-4 sm:pr-6 md:gap-8 md:pr-8">
            {products.map((product) => (
              <div key={product._id} className="product-recommendations-scroll__item">
                <ProductCard product={product} compact hideAddToCart />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductRecommendationsRow;

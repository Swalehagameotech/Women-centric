export const NO_PRODUCTS_MESSAGE = 'No products found.';

function ProductsEmptyState({ message = NO_PRODUCTS_MESSAGE, className = '' }) {
  return (
    <p
      className={`py-8 text-center text-sm font-medium text-black/60 sm:py-10 ${className}`}
      role="status"
    >
      {message}
    </p>
  );
}

export default ProductsEmptyState;

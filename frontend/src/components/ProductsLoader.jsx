function Spinner({ size = 'md' }) {
  const sizeClass =
    size === 'sm' ? 'h-7 w-7 border-2' : size === 'lg' ? 'h-12 w-12 border-[3px]' : 'h-9 w-9 border-2';

  return (
    <div
      className={`animate-spin rounded-full border-primary/15 border-t-primary ${sizeClass}`}
      aria-hidden="true"
    />
  );
}

function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid mt-6 sm:mt-8" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="mx-auto w-full max-w-[155px] animate-pulse">
          <div className="aspect-[7/8] w-full bg-stone-200/90" />
          <div className="mx-auto mt-2 h-3 w-[80%] rounded bg-stone-200/90" />
          <div className="mx-auto mt-1.5 h-3 w-1/2 rounded bg-stone-200/80" />
          <div className="mt-2 h-8 w-full rounded border border-stone-200/90 bg-stone-100" />
        </div>
      ))}
    </div>
  );
}

function ProductsLoader({
  label = 'Loading products…',
  variant = 'section',
  skeleton = false,
  skeletonCount = 8,
  className = '',
}) {
  const padding =
    variant === 'page'
      ? 'flex min-h-[min(50vh,420px)] flex-col items-center justify-center py-16'
      : variant === 'inline'
        ? 'flex flex-col items-center justify-center py-6'
        : 'flex flex-col items-center justify-center py-10 sm:py-12';

  const spinnerSize = variant === 'page' ? 'lg' : variant === 'inline' ? 'sm' : 'md';

  return (
    <div className={`${padding} ${className}`} role="status" aria-live="polite" aria-busy="true">
      <Spinner size={spinnerSize} />
      <p className="mt-4 text-center text-sm font-medium tracking-wide text-black/55">{label}</p>
      {skeleton && <ProductGridSkeleton count={skeletonCount} />}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export { ProductGridSkeleton, ProductsLoader, Spinner };
export default ProductsLoader;

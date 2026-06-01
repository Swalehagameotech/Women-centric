import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryToSlug } from '../utils/products';

function MobileCatalogSheet({ open, onClose, categories }) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[95] md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close catalog"
      />

      <div className="absolute bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-0 right-0 flex h-[58vh] max-h-[58dvh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-black/10 px-4 py-3">
          <h2 className="text-base font-semibold text-black">All Categories</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-black/60 hover:bg-black/5"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-3 pb-6 [-webkit-overflow-scrolling:touch]">
          {categories.length === 0 ? (
            <p className="py-6 text-center text-sm text-black/60">No categories found.</p>
          ) : (
            <ul className="space-y-3">
              {categories.map((category) => {
                const slug = categoryToSlug(category.name);

                return (
                  <li key={category._id} className="rounded-xl border border-black/10">
                    <Link
                      to={`/category/${slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3"
                    >
                      <span className="h-12 w-12 shrink-0 overflow-hidden border border-primary/15 bg-stone-100">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </span>
                      <span className="text-sm font-semibold text-black">{category.name}</span>
                    </Link>

                    {category.subcategory?.length > 0 && (
                      <div className="border-t border-black/5 px-3 py-2">
                        <div className="-mx-3 overflow-x-auto overscroll-x-contain px-3 pb-0.5 scrollbar-hide [touch-action:pan-x]">
                          <ul className="flex w-max flex-nowrap items-center gap-2">
                            <li className="shrink-0">
                              <Link
                                to={`/category/${slug}`}
                                onClick={onClose}
                                className="inline-block whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-medium text-white"
                              >
                                All
                              </Link>
                            </li>
                            {category.subcategory.map((sub) => (
                              <li key={sub} className="shrink-0">
                                <Link
                                  to={`/category/${slug}?subcategory=${encodeURIComponent(sub)}`}
                                  onClick={onClose}
                                  className="inline-block whitespace-nowrap rounded-full border border-primary/30 px-3 py-1 text-xs font-medium text-primary"
                                >
                                  {sub}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileCatalogSheet;

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCategoryFilter } from '../context/CategoryFilterContext';
import { categoryToSlug, formatPrice } from '../utils/products';

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MobileSideDrawer({ open, onClose, categories }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedIn, requireAuth, openAuth, signOut } = useAuth();
  const {
    isActive: filterAvailable,
    priceBounds,
    priceMax,
    setPriceMax,
    resetPriceMax,
  } = useCategoryFilter();
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const isCategoryPage = /^\/category\/[^/]+/.test(location.pathname);
  const showFilterLink = isCategoryPage && filterAvailable;

  useEffect(() => {
    if (!open) {
      setExpandedCategoryId(null);
      setFilterPanelOpen(false);
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const goTo = (path) => {
    onClose();
    requireAuth(() => navigate(path), 'login');
  };

  const goToPublic = (path) => {
    onClose();
    navigate(path);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategoryId((current) => (current === categoryId ? null : categoryId));
  };

  const closeFilterPanel = () => setFilterPanelOpen(false);

  const applyFilter = () => {
    setFilterPanelOpen(false);
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[160] md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close menu"
      />

      <aside className="absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-4">
          {filterPanelOpen ? (
            <>
              <button
                type="button"
                onClick={closeFilterPanel}
                className="flex h-9 w-9 items-center justify-center rounded-full text-black/60 hover:bg-black/5"
                aria-label="Back to menu"
              >
                <BackIcon />
              </button>
              <h2 className="flex-1 text-center text-base font-semibold text-black">Price filter</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-black/60 hover:bg-black/5"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </>
          ) : (
            <>
              <h2 className="text-base font-semibold text-black">Menu</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-black/60 hover:bg-black/5"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </>
          )}
        </div>

        {filterPanelOpen ? (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
              <p className="text-sm text-black/60">
                Showing products from {formatPrice(priceBounds.min)} up to your chosen max price.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <span className="text-sm font-medium text-black/80">Min price</span>
                  <p className="mt-2 rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-base font-semibold text-black">
                    {formatPrice(priceBounds.min)}
                  </p>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-black/80">Max price (₹)</span>
                  <input
                    type="number"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="mt-2 text-xs text-black/50">
                    Highest in this list: {formatPrice(priceBounds.max)}
                  </p>
                </label>
              </div>
            </div>

            <div className="flex gap-3 border-t border-black/10 p-4">
              <button
                type="button"
                onClick={resetPriceMax}
                className="flex-1 rounded-full border border-primary py-2.5 text-sm font-medium text-primary hover:bg-primary/5"
              >
                Reset
              </button>
              <button type="button" onClick={applyFilter} className="btn-solid flex-1 py-2.5 text-sm">
                Apply
              </button>
            </div>
          </>
        ) : (
          <>
            <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-3">
              <ul className="space-y-1">
                <li>
                  <button
                    type="button"
                    onClick={() => goTo('/orders')}
                    className="w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-black hover:bg-black/5"
                  >
                    Orders
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => goToPublic('/favourites')}
                    className="w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-black hover:bg-black/5"
                  >
                    Favourite
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => goTo('/account')}
                    className="w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-black hover:bg-black/5"
                  >
                    Account Settings
                  </button>
                </li>
                {showFilterLink && (
                  <li>
                    <button
                      type="button"
                      onClick={() => setFilterPanelOpen(true)}
                      className="w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-primary hover:bg-primary/5"
                    >
                      Filter
                    </button>
                  </li>
                )}
              </ul>

              <div className="my-4 border-t border-black/10 pt-4">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-primary">
                  Catalog — All Categories
                </p>

                {categories.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-black/60">No categories found.</p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {categories.map((category) => {
                      const slug = categoryToSlug(category.name);
                      const hasSubs =
                        Array.isArray(category.subcategory) && category.subcategory.length > 0;
                      const isExpanded = expandedCategoryId === category._id;

                      return (
                        <li key={category._id} className="rounded-xl border border-black/5">
                          <div className="flex items-center">
                            <Link
                              to={`/category/${slug}`}
                              onClick={onClose}
                              className="min-w-0 flex-1 px-3 py-3 text-sm font-semibold text-black hover:text-primary"
                            >
                              {category.name}
                            </Link>
                            {hasSubs && (
                              <button
                                type="button"
                                onClick={() => toggleCategory(category._id)}
                                className="flex h-11 w-11 shrink-0 items-center justify-center text-primary"
                                aria-expanded={isExpanded}
                                aria-label={`${isExpanded ? 'Hide' : 'Show'} ${category.name} subcategories`}
                              >
                                <ChevronIcon open={isExpanded} />
                              </button>
                            )}
                          </div>

                          {hasSubs && isExpanded && (
                            <ul className="space-y-1 border-t border-black/5 px-2 py-2">
                              <li>
                                <Link
                                  to={`/category/${slug}`}
                                  onClick={onClose}
                                  className="block rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary"
                                >
                                  All products
                                </Link>
                              </li>
                              {category.subcategory.map((sub) => (
                                <li key={sub}>
                                  <Link
                                    to={`/category/${slug}?subcategory=${encodeURIComponent(sub)}`}
                                    onClick={onClose}
                                    className="block rounded-lg px-3 py-2 text-xs font-medium text-black/80 hover:bg-black/5"
                                  >
                                    {sub}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </nav>

            <div className="border-t border-black/10 p-4">
              {loggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    onClose();
                  }}
                  className="w-full rounded-full border border-primary py-2.5 text-sm font-medium text-primary"
                >
                  Sign out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAuth('login');
                  }}
                  className="btn-solid w-full"
                >
                  Sign in
                </button>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default MobileSideDrawer;

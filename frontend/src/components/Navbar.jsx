import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import MobileSideDrawer from './MobileSideDrawer';
import { filterShopCategories } from '../utils/products';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 20-1.2-1.1C5.2 13.9 2 11 2 7.5 2 5 4 3 6.5 3c1.7 0 3.4.8 4.5 2.1C12.1 3.8 13.8 3 15.5 3 18 3 20 5 20 7.5c0 3.5-3.2 6.4-8.8 11.4Z" />
    </svg>
  );
}

function BasketIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 10h14l-1.5 9h-11Z" />
      <path d="M9 10a3 3 0 1 1 6 0" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  );
}

function Navbar({ categories = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, loggedIn, openAuth, signOut, requireAuth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    if (location.pathname === '/search') {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get('q') || '');
    }
  }, [location.pathname, location.search]);

  const submitSearch = (event) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  useLayoutEffect(() => {
    if (!menuOpen || !menuRef.current) {
      setMenuPosition(null);
      return;
    }

    const updatePosition = () => {
      const rect = menuRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const goToProtected = (path) => {
    setMenuOpen(false);
    requireAuth(() => navigate(path));
  };

  return (
    <>
      <header
        id="site-header"
        className="fixed top-0 left-0 right-0 z-[100] w-full overflow-visible border-b border-black/10 bg-header shadow-sm"
      >
        <nav className="relative z-10 mx-auto flex min-h-[52px] w-full max-w-[1400px] items-center gap-1.5 px-3 py-1.5 sm:min-h-[56px] sm:gap-2 sm:px-6 sm:py-2">
          <Link to="/" className="shrink-0">
            <img
              src="https://res.cloudinary.com/dsafvwkrf/image/upload/v1780062681/S_5_cnc086.png"
              alt="Style By Her logo"
              className="h-8 w-auto max-w-[100px] object-contain sm:h-10 sm:max-w-[140px] md:h-11 md:max-w-[160px]"
            />
          </Link>

          <form
            onSubmit={submitSearch}
            className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-black/15 bg-white px-2.5 py-1.5 md:hidden"
          >
            <span className="text-primary">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-black outline-none placeholder:text-black/40"
            />
          </form>

          <form
            onSubmit={submitSearch}
            className="pointer-events-none absolute inset-0 hidden items-center justify-center md:flex"
          >
            <div className="pointer-events-auto flex w-full max-w-md items-center gap-1.5 rounded-md border border-black/15 bg-white px-3 py-1.5 text-black/50 shadow-sm lg:max-w-lg">
              <span className="text-primary">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full border-0 bg-transparent text-sm text-black outline-none placeholder:text-black/40"
              />
            </div>
          </form>

          <div className="ml-auto hidden shrink-0 items-center gap-1 sm:gap-2 md:flex">
            <Link
              to="/favourites"
              className="relative min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-1 text-[10px] font-medium text-primary transition hover:bg-black/5 inline-flex"
            >
              <span className="relative inline-flex">
                <HeartIcon />
                {wishlistCount > 0 && (
                  <span className="absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-white">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </span>
              <span>Favourite</span>
            </Link>

            <Link
              to="/basket"
              className="relative min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-1 text-[10px] font-medium text-primary transition hover:bg-black/5 inline-flex"
            >
              <span className="relative inline-flex">
                <BasketIcon />
                {cartCount > 0 && (
                  <span className="absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </span>
              <span>Basket</span>
            </Link>

            {loggedIn ? (
              <span
                className="rounded-lg border border-primary/30 px-3 py-1 text-xs font-medium text-primary"
                aria-label={`Signed in as ${user?.name || 'user'}`}
              >
                {user?.name?.split(' ')[0] || 'Account'}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white transition hover:bg-primary-dark"
              >
                Sign in
              </button>
            )}

            <div ref={menuRef} className="relative z-[150]">
              <button
                type="button"
                onClick={() => setMenuOpen((currentValue) => !currentValue)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 text-primary transition hover:bg-black/5"
                aria-label="Open more options"
              >
                <MoreIcon />
              </button>

              {menuOpen && menuPosition && (
                <div
                  className="fixed z-[150] w-48 rounded-2xl border border-black/10 bg-white p-2 shadow-2xl"
                  style={{ top: menuPosition.top, right: menuPosition.right }}
                >
                  <button
                    type="button"
                    onClick={() => goToProtected('/account')}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-black transition hover:bg-black/5"
                  >
                    Account Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => goToProtected('/orders')}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-black transition hover:bg-black/5"
                  >
                    Orders
                  </button>

                  <div className="my-1 border-t border-black/10" />

                  {loggedIn ? (
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-primary transition hover:bg-black/5"
                    >
                      Sign out
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        openAuth('login');
                        setMenuOpen(false);
                      }}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-primary transition hover:bg-black/5"
                    >
                      Sign in
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/30 text-primary transition hover:bg-black/5 md:hidden"
            aria-label="Open menu"
          >
            <MoreIcon />
          </button>
        </nav>
      </header>

      <MobileSideDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={filterShopCategories(categories)}
      />

      <div className="h-[var(--site-header-height)] shrink-0" aria-hidden="true" />
    </>
  );
}

export default Navbar;

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
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
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
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

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  return (
    <header id="site-header" className="sticky top-0 z-50 border-b border-stone-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0 font-serif text-lg font-semibold tracking-tight text-rose-900 sm:text-xl">
          Lumière
          <span className="block text-[9px] font-sans font-normal uppercase tracking-[0.18em] text-rose-500">
            Women&apos;s Collection
          </span>
        </Link>

        <div className="hidden max-w-md flex-1 items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-stone-500 md:flex">
          <SearchIcon />
          <input
            type="text"
            placeholder="What are you looking for?"
            className="w-full border-0 bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-600 md:hidden"
            aria-label="Search"
          >
            <SearchIcon />
          </button>

          <button
            type="button"
            className="hidden min-w-[72px] flex-col items-center justify-center rounded-2xl px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100 sm:inline-flex"
          >
            <HeartIcon />
            <span>Favourite</span>
          </button>

          <button
            type="button"
            className="hidden min-w-[72px] flex-col items-center justify-center rounded-2xl px-3 py-1.5 text-xs font-medium text-stone-700 transition hover:bg-stone-100 sm:inline-flex"
          >
            <BasketIcon />
            <span>Basket</span>
          </button>

          <button
            type="button"
            className="rounded-full bg-rose-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-800"
          >
            Sign In / Sign Out
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((currentValue) => !currentValue)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition hover:bg-stone-100"
              aria-label="Open more options"
            >
              <MoreIcon />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-stone-200 bg-white p-2 shadow-lg">
                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-100"
                >
                  Account Settings
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-100"
                >
                  Orders
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

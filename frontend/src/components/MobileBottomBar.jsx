import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m4 11 8-7 8 7" />
      <path d="M6 10v9h12v-9" />
    </svg>
  );
}

function CatalogIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 10h14l-1.5 9h-11Z" />
      <path d="M9 10a3 3 0 1 1 6 0" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-4 3.6-6 7-6s7 2 7 6" />
    </svg>
  );
}

function MobileBottomBar({ catalogOpen, onCatalogToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { user, loggedIn, requireAuth } = useAuth();

  const isHome = location.pathname === '/';
  const isCart = location.pathname === '/basket';
  const isAccount = location.pathname === '/account';

  const accountLabel = loggedIn && user?.name ? user.name.split(' ')[0] : 'Account';

  const itemClass = (active) =>
    `relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-medium transition ${
      active ? 'bg-black/8 text-primary' : 'text-black/60'
    }`;

  const handleAccountClick = () => {
    requireAuth(() => navigate('/account'));
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[90] w-full border-t border-black/10 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-1.5">
        <Link to="/" className={itemClass(isHome)}>
          <HomeIcon />
          <span>Home</span>
        </Link>

        <button type="button" onClick={onCatalogToggle} className={itemClass(catalogOpen)}>
          <CatalogIcon />
          <span>Catalog</span>
        </button>

        <Link to="/basket" className={itemClass(isCart)}>
          <span className="relative">
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </span>
          <span>Basket</span>
        </Link>

        <button type="button" onClick={handleAccountClick} className={itemClass(isAccount)}>
          <UserIcon />
          <span className="max-w-[4.5rem] truncate">{accountLabel}</span>
        </button>
      </div>
    </nav>
  );
}

export default MobileBottomBar;

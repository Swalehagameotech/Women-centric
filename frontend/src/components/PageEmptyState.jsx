import { Link } from 'react-router-dom';

export const SITE_EXPLORE_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-and-conditions', label: 'Terms & Conditions' },
  { to: '/shipping-and-returns', label: 'Shipping & Returns' },
];

export function PageTitle({ children, align = 'left', className = '' }) {
  const alignClass =
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

  return (
    <h1 className={`font-serif text-3xl font-medium text-black sm:text-4xl ${alignClass} ${className}`}>
      {children}
    </h1>
  );
}

function PageEmptyState({ message, hint, children, showExploreLinks = true }) {
  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:mt-10 sm:p-10">
      <p className="text-base leading-relaxed text-black/80">{message}</p>
      {hint && <p className="mt-2 text-sm text-black/60">{hint}</p>}

      {children && <div className="mt-6">{children}</div>}

      {showExploreLinks && (
      <nav className="mt-8 border-t border-black/10 pt-6" aria-label="Explore site">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">
          You may also visit
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {SITE_EXPLORE_LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="text-sm font-medium text-primary transition hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      )}
    </div>
  );
}

export default PageEmptyState;

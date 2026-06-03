import { Link } from 'react-router-dom';

export const SITE_EXPLORE_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-and-conditions', label: 'Terms & Conditions' },
  { to: '/shipping-and-returns', label: 'Shipping & Returns' },
];

export const SECTION_TITLE_BASE = 'font-serif font-bold text-[#5e303e]';

const sectionTitleSizeClass = {
  lg: 'text-3xl sm:text-4xl',
  md: 'text-2xl sm:text-3xl',
  xl: 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl lg:leading-[0.95]',
};

function sectionTitleAlignClass(align) {
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';
  return 'text-left';
}

export function sectionTitleClasses({ align = 'left', size = 'lg', className = '' } = {}) {
  return `${SECTION_TITLE_BASE} ${sectionTitleSizeClass[size] || sectionTitleSizeClass.lg} ${sectionTitleAlignClass(align)} ${className}`.trim();
}

export function PageTitle({ children, align = 'left', size = 'lg', className = '' }) {
  return (
    <h1 className={sectionTitleClasses({ align, size, className })}>{children}</h1>
  );
}

export function SectionTitle({
  children,
  align = 'center',
  size = 'lg',
  className = '',
  as: Tag = 'h2',
}) {
  return (
    <Tag className={sectionTitleClasses({ align, size, className })}>{children}</Tag>
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

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categoryToSlug } from '../utils/products';

function CategoryNavbar({ categories }) {
  const { slug: activeSlug } = useParams();
  const [activeDropdown, setActiveDropdown] = useState(null);

  if (!categories.length) {
    return null;
  }

  const openDropdown = (item, event) => {
    if (!item.subcategory?.length) {
      setActiveDropdown(null);
      return;
    }

    const dropdownWidth = 190;
    const rect = event.currentTarget.getBoundingClientRect();
    const centeredLeft = rect.left + rect.width / 2;
    const clampedLeft = Math.min(
      Math.max(centeredLeft, dropdownWidth / 2 + 8),
      window.innerWidth - dropdownWidth / 2 - 8,
    );

    setActiveDropdown({
      id: item._id,
      name: item.name,
      slug: categoryToSlug(item.name),
      subcategory: item.subcategory,
      left: clampedLeft,
      top: rect.bottom + 6,
    });
  };

  return (
    <nav
      className="fixed-category-nav bg-primary shadow-sm"
      aria-label="Shop categories"
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="flex min-h-[var(--category-nav-height)] w-full items-center overflow-x-auto overflow-y-visible px-6 py-1.5 scrollbar-hide sm:px-8 sm:py-2 md:px-10">
        <div className="grid w-full grid-flow-col auto-cols-fr items-center gap-x-1.5 sm:gap-x-2">
          {categories.map((item) => {
            const itemSlug = categoryToSlug(item.name);
            const isActive = activeSlug === itemSlug;

            return (
              <div key={item._id} className="group relative mx-auto w-full min-w-0">
                <Link
                  to={`/category/${itemSlug}`}
                  className="relative z-10 flex w-full min-w-0 items-center justify-center focus:outline-none"
                  onMouseEnter={(event) => openDropdown(item, event)}
                  onFocus={(event) => openDropdown(item, event)}
                >
                  <span
                    className={`w-full px-0.5 text-center text-[11px] font-semibold leading-tight transition sm:text-[12px] ${
                      isActive ? 'text-white' : 'text-white/85 group-hover:text-white'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {activeDropdown?.subcategory?.length > 0 && (
        <div
          className="pointer-events-auto fixed z-[120] w-[190px] -translate-x-1/2 rounded-xl border border-primary/20 bg-white p-3 shadow-xl"
          style={{ left: `${activeDropdown.left}px`, top: `${activeDropdown.top}px` }}
        >
          <p className="mb-2 text-left text-xs font-semibold text-primary">
            {activeDropdown.name}
          </p>
          <ul className="space-y-1">
            {activeDropdown.subcategory.map((subItem) => (
              <li key={subItem}>
                <Link
                  to={`/category/${activeDropdown.slug}?subcategory=${encodeURIComponent(subItem)}`}
                  className="block rounded-lg px-2 py-1.5 text-left text-xs text-black transition hover:bg-black/5"
                  onClick={() => setActiveDropdown(null)}
                >
                  {subItem}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default CategoryNavbar;

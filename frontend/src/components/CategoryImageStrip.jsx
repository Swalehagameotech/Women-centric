import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryToSlug } from '../utils/products';

function CategoryImageStrip({ categories }) {
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
    <section
      className="relative z-40 bg-white pt-2 pb-1 mt-1 sm:mt-2"
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div className="w-full overflow-x-auto overflow-y-visible px-8 pb-1 scrollbar-hide sm:px-10 md:px-12">
        <div className="grid w-full grid-flow-col auto-cols-fr items-start gap-x-2 overflow-visible sm:gap-x-3">
          {categories.map((item) => (
            <div key={item._id} className="group relative mx-auto w-full min-w-0">
              <Link
                to={`/category/${categoryToSlug(item.name)}`}
                className="relative z-10 flex w-full min-w-0 flex-col items-center gap-1 focus:outline-none"
                onMouseEnter={(event) => openDropdown(item, event)}
                onFocus={(event) => openDropdown(item, event)}
              >
                <span className="h-10 w-10 shrink-0 overflow-hidden rounded-none border border-primary/20 bg-white shadow-sm transition group-hover:border-primary group-hover:shadow-md sm:h-12 sm:w-12">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="aspect-square h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </span>
                <span className="w-full px-0.5 text-center text-[10px] font-semibold leading-tight text-black transition group-hover:text-primary sm:text-[11px] md:text-[12px]">
                  {item.name}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {activeDropdown?.subcategory?.length > 0 && (
        <div
          className="pointer-events-auto fixed z-[120] w-[190px] -translate-x-1/2 rounded-xl border border-primary/15 bg-white p-3 shadow-xl"
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
    </section>
  );
}

export default CategoryImageStrip;

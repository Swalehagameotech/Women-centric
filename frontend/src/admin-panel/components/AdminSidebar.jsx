import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function Chevron({ open }) {
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

function NavIcon({ children }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center opacity-95">{children}</span>
  );
}

const linkClass = ({ isActive }) =>
  `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? 'bg-primary text-white shadow-md shadow-primary/25'
      : 'text-white/85 hover:bg-white/10 hover:text-white'
  }`;

const subLinkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2.5 text-sm transition ${
    isActive
      ? 'bg-primary/90 font-medium text-white'
      : 'text-white/70 hover:bg-white/10 hover:text-white'
  }`;

function AdminSidebar() {
  const { pathname } = useLocation();

  const [productsExpanded, setProductsExpanded] = useState(() =>
    pathname.startsWith('/admin/products'),
  );
  const [categoriesExpanded, setCategoriesExpanded] = useState(() =>
    pathname.startsWith('/admin/categories'),
  );

  useEffect(() => {
    if (pathname.startsWith('/admin/products')) setProductsExpanded(true);
    if (pathname.startsWith('/admin/categories')) setCategoriesExpanded(true);
  }, [pathname]);

  const showProducts = productsExpanded;
  const showCategories = categoriesExpanded;

  return (
    <aside className="flex h-screen w-[280px] shrink-0 flex-col border-r border-white/5 bg-[#1a1218] text-white shadow-xl">
      <div className="shrink-0 border-b border-white/10 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-base font-bold shadow-lg shadow-primary/30">
            SB
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold leading-tight">Style By Her</p>
            <p className="mt-0.5 text-xs text-white/50">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="admin-sidebar-nav flex-1 space-y-1.5 overflow-y-auto px-4 py-5">
        <NavLink to="/admin" end className={linkClass}>
          <NavIcon>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9.5Z" />
            </svg>
          </NavIcon>
          Dashboard
        </NavLink>

        <div>
          <button
            type="button"
            onClick={() => setProductsExpanded((v) => !v)}
            className={`flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
              pathname.startsWith('/admin/products')
                ? 'bg-white/10 text-white'
                : 'text-white/85 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              <NavIcon>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8Z" />
                  <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
                </svg>
              </NavIcon>
              Products
            </span>
            <Chevron open={showProducts} />
          </button>
          {showProducts && (
            <div className="ml-4 mt-1.5 space-y-1 border-l-2 border-primary/40 pl-4">
              <NavLink to="/admin/products" end className={subLinkClass}>
                All Products
              </NavLink>
              <NavLink to="/admin/products/add" className={subLinkClass}>
                Add Product
              </NavLink>
            </div>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => setCategoriesExpanded((v) => !v)}
            className={`flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
              pathname.startsWith('/admin/categories')
                ? 'bg-white/10 text-white'
                : 'text-white/85 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3">
              <NavIcon>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
                  <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </NavIcon>
              Categories
            </span>
            <Chevron open={showCategories} />
          </button>
          {showCategories && (
            <div className="ml-4 mt-1.5 space-y-1 border-l-2 border-primary/40 pl-4">
              <NavLink to="/admin/categories" end className={subLinkClass}>
                All Categories
              </NavLink>
              <NavLink to="/admin/categories/add" className={subLinkClass}>
                Add Category
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/admin/orders" className={linkClass}>
          <NavIcon>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
          </NavIcon>
          Orders
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <NavIcon>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </NavIcon>
          Users
        </NavLink>
      </nav>

      <div className="shrink-0 border-t border-white/10 px-5 py-4">
        <p className="text-center text-xs text-white/40">Style By Her · Admin</p>
      </div>
    </aside>
  );
}

export default AdminSidebar;

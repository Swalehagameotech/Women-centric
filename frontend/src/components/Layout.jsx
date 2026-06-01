import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import CategoryNavbar from './CategoryNavbar';
import CategoryImageStrip from './CategoryImageStrip';
import Footer from './Footer';
import MobileBottomBar from './MobileBottomBar';
import MobileCatalogSheet from './MobileCatalogSheet';
import { getApiBaseUrl } from '../config/env';
import { filterShopCategories } from '../utils/products';

const categoriesWithSubcategories = (categories) =>
  categories.filter(
    (category) => Array.isArray(category.subcategory) && category.subcategory.length > 0,
  );

function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const categoryStripRef = useRef(null);
  const [allCategories, setAllCategories] = useState([]);
  const [showHomeCategoryNav, setShowHomeCategoryNav] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);

  const navCategories = categoriesWithSubcategories(allCategories);
  const hasCategoryNav = navCategories.length > 0;

  useEffect(() => {
    setCatalogOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const controller = new AbortController();
    const loadCategories = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/categories`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const result = await response.json();
        setAllCategories(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load categories:', error);
        }
      }
    };

    loadCategories();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!isHomePage) {
      setShowHomeCategoryNav(false);
      return undefined;
    }

    const stripElement = categoryStripRef.current;

    if (!stripElement || !hasCategoryNav) {
      setShowHomeCategoryNav(false);
      return undefined;
    }

    const headerHeight =
      getComputedStyle(document.documentElement).getPropertyValue('--site-header-height').trim() ||
      '64px';

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowHomeCategoryNav(!entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: `-${headerHeight} 0px 0px 0px`,
        threshold: 0,
      },
    );

    observer.observe(stripElement);

    return () => observer.disconnect();
  }, [isHomePage, hasCategoryNav]);

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-white font-sans text-black">
      <Navbar categories={allCategories} />

      {/* Desktop / tablet: top category strip */}
      <div className="hidden md:contents">
        {!isHomePage && hasCategoryNav && (
          <>
            <CategoryNavbar categories={navCategories} />
            <div className="h-[var(--category-nav-height)] shrink-0" aria-hidden="true" />
          </>
        )}

        {isHomePage && showHomeCategoryNav && hasCategoryNav && (
          <CategoryNavbar categories={navCategories} />
        )}

        {isHomePage && hasCategoryNav && (
          <div ref={categoryStripRef}>
            <CategoryImageStrip categories={navCategories} />
          </div>
        )}
      </div>

      <main className="min-w-0 flex-1 overflow-x-clip pb-[calc(3.75rem+env(safe-area-inset-bottom))] md:pb-0">
        <Outlet />
      </main>

      <Footer />

      <MobileBottomBar
        catalogOpen={catalogOpen}
        onCatalogToggle={() => setCatalogOpen((open) => !open)}
      />
      <MobileCatalogSheet
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        categories={filterShopCategories(allCategories)}
      />
    </div>
  );
}

export default Layout;

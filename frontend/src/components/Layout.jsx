import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import CategoryNavbar from './CategoryNavbar';
import CategoryImageStrip from './CategoryImageStrip';
import Footer from './Footer';

function Layout() {
  const categoryRowRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [showStickyCategoryBar, setShowStickyCategoryBar] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

    const loadCategories = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/categories`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const result = await response.json();
        setCategories(Array.isArray(result.data) ? result.data : []);
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
    const updateStickyCategoryBar = () => {
      const categoryRowElement = categoryRowRef.current;

      if (!categoryRowElement || !categories.length) {
        setShowStickyCategoryBar(false);
        return;
      }

      const headerOffset = window.innerWidth >= 640 ? 72 : 68;
      const categoryRowBottom = categoryRowElement.getBoundingClientRect().bottom;

      setShowStickyCategoryBar(categoryRowBottom <= headerOffset);
    };

    updateStickyCategoryBar();
    window.addEventListener('scroll', updateStickyCategoryBar, { passive: true });
    window.addEventListener('resize', updateStickyCategoryBar);

    return () => {
      window.removeEventListener('scroll', updateStickyCategoryBar);
      window.removeEventListener('resize', updateStickyCategoryBar);
    };
  }, [categories.length]);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-stone-800">
      <Navbar />
      {showStickyCategoryBar && <CategoryNavbar categories={categories} />}
      {categories.length > 0 && (
        <div ref={categoryRowRef}>
          <CategoryImageStrip categories={categories} />
        </div>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;

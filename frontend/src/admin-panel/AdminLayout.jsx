import { Outlet, useLocation } from 'react-router-dom';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';

const PAGE_TITLES = {
  '/admin': 'Dashboard',
  '/admin/products': 'All Products',
  '/admin/products/add': 'Add Product',
  '/admin/categories': 'All Categories',
  '/admin/categories/add': 'Add Category',
  '/admin/orders': 'Orders',
  '/admin/users': 'Users',
};

function resolveTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/admin/products/edit/')) return 'Edit Product';
  if (pathname.startsWith('/admin/categories/edit/')) return 'Edit Category';
  return 'Admin';
}

function AdminLayout() {
  const { pathname } = useLocation();
  const title = resolveTitle(pathname);

  return (
    <div className="admin-shell flex h-screen overflow-hidden bg-[#f3eef1]">
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminHeader title={title} />
        <main className="admin-content flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

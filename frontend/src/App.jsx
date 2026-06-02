import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CategoryFilterProvider } from './context/CategoryFilterContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import CategoryPage from './pages/CategoryPage';
import Basket from './pages/Basket';
import Favourites from './pages/Favourites';
import ProductDetail from './pages/ProductDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ShippingReturns from './pages/ShippingReturns';
import AccountSettings from './pages/AccountSettings';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Checkout from './pages/Checkout';
import Search from './pages/Search';
import AdminLayout from './admin-panel/AdminLayout';
import AdminLogin from './admin-panel/pages/AdminLogin';
import Dashboard from './admin-panel/pages/Dashboard';
import AllProducts from './admin-panel/pages/products/AllProducts';
import AddProduct from './admin-panel/pages/products/AddProduct';
import EditProduct from './admin-panel/pages/products/EditProduct';
import AllCategories from './admin-panel/pages/categories/AllCategories';
import AddCategory from './admin-panel/pages/categories/AddCategory';
import EditCategory from './admin-panel/pages/categories/EditCategory';
import AdminOrders from './admin-panel/pages/Orders';
import AdminUsers from './admin-panel/pages/Users';
import AdminOrderDetail from './admin-panel/pages/OrderDetail';
import AdminAccountSettings from './admin-panel/pages/AccountSettings';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CategoryFilterProvider>
            <ScrollToTop />
            <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AllProducts />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="categories" element={<AllCategories />} />
              <Route path="categories/add" element={<AddCategory />} />
              <Route path="categories/edit/:id" element={<EditCategory />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="account" element={<AdminAccountSettings />} />
            </Route>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="category/:slug" element={<CategoryPage />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="basket" element={<Basket />} />
              <Route
                path="checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route path="search" element={<Search />} />
              <Route path="favourites" element={<Favourites />} />
              <Route
                path="account"
                element={
                  <ProtectedRoute>
                    <AccountSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="shipping-and-returns" element={<ShippingReturns />} />
            </Route>
            </Routes>
          </CategoryFilterProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

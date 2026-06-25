import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProductsPage from './pages/Products';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';

// Components
import ToastContainer from './components/Toast';

// Store
import { useAuthStore } from './store/useStore';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/auth/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  useEffect(() => {
    // Initialize theme from localStorage
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Aura Essence - Luxury Fragrances</title>
        <meta
          name="description"
          content="Discover premium fragrances from Aura Essence. Luxury perfumes for men and women."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Aura Essence - Luxury Fragrances" />
        <meta
          property="og:description"
          content="Discover premium fragrances from Aura Essence"
        />
        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80"
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* Product Details (will create next) */}
          {/* <Route path="/product/:id" element={<ProductDetails />} /> */}

          {/* Protected Routes */}
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} /> */}
          {/* <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> */}

          {/* Admin Routes */}
          {/* <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} /> */}
          {/* <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} /> */}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
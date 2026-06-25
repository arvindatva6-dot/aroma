import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch, FiHeart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useStore';
import { useCartStore } from '../store/useStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { getCartCount } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileDropdown(false);
    navigate('/');
  };

  const cartCount = getCartCount();

  const navLinks = [
    { name: 'Shop', href: '/products' },
    { name: 'New Arrivals', href: '/products?sort=newest' },
    { name: 'Best Sellers', href: '/products?bestsellers=true' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <nav className="fixed w-full top-0 z-50 glass-dark border-b border-dark-700/50">
      <div className="container-luxury">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-display font-bold text-dark-50 hover:text-gold-400 transition-colors"
          >
            <span className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center text-dark-900 font-bold">
              AE
            </span>
            Aura Essence
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-dark-300 hover:text-gold-400 transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            {/* Search - Desktop only */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-dark-800/50 rounded-full hover:bg-dark-700 transition-colors">
              <FiSearch className="w-5 h-5 text-dark-400" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="text-dark-400 hover:text-gold-400 transition-colors relative"
            >
              <FiHeart className="w-6 h-6" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="text-dark-400 hover:text-gold-400 transition-colors relative"
            >
              <FiShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold-500 text-dark-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-dark-800/50 rounded-full hover:bg-dark-700 transition-colors"
                >
                  <img
                    src={user.profileImage}
                    alt={user.firstName}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="hidden sm:inline text-sm">{user.firstName}</span>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 glass-dark rounded-xl overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-dark-200 hover:text-gold-400 hover:bg-dark-800/50"
                        onClick={() => setProfileDropdown(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-3 text-dark-200 hover:text-gold-400 hover:bg-dark-800/50 border-t border-dark-700/50"
                        onClick={() => setProfileDropdown(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-dark-200 hover:text-gold-400 hover:bg-dark-800/50 border-t border-dark-700/50"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-gold text-dark-900 font-semibold rounded-full hover:shadow-glow transition-all"
              >
                <FiUser className="w-4 h-4" />
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-dark-400 hover:text-gold-400 transition-colors"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-dark-700/50"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block px-4 py-2 text-dark-300 hover:text-gold-400 hover:bg-dark-800/50 rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                {!user && (
                  <Link
                    to="/auth/login"
                    className="block px-4 py-2 mt-4 bg-gradient-gold text-dark-900 font-semibold rounded-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
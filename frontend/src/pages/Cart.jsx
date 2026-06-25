import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCartStore, useAuthStore, useNotificationStore } from '../store/useStore';

const TAX_RATE = 0.18; // 18% GST, matches backend calculation

const CartPage = () => {
  const { items, removeItem, updateQuantity } = useCartStore();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0
  );
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const handleQuantityChange = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    updateQuantity(item._id, newQty);
  };

  const handleRemove = (item) => {
    removeItem(item._id);
    addNotification({
      type: 'info',
      title: 'Removed',
      message: `${item.name} removed from cart`
    });
  };

  const handleCheckout = () => {
    if (!user) {
      addNotification({
        type: 'error',
        title: 'Login Required',
        message: 'Please log in to proceed to checkout'
      });
      navigate('/auth/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="bg-gradient-luxury min-h-screen">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="container-luxury">
          <h1 className="section-title">Shopping Cart</h1>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-dark rounded-3xl p-16 text-center mt-8"
            >
              <FiShoppingBag className="w-16 h-16 text-dark-500 mx-auto mb-6" />
              <h2 className="text-2xl font-display font-bold text-dark-50 mb-2">
                Your cart is empty
              </h2>
              <p className="text-dark-400 mb-8">
                Looks like you haven't added any fragrances yet.
              </p>
              <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                Continue Shopping
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="glass-dark rounded-2xl p-4 flex items-center gap-4"
                    >
                      {/* Image */}
                      <img
                        src={item.images?.main_image}
                        alt={item.name}
                        className="w-24 h-24 rounded-xl object-cover bg-dark-800/50 flex-shrink-0"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
                          {item.brand}
                        </p>
                        <h3 className="text-dark-50 font-semibold line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-dark-400 text-sm mt-1">
                          ₹{item.finalPrice.toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-3 bg-dark-800/50 rounded-full px-2 py-1">
                        <button
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={item.quantity <= 1}
                          className="p-2 text-dark-300 hover:text-gold-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <FiMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-dark-50 font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item, 1)}
                          className="p-2 text-dark-300 hover:text-gold-400 transition-colors"
                        >
                          <FiPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right w-28 flex-shrink-0">
                        <p className="text-gold-400 font-bold">
                          ₹{(item.finalPrice * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item)}
                        className="p-2 text-dark-500 hover:text-red-400 transition-colors flex-shrink-0"
                        title="Remove item"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="glass-dark rounded-2xl p-6 sticky top-32 space-y-4">
                  <h2 className="text-xl font-display font-bold text-dark-50 mb-2">
                    Order Summary
                  </h2>

                  <div className="flex justify-between text-dark-300">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-dark-300">
                    <span>GST (18%)</span>
                    <span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="border-t border-dark-700/50 pt-4 flex justify-between text-dark-50 font-bold text-lg">
                    <span>Total</span>
                    <span className="text-gold-400">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 mt-4"
                  >
                    Proceed to Checkout
                    <FiArrowRight className="w-4 h-4" />
                  </motion.button>

                  <Link
                    to="/products"
                    className="block text-center text-dark-400 hover:text-gold-400 text-sm transition-colors pt-2"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;

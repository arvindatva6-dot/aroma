import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FiMapPin, FiLock, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCartStore, useAuthStore, useNotificationStore } from '../store/useStore';
import { cartAPI, orderAPI } from '../utils/api';

const TAX_RATE = 0.18;

// Dynamically loads the Razorpay checkout script (not included in index.html
// by default, since we only want it on the checkout page).
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const CheckoutPage = () => {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Guard: nothing to check out, or cart is empty
  if (items.length === 0) {
    return <Navigate to="/cart" />;
  }

  const subtotal = getCartTotal();
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    const { street, city, state, postalCode, country } = formData;
    if (!street || !city || !state || !postalCode || !country) {
      addNotification({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in your complete shipping address'
      });
      return;
    }

    setIsProcessing(true);

    try {
      // The backend builds the order from the DB-stored cart (not from
      // localStorage), so we sync our local cart to the server first.
      try {
        await cartAPI.clearCart();
      } catch (err) {
        // No existing cart yet — safe to ignore.
      }

      for (const item of items) {
        await cartAPI.addToCart({ productId: item._id, quantity: item.quantity });
      }

      // Fetch the authoritative, server-calculated cart total (subtotal + GST).
      const { data: cartData } = await cartAPI.getCart();
      const serverTotal = cartData.cart.total;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        addNotification({
          type: 'error',
          title: 'Payment Error',
          message: 'Could not load payment gateway. Check your connection and try again.'
        });
        setIsProcessing(false);
        return;
      }

      const { data: orderData } = await orderAPI.createRazorpayOrder({
        amount: serverTotal
      });
      const { razorpayOrder } = orderData;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Aura Essence',
        description: 'Luxury Fragrance Order',
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            await orderAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingData: formData
            });

            clearCart();
            addNotification({
              type: 'success',
              title: 'Order Placed!',
              message: 'Your order has been confirmed. Thank you for shopping with us.'
            });
            navigate('/');
          } catch (err) {
            addNotification({
              type: 'error',
              title: 'Payment Verification Failed',
              message:
                err.response?.data?.message ||
                'We could not confirm your payment. Please contact support.'
            });
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false)
        },
        prefill: {
          name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: { color: '#d4a824' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Checkout Failed',
        message: error.response?.data?.message || 'Something went wrong. Please try again.'
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gradient-luxury min-h-screen">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="container-luxury">
          <h1 className="section-title">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Shipping Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 glass-dark rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FiMapPin className="w-5 h-5 text-gold-400" />
                <h2 className="text-2xl font-display font-bold text-dark-50">
                  Shipping Address
                </h2>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-dark-200 font-medium">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="input-luxury"
                    placeholder="123 Fragrance Lane"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-dark-200 font-medium">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input-luxury"
                      placeholder="Chennai"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-dark-200 font-medium">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="input-luxury"
                      placeholder="Tamil Nadu"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-dark-200 font-medium">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="input-luxury"
                      placeholder="600001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-dark-200 font-medium">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="input-luxury"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isProcessing}
                  className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiLock className="w-4 h-4" />
                  {isProcessing ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
                  {!isProcessing && <FiArrowRight className="w-4 h-4" />}
                </motion.button>

                <p className="text-dark-500 text-xs text-center flex items-center justify-center gap-1">
                  <FiLock className="w-3 h-3" />
                  Secured by Razorpay
                </p>
              </form>
            </motion.div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-dark rounded-2xl p-6 sticky top-32 space-y-4">
                <h2 className="text-xl font-display font-bold text-dark-50 mb-2">
                  Order Summary
                </h2>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-dark-300 line-clamp-1 flex-1 mr-2">
                        {item.name} <span className="text-dark-500">×{item.quantity}</span>
                      </span>
                      <span className="text-dark-200 flex-shrink-0">
                        ₹{(item.finalPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dark-700/50 pt-4 space-y-2">
                  <div className="flex justify-between text-dark-300 text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-dark-300 text-sm">
                    <span>GST (18%)</span>
                    <span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-dark-50 font-bold text-lg pt-2 border-t border-dark-700/50">
                    <span>Total</span>
                    <span className="text-gold-400">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;

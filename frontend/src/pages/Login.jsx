import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '../store/useStore';
import { useNotificationStore } from '../store/useStore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        addNotification({
          type: 'error',
          title: 'Validation Error',
          message: 'Please fill in all fields'
        });
        return;
      }

      await login({ email, password });

      addNotification({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome back!'
      });

      navigate('/');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      addNotification({
        type: 'error',
        title: 'Login Failed',
        message: errorMsg
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-luxury min-h-screen">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block space-y-6"
            >
              <div>
                <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">
                  Welcome Back
                </span>
                <h1 className="section-title mt-4">
                  Login to Your{' '}
                  <span className="text-gradient-gold">Aura Essence</span> Account
                </h1>
              </div>

              <p className="text-dark-300 text-lg">
                Access your orders, wishlist, and personalized recommendations.
              </p>

              <div className="space-y-4 pt-8">
                {[
                  'View your order history',
                  'Save favorite fragrances',
                  'Exclusive member offers',
                  'Personalized recommendations'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center">
                      <FiArrowRight className="w-4 h-4 text-gold-400" />
                    </div>
                    <span className="text-dark-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-dark p-8 lg:p-12 rounded-3xl"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-display font-bold text-dark-50">
                  Sign In
                </h2>
                <p className="text-dark-400 mt-2">
                  Enter your credentials to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-dark-200 font-medium">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-4 w-5 h-5 text-dark-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-luxury pl-12"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-dark-200 font-medium">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-4 w-5 h-5 text-dark-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-luxury pl-12 pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-dark-400 hover:text-dark-200"
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span className="text-dark-400">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  {!isLoading && <FiArrowRight className="w-4 h-4" />}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="my-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-700/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-dark-900/40 text-dark-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button className="btn-secondary">Google</button>
                <button className="btn-secondary">Apple</button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-dark-400 text-sm mt-8">
                Don't have an account?{' '}
                <Link
                  to="/auth/register"
                  className="text-gold-400 hover:text-gold-300 font-semibold transition-colors"
                >
                  Create one
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
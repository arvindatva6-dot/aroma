import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '../store/useStore';
import { useNotificationStore } from '../store/useStore';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        addNotification({
          type: 'error',
          title: 'Validation Error',
          message: 'Please fill in all fields'
        });
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        addNotification({
          type: 'error',
          title: 'Validation Error',
          message: 'Passwords do not match'
        });
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        addNotification({
          type: 'error',
          title: 'Validation Error',
          message: 'Password must be at least 6 characters'
        });
        setIsLoading(false);
        return;
      }

      await register(formData);

      addNotification({
        type: 'success',
        title: 'Account Created',
        message: 'Welcome to Aura Essence!'
      });

      navigate('/');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      addNotification({
        type: 'error',
        title: 'Registration Failed',
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
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-dark p-8 lg:p-12 rounded-3xl"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">
                  Join Us
                </span>
                <h1 className="text-4xl font-display font-bold text-dark-50 mt-3">
                  Create Your Account
                </h1>
                <p className="text-dark-400 mt-2">
                  Join the Aura Essence community and start discovering premium fragrances
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-dark-200 font-medium">First Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-4 w-5 h-5 text-dark-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input-luxury pl-12"
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-dark-200 font-medium">Last Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-4 w-5 h-5 text-dark-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="input-luxury pl-12"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-dark-200 font-medium">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-4 w-5 h-5 text-dark-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-luxury pl-12"
                      placeholder="john@example.com"
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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
                  <p className="text-xs text-dark-500">
                    Minimum 6 characters required
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-dark-200 font-medium">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-4 w-5 h-5 text-dark-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-luxury pl-12 pr-12"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {/* Terms & Conditions */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded mt-1" required />
                  <span className="text-dark-400 text-sm">
                    I agree to the{' '}
                    <Link to="/terms" className="text-gold-400 hover:text-gold-300">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-gold-400 hover:text-gold-300">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 mt-8"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                  {!isLoading && <FiArrowRight className="w-4 h-4" />}
                </motion.button>
              </form>

              {/* Login Link */}
              <p className="text-center text-dark-400 text-sm mt-8">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="text-gold-400 hover:text-gold-300 font-semibold transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            >
              {[
                {
                  title: 'Exclusive Access',
                  desc: 'Get early access to new fragrances'
                },
                {
                  title: 'Rewards Program',
                  desc: 'Earn points on every purchase'
                },
                {
                  title: 'Expert Support',
                  desc: 'Personalized fragrance recommendations'
                }
              ].map((benefit, idx) => (
                <div key={idx} className="glass-dark p-6 rounded-xl text-center">
                  <h3 className="font-semibold text-dark-50 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-dark-400 text-sm">{benefit.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
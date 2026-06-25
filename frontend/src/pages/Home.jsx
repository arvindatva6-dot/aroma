import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck, FiTruck, FiShield, FiHelpCircle } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../utils/api';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [featuredRes, bestsellersRes, newRes] = await Promise.all([
          productAPI.getFeaturedProducts(),
          productAPI.getBestSellers(),
          productAPI.getNewArrivals()
        ]);

        setFeatured(featuredRes.data.products || []);
        setBestsellers(bestsellersRes.data.products || []);
        setNewArrivals(newRes.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <div className="bg-gradient-luxury min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block text-gold-400 font-semibold uppercase tracking-widest text-sm"
              >
                Welcome to Luxury
              </motion.span>

              <h1 className="section-title text-5xl lg:text-7xl leading-tight">
                Discover Your{' '}
                <span className="text-gradient-gold">Signature</span> Fragrance
              </h1>

              <p className="text-dark-300 text-lg max-w-2xl">
                Experience the essence of luxury with our curated collection of
                premium fragrances from around the world. Each scent tells a story.
              </p>

              <div className="flex gap-4 pt-4">
                <Link
                  to="/products"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Shop Now
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/about"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  Learn More
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                {[
                  { icon: FiTruck, text: 'Free Shipping' },
                  { icon: FiShield, text: 'Authentic Products' },
                  { icon: FiCheck, text: 'Easy Returns' }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <feature.icon className="w-5 h-5 text-gold-400" />
                    <span className="text-sm text-dark-300">{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative h-full min-h-[500px] hidden lg:flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-gold opacity-10 blur-3xl rounded-full" />
              <img
                src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80"
                alt="Premium Perfume Bottle"
                className="relative z-10 h-96 object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-dark-900/50">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">
              Curated Selection
            </span>
            <h2 className="section-title">Featured Fragrances</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Handpicked collection of our most exclusive and beloved scents
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featured.length > 0 ? (
              featured.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-dark-400">
                Loading products...
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">
              Customer Favorites
            </span>
            <h2 className="section-title">Best Sellers</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              The fragrances our customers love the most
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {bestsellers.length > 0 ? (
              bestsellers.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-dark-400">
                Loading products...
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-dark-900/50">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold-400 text-sm font-semibold uppercase tracking-widest">
              Latest Additions
            </span>
            <h2 className="section-title">New Arrivals</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Discover our newest fragrances added to the collection
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-dark-400">
                Loading products...
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-dark p-12 rounded-3xl text-center"
          >
            <h2 className="section-title mb-4">Explore Our Full Collection</h2>
            <p className="text-dark-300 max-w-2xl mx-auto mb-8">
              Browse hundreds of premium fragrances from top brands worldwide
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              View All Fragrances
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
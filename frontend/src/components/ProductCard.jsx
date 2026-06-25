import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiEye, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useStore';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product, 1);
    // Show toast notification
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const discount = product.discount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group h-full"
    >
      <Link to={`/product/${product._id}`} className="card-product h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-dark-800/50 h-80 flex items-center justify-center">
          {/* Main Image */}
          <img
            src={product.images.main_image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badge */}
          {discount > 0 && (
            <div className="absolute top-4 right-4 bg-gold-500 text-dark-900 px-3 py-1 rounded-full text-sm font-bold">
              -{discount}%
            </div>
          )}

          {product.is_new && (
            <div className="absolute top-4 left-4 bg-gradient-gold text-dark-900 px-3 py-1 rounded-full text-xs font-bold">
              NEW
            </div>
          )}

          {/* Actions Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-dark-900/60 flex items-center justify-center gap-3 backdrop-blur-sm"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="p-3 bg-gold-500 text-dark-900 rounded-full hover:bg-gold-600 transition-colors"
              title="Add to Cart"
            >
              <FiShoppingBag className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuickView(true)}
              className="p-3 bg-dark-700 text-dark-50 rounded-full hover:bg-dark-600 transition-colors"
              title="Quick View"
            >
              <FiEye className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWishlist}
              className={`p-3 rounded-full transition-colors ${
                isWishlisted
                  ? 'bg-gold-500 text-dark-900'
                  : 'bg-dark-700 text-dark-50 hover:bg-dark-600'
              }`}
              title="Add to Wishlist"
            >
              <FiHeart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Brand */}
          <p className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="text-dark-50 font-semibold text-base group-hover:text-gold-400 transition-colors line-clamp-2 mb-3">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(product.rating)
                      ? 'fill-gold-500 text-gold-500'
                      : 'text-dark-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-dark-400 text-xs">
              ({product.num_reviews} reviews)
            </span>
          </div>

          {/* Fragrance Type */}
          <p className="text-dark-400 text-xs mb-4">
            {product.fragrance_type} • {product.gender}
          </p>

          {/* Price */}
          <div className="mt-auto flex items-baseline gap-2">
            <span className="text-xl font-bold text-gold-400">
              ₹{product.finalPrice.toLocaleString('en-IN')}
            </span>
            {discount > 0 && (
              <span className="text-sm text-dark-500 line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
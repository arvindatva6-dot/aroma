import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    Shop: [
      { name: 'New Arrivals', href: '/products?sort=newest' },
      { name: 'Best Sellers', href: '/products?bestsellers=true' },
      { name: 'All Fragrances', href: '/products' },
      { name: 'Gift Sets', href: '/products?category=gift' }
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Story', href: '/story' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' }
    ],
    Support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faq' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' }
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Accessibility', href: '/accessibility' }
    ]
  };

  return (
    <footer className="bg-gradient-luxury border-t border-dark-700/50">
      <div className="container-luxury py-20">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 glass-dark p-8 rounded-3xl text-center"
        >
          <h3 className="text-3xl font-display font-bold text-dark-50 mb-2">
            Join Our Exclusive Circle
          </h3>
          <p className="text-dark-400 mb-6">
            Get early access to new fragrances, exclusive offers, and fragrance tips.
          </p>

          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-luxury flex-1"
              required
            />
            <button
              type="submit"
              className="btn-primary whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>

          {subscribed && (
            <p className="text-gold-400 text-sm mt-3">
              ✓ Thank you for subscribing!
            </p>
          )}
        </motion.div>

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center text-dark-900 font-bold">
                AE
              </span>
              <span className="text-xl font-display font-bold text-dark-50">
                Aura Essence
              </span>
            </div>
            <p className="text-dark-400 text-sm mb-6">
              Discover the essence of luxury with our curated collection of premium
              fragrances.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <FiPhone className="w-4 h-4 text-gold-500 mt-1" />
                <span className="text-dark-400">+1 (800) 123-4567</span>
              </div>
              <div className="flex items-start gap-3">
                <FiMail className="w-4 h-4 text-gold-500 mt-1" />
                <span className="text-dark-400">info@auraessence.com</span>
              </div>
              <div className="flex items-start gap-3">
                <FiMapPin className="w-4 h-4 text-gold-500 mt-1" />
                <span className="text-dark-400">
                  123 Luxury Ave, New York, NY 10001
                </span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-dark-50 mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-dark-400 hover:text-gold-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Bottom */}
        <div className="border-t border-dark-700/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-6">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-gold-400 transition-colors"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-gold-400 transition-colors"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-gold-400 transition-colors"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-400 hover:text-gold-400 transition-colors"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-dark-500 text-sm text-center md:text-right">
              © 2024 Aura Essence. All rights reserved. | Luxury Fragrances
            </p>
          </div>

          {/* Payment Methods */}
          <div className="mt-6 flex justify-center gap-4 pt-6 border-t border-dark-700/50">
            <span className="text-dark-500 text-xs">Secure payments via:</span>
            <div className="flex gap-3">
              {['Razorpay', 'Visa', 'Mastercard', 'UPI'].map((method) => (
                <span
                  key={method}
                  className="text-dark-600 text-xs bg-dark-800/30 px-2 py-1 rounded"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
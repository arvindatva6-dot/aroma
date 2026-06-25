import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiFilter,
  FiX,
  FiChevronDown,
  FiSearch,
  FiSliders
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../utils/api';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOptions, setFilterOptions] = useState({});

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await productAPI.getFilterOptions();
        setFilterOptions(res.data.filters);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          ...filters,
          sort: sortBy,
          search: searchQuery,
          page: currentPage,
          limit: 12
        };

        const res = await productAPI.getAllProducts(params);
        setProducts(res.data.products);
        setTotalPages(res.data.pages);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, sortBy, searchQuery, currentPage]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };

      if (Array.isArray(updatedFilters[filterType])) {
        if (updatedFilters[filterType].includes(value)) {
          updatedFilters[filterType] = updatedFilters[filterType].filter(
            (item) => item !== value
          );
        } else {
          updatedFilters[filterType] = [...updatedFilters[filterType], value];
        }
      } else {
        updatedFilters[filterType] = [value];
      }

      if (updatedFilters[filterType].length === 0) {
        delete updatedFilters[filterType];
      }

      return updatedFilters;
    });

    setCurrentPage(1);
  };

  const handlePriceRange = (min, max) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const FilterSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="border-b border-dark-700/50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-4 flex items-center justify-between text-dark-50 hover:text-gold-400 transition-colors"
        >
          <span className="font-semibold">{title}</span>
          <FiChevronDown
            className={`w-5 h-5 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pb-4 space-y-2"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="bg-gradient-luxury min-h-screen">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="container-luxury">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="section-title">Our Collection</h1>
            <p className="text-dark-400">
              Discover our curated selection of luxury fragrances
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <FiSearch className="absolute left-4 top-4 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search fragrances..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="input-luxury w-full pl-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-dark rounded-xl p-6 sticky top-24"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-dark-50 flex items-center gap-2">
                    <FiSliders className="w-5 h-5 text-gold-400" />
                    Filters
                  </h3>
                  {Object.keys(filters).length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-gold-400 hover:text-gold-300"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Brand Filter */}
                {filterOptions.brands && (
                  <FilterSection title="Brand">
                    <div className="space-y-2">
                      {filterOptions.brands.map((brand) => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.brand?.includes(brand) || false}
                            onChange={() => handleFilterChange('brand', brand)}
                            className="w-4 h-4 rounded accent-gold-500"
                          />
                          <span className="text-dark-400 text-sm hover:text-dark-200">
                            {brand}
                          </span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                )}

                {/* Fragrance Type Filter */}
                {filterOptions.fragranceTypes && (
                  <FilterSection title="Fragrance Type">
                    <div className="space-y-2">
                      {filterOptions.fragranceTypes.map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={
                              filters.fragrance_type?.includes(type) || false
                            }
                            onChange={() =>
                              handleFilterChange('fragrance_type', type)
                            }
                            className="w-4 h-4 rounded accent-gold-500"
                          />
                          <span className="text-dark-400 text-sm hover:text-dark-200">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                )}

                {/* Gender Filter */}
                {filterOptions.genders && (
                  <FilterSection title="Gender">
                    <div className="space-y-2">
                      {filterOptions.genders.map((gender) => (
                        <label
                          key={gender}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.gender?.includes(gender) || false}
                            onChange={() => handleFilterChange('gender', gender)}
                            className="w-4 h-4 rounded accent-gold-500"
                          />
                          <span className="text-dark-400 text-sm hover:text-dark-200">
                            {gender}
                          </span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                )}

                {/* Price Range Filter */}
                <FilterSection title="Price Range">
                  <div className="space-y-3">
                    {[
                      { label: '₹0 - ₹5000', min: 0, max: 5000 },
                      { label: '₹5000 - ₹10000', min: 5000, max: 10000 },
                      { label: '₹10000+', min: 10000, max: 100000 }
                    ].map((range) => (
                      <label
                        key={range.label}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            filters.minPrice === range.min &&
                            filters.maxPrice === range.max
                          }
                          onChange={() =>
                            handlePriceRange(range.min, range.max)
                          }
                          className="w-4 h-4 rounded accent-gold-500"
                        />
                        <span className="text-dark-400 text-sm hover:text-dark-200">
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6 flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FiFilter className="w-4 h-4" />
                  Filters
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="input-luxury flex-1"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Desktop Sort */}
              <div className="hidden lg:flex items-center justify-between mb-6">
                <p className="text-dark-400 text-sm">
                  Showing {products.length} products
                  {Object.keys(filters).length > 0 && ' (filtered)'}
                </p>

                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="input-luxury max-w-xs"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Mobile Filters Modal */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:hidden mb-6 glass-dark rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-dark-50">Filters</h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-dark-400 hover:text-dark-200"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Mobile filter content similar to desktop */}
                    {Object.keys(filters).length > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-gold-400 hover:text-gold-300 mb-4"
                      >
                        Clear Filters
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Products Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mb-4" />
                    <p className="text-dark-400">Loading products...</p>
                  </div>
                </div>
              ) : products.length > 0 ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                  >
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="btn-secondary disabled:opacity-50"
                      >
                        Previous
                      </button>

                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            currentPage === i + 1
                              ? 'bg-gold-500 text-dark-900 font-bold'
                              : 'btn-secondary'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="btn-secondary disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-dark-400 text-lg">
                    No products found. Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
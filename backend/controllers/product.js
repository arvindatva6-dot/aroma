import Product from '../models/Product.js';

// @desc    Get all products with filters and pagination
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    let query = {};
    const { brand, fragrance_type, gender, minPrice, maxPrice, sort, search, page = 1, limit = 12 } = req.query;

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by brand
    if (brand) {
      query.brand = { $in: Array.isArray(brand) ? brand : [brand] };
    }

    // Filter by fragrance type
    if (fragrance_type) {
      query.fragrance_type = { $in: Array.isArray(fragrance_type) ? fragrance_type : [fragrance_type] };
    }

    // Filter by gender
    if (gender) {
      query.gender = { $in: Array.isArray(gender) ? gender : [gender] };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.finalPrice = {};
      if (minPrice) query.finalPrice.$gte = Number(minPrice);
      if (maxPrice) query.finalPrice.$lte = Number(maxPrice);
    }

    // Only show active products
    query.is_active = true;

    // Sorting
    let sortBy = '-createdAt'; // Default sort
    if (sort) {
      switch (sort) {
        case 'popularity':
          sortBy = '-rating';
          break;
        case 'rating':
          sortBy = '-rating';
          break;
        case 'newest':
          sortBy = '-createdAt';
          break;
        case 'price-low':
          sortBy = 'finalPrice';
          break;
        case 'price-high':
          sortBy = '-finalPrice';
          break;
        default:
          sortBy = '-createdAt';
      }
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.min(parseInt(limit), 50);
    const skip = (pageNum - 1) * pageSize;

    // Execute query
    const products = await Product.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(pageSize)
      .populate('reviews', 'rating title review user');

    const total = await Product.countDocuments(query);
    const pages = Math.ceil(total / pageSize);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages,
      currentPage: pageNum,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'firstName lastName profileImage'
        }
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured/home
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ is_featured: true, is_active: true })
      .limit(6)
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
};

// @desc    Get best sellers
// @route   GET /api/products/bestsellers
// @access  Public
export const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ is_bestseller: true, is_active: true })
      .limit(6)
      .sort('-rating');

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching best sellers',
      error: error.message
    });
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ is_new: true, is_active: true })
      .limit(6)
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching new arrivals',
      error: error.message
    });
  }
};

// @desc    Get filter options
// @route   GET /api/products/filters/options
// @access  Public
export const getFilterOptions = async (req, res) => {
  try {
    const brands = await Product.distinct('brand', { is_active: true });
    const fragranceTypes = await Product.distinct('fragrance_type', { is_active: true });
    const genders = await Product.distinct('gender', { is_active: true });
    const minPrice = await Product.findOne({ is_active: true }).sort('finalPrice').select('finalPrice');
    const maxPrice = await Product.findOne({ is_active: true }).sort('-finalPrice').select('finalPrice');

    res.status(200).json({
      success: true,
      filters: {
        brands: brands.sort(),
        fragranceTypes,
        genders,
        priceRange: {
          min: minPrice?.finalPrice || 0,
          max: maxPrice?.finalPrice || 10000
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
};
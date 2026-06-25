import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Create review
// @route   POST /api/reviews/create
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { productId, rating, title, review, review_tags } = req.body;
    const userId = req.user.id;

    // Validation
    if (!productId || !rating || !title || !review) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user has purchased this product
    const purchasedOrder = await Order.findOne({
      user: userId,
      'items.product': productId,
      order_status: { $in: ['Delivered', 'Returned'] }
    });

    const newReview = await Review.create({
      product: productId,
      user: userId,
      rating,
      title,
      review,
      review_tags: review_tags || [],
      verified_purchase: !!purchasedOrder
    });

    await newReview.populate('user', 'firstName lastName profileImage');

    // Update product rating
    const allReviews = await Review.find({ product: productId });
    const avgRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      num_reviews: allReviews.length
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review: newReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'recent' } = req.query;
    const { productId } = req.params;

    let sortBy = '-createdAt';
    if (sort === 'helpful') {
      sortBy = '-helpful_count';
    } else if (sort === 'rating-high') {
      sortBy = '-rating';
    } else if (sort === 'rating-low') {
      sortBy = 'rating';
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      product: productId,
      is_approved: true
    })
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate('user', 'firstName lastName profileImage');

    const total = await Review.countDocuments({
      product: productId,
      is_approved: true
    });
    const pages = Math.ceil(total / limit);

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { product: productId, is_approved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pages,
      currentPage: page,
      reviews,
      ratingDistribution
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:reviewId/helpful
// @access  Private
export const markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { $inc: { helpful_count: 1 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Review marked as helpful',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking review',
      error: error.message
    });
  }
};

// @desc    Mark review as unhelpful
// @route   POST /api/reviews/:reviewId/unhelpful
// @access  Private
export const markUnhelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { $inc: { unhelpful_count: 1 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Review marked as unhelpful',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking review',
      error: error.message
    });
  }
};

// @desc    Get user reviews
// @route   GET /api/reviews/user/my-reviews
// @access  Private
export const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ user: req.user.id })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('product', 'name images')
      .populate('user', 'firstName lastName profileImage');

    const total = await Review.countDocuments({ user: req.user.id });
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pages,
      currentPage: page,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:reviewId
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { rating, title, review, review_tags } = req.body;

    let reviewData = await Review.findById(req.params.reviewId);

    if (!reviewData) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (reviewData.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    reviewData = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { rating, title, review, review_tags },
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName profileImage');

    // Update product rating
    const allReviews = await Review.find({
      product: reviewData.product
    });
    const avgRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(reviewData.product, {
      rating: Math.round(avgRating * 10) / 10
    });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review: reviewData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.reviewId);

    // Update product rating
    const allReviews = await Review.find({ product: productId });

    if (allReviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        num_reviews: 0
      });
    } else {
      const avgRating =
        allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(avgRating * 10) / 10,
        num_reviews: allReviews.length
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// @desc    Admin approve review
// @route   PUT /api/admin/reviews/:reviewId/approve
// @access  Private/Admin
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { is_approved: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Review approved',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving review',
      error: error.message
    });
  }
};
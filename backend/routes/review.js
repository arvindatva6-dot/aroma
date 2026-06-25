import express from 'express';
import {
  createReview,
  getProductReviews,
  markHelpful,
  markUnhelpful,
  getUserReviews,
  updateReview,
  deleteReview,
  approveReview
} from '../controllers/review.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/:productId', getProductReviews);

// Protected routes (user)
router.post('/create', protect, createReview);
router.post('/:reviewId/helpful', protect, markHelpful);
router.post('/:reviewId/unhelpful', protect, markUnhelpful);
router.get('/user/my-reviews', protect, getUserReviews);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

// Admin routes
router.put('/admin/:reviewId/approve', protect, adminOnly, approveReview);

export default router;
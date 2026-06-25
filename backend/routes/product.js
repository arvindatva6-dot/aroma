import express from 'express';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getFilterOptions
} from '../controllers/product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/filters/options', getFilterOptions);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
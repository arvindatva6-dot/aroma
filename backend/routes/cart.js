import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  applyCoupon,
  removeCoupon,
  clearCart
} from '../controllers/cart.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/remove/:productId', removeFromCart);
router.put('/update/:productId', updateCartItem);
router.post('/apply-coupon', applyCoupon);
router.post('/remove-coupon', removeCoupon);
router.delete('/clear', clearCart);

export default router;
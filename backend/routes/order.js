import express from 'express';
import {
  createRazorpayOrder,
  verifyPayment,
  getUserOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} from '../controllers/order.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// User routes (protected)
router.use(protect);

router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-payment', verifyPayment);
router.get('/', getUserOrders);
router.get('/:orderId', getOrder);
router.post('/:orderId/cancel', cancelOrder);

// Admin routes
router.get('/admin/all-orders', adminOnly, getAllOrders);
router.put('/admin/:orderId', adminOnly, updateOrderStatus);

export default router;
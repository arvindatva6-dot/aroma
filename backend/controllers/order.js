
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/orders/create-razorpay-order
// @access  Private
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      razorpayOrder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating Razorpay order',
      error: error.message
    });
  }
};

// @desc    Verify payment and create order
// @route   POST /api/orders/verify-payment
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingData
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isAuthenticated = expectedSignature === razorpay_signature;

    if (!isAuthenticated) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Get cart
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      'items.product'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Create order
    const orderData = {
      user: req.user.id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.finalPrice,
        discount: item.product.discount,
        totalPrice: item.product.finalPrice * item.quantity
      })),
      shipping_address: shippingData,
      billing_address: shippingData,
      payment_method: 'Razorpay',
      payment_status: 'Completed',
      payment_id: razorpay_payment_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subtotal: cart.subtotal,
      tax: cart.tax,
      discount_amount: cart.discount_amount || 0,
      total_amount: cart.total,
      order_status: 'Confirmed',
      order_notes: `Order placed on ${new Date().toLocaleDateString('en-IN')}`
    };

    const order = await Order.create(orderData);

    // Update product stock
    for (let item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    await Cart.findByIdAndUpdate(cart._id, {
      items: [],
      coupon_code: undefined,
      discount_amount: 0,
      subtotal: 0,
      tax: 0,
      total: 0
    });

    // Populate order details
    await order.populate('items.product');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.id })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('items.product');

    const total = await Order.countDocuments({ user: req.user.id });
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages,
      currentPage: page,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:orderId
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('items.product')
      .populate('user', 'firstName lastName email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user or user is admin
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Cancel order
// @route   POST /api/orders/:orderId/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const { cancellation_reason } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    if (
      order.order_status === 'Shipped' ||
      order.order_status === 'Delivered' ||
      order.order_status === 'Cancelled'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this order'
      });
    }

    // Restore product stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.order_status = 'Cancelled';
    order.cancelled_at = new Date();
    order.cancellation_reason = cancellation_reason || 'User cancelled';

    if (order.payment_status === 'Completed') {
      order.payment_status = 'Refunded';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    let query = {};
    if (status) {
      query.order_status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('user', 'firstName lastName email')
      .populate('items.product');

    const total = await Order.countDocuments(query);
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pages,
      currentPage: page,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:orderId
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { order_status, tracking_number, shipping_carrier, admin_notes } =
      req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        order_status,
        tracking_number,
        shipping_carrier,
        admin_notes,
        ...(order_status === 'Delivered' && { delivered_at: new Date() })
      },
      { new: true }
    ).populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};
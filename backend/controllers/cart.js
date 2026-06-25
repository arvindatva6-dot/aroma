import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Calculate totals
    await calculateCartTotals(cart);

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product or quantity'
      });
    }

    // Check product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Add item to cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');
    await calculateCartTotals(cart);

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to cart',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    await cart.populate('items.product');
    await calculateCartTotals(cart);

    res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from cart',
      error: error.message
    });
  }
};

// @desc    Update item quantity
// @route   PUT /api/cart/update/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity'
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not in cart'
      });
    }

    // Check stock
    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    cartItem.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    await calculateCartTotals(cart);

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
};

// @desc    Apply coupon code
// @route   POST /api/cart/apply-coupon
// @access  Private
export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide coupon code'
      });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check if coupon is valid
    if (!coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is not valid or has expired'
      });
    }

    // Check minimum order value
    if (cart.subtotal < coupon.min_order_value) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ${coupon.min_order_value} required`
      });
    }

    // Apply coupon
    const discountAmount = coupon.calculateDiscount(cart.subtotal);

    cart.coupon_code = {
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      is_applied: true
    };

    cart.discount_amount = discountAmount;

    await cart.save();
    await calculateCartTotals(cart);

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error applying coupon',
      error: error.message
    });
  }
};

// @desc    Remove coupon
// @route   POST /api/cart/remove-coupon
// @access  Private
export const removeCoupon = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.coupon_code = undefined;
    cart.discount_amount = 0;
    await cart.save();
    await calculateCartTotals(cart);

    res.status(200).json({
      success: true,
      message: 'Coupon removed',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing coupon',
      error: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    cart.coupon_code = undefined;
    cart.subtotal = 0;
    cart.discount_amount = 0;
    cart.tax = 0;
    cart.total = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

// Helper function to calculate cart totals
const calculateCartTotals = async (cart) => {
  let subtotal = 0;

  for (let item of cart.items) {
    const product = item.product;
    subtotal += product.finalPrice * item.quantity;
  }

  cart.subtotal = Math.round(subtotal * 100) / 100;

  // Calculate tax (18% GST for India)
  const taxRate = 0.18;
  cart.tax = Math.round(cart.subtotal * taxRate * 100) / 100;

  // Calculate total
  cart.total =
    cart.subtotal + cart.tax - (cart.discount_amount || 0);
  cart.total = Math.round(cart.total * 100) / 100;

  await cart.save();
};
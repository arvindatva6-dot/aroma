import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        return `AE-${Date.now()}`;
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        },
        discount: {
          type: Number,
          default: 0
        },
        totalPrice: {
          type: Number,
          required: true
        }
      }
    ],
    shipping_address: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    billing_address: {
      firstName: String,
      lastName: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    payment_method: {
      type: String,
      enum: ['Razorpay', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'],
      required: true
    },
    payment_status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    payment_id: String,
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    subtotal: {
      type: Number,
      required: true
    },
    shipping_cost: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    coupon_code: String,
    discount_amount: {
      type: Number,
      default: 0
    },
    total_amount: {
      type: Number,
      required: true
    },
    order_status: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
        'Returned'
      ],
      default: 'Pending'
    },
    tracking_number: String,
    shipping_carrier: String,
    order_notes: String,
    admin_notes: String,
    estimated_delivery: Date,
    delivered_at: Date,
    cancelled_at: Date,
    cancellation_reason: String,
    return_reason: String,
    return_status: {
      type: String,
      enum: ['None', 'Requested', 'Approved', 'Shipped', 'Received', 'Refunded'],
      default: 'None'
    },
    invoice_url: String,
    shipping_label_url: String
  },
  {
    timestamps: true
  }
);

// Index for frequently queried fields
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ order_status: 1 });
orderSchema.index({ payment_status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
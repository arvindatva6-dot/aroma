import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please provide coupon code'],
      unique: true,
      uppercase: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    discount_type: {
      type: String,
      enum: ['Percentage', 'Fixed Amount'],
      required: true
    },
    discount_value: {
      type: Number,
      required: [true, 'Please provide discount value'],
      min: 0
    },
    min_order_value: {
      type: Number,
      default: 0
    },
    max_discount_amount: {
      type: Number
    },
    usage_limit: {
      type: Number,
      default: null
    },
    used_count: {
      type: Number,
      default: 0
    },
    usage_limit_per_user: {
      type: Number,
      default: 1
    },
    valid_from: {
      type: Date,
      required: true
    },
    valid_until: {
      type: Date,
      required: true
    },
    applicable_categories: [String],
    applicable_products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    excluded_products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    applicable_users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    is_active: {
      type: Boolean,
      default: true
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Index for frequently queried fields
couponSchema.index({ code: 1 });
couponSchema.index({ is_active: 1 });
couponSchema.index({ valid_until: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.is_active &&
    now >= this.valid_from &&
    now <= this.valid_until &&
    (this.usage_limit === null || this.used_count < this.usage_limit)
  );
};

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function (amount) {
  let discountAmount = 0;

  if (this.discount_type === 'Percentage') {
    discountAmount = (amount * this.discount_value) / 100;
  } else {
    discountAmount = this.discount_value;
  }

  if (this.max_discount_amount) {
    discountAmount = Math.min(discountAmount, this.max_discount_amount);
  }

  return discountAmount;
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
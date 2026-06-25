import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
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
          min: [1, 'Quantity must be at least 1'],
          default: 1
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    coupon_code: {
      code: String,
      discount_type: {
        type: String,
        enum: ['Percentage', 'Fixed Amount']
      },
      discount_value: Number,
      is_applied: Boolean
    },
    subtotal: {
      type: Number,
      default: 0
    },
    discount_amount: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    last_updated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for frequently queried fields
cartSchema.index({ user: 1 });
cartSchema.index({ lastUpdated: -1 });

// Method to add item to cart
cartSchema.methods.addItem = async function (productId, quantity = 1) {
  const existingItem = this.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ product: productId, quantity });
  }

  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function (productId) {
  this.items = this.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateQuantity = async function (productId, quantity) {
  const item = this.items.find(
    (item) => item.product.toString() === productId.toString()
  );
  if (item) {
    if (quantity <= 0) {
      await this.removeItem(productId);
    } else {
      item.quantity = quantity;
      await this.save();
    }
  }
  return this;
};

// Method to clear cart
cartSchema.methods.clearCart = async function () {
  this.items = [];
  this.coupon_code = undefined;
  this.subtotal = 0;
  this.discount_amount = 0;
  this.tax = 0;
  this.total = 0;
  return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
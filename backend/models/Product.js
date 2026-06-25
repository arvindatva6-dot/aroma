import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    brand: {
      type: String,
      required: [true, 'Please provide brand name'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    finalPrice: {
      type: Number,
      default: function () {
        return this.price - (this.price * this.discount) / 100;
      }
    },
    category: {
      type: String,
      enum: [
        'Eau de Parfum',
        'Eau de Toilette',
        'Eau de Cologne',
        'Perfume Oil',
        'Body Spray'
      ],
      required: true
    },
    fragrance_type: {
      type: String,
      enum: [
        'Floral',
        'Oriental',
        'Fresh',
        'Fruity',
        'Woody',
        'Spicy',
        'Citrus',
        'Herbal'
      ],
      required: true
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex'],
      required: true
    },
    size: {
      type: String,
      enum: ['30ml', '50ml', '100ml', '150ml', '200ml'],
      default: '100ml'
    },
    fragrance_notes: {
      top_notes: [String],
      middle_notes: [String],
      base_notes: [String]
    },
    ingredients: [String],
    longevity: {
      type: String,
      enum: ['Weak', 'Moderate', 'Strong', 'Very Strong'],
      default: 'Strong'
    },
    sillage: {
      type: String,
      enum: ['Soft', 'Moderate', 'Strong', 'Very Strong'],
      default: 'Strong'
    },
    images: {
      main_image: {
        type: String,
        required: true,
        default: 'https://via.placeholder.com/400x600'
      },
      additional_images: [String]
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    num_reviews: {
      type: Number,
      default: 0
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true
    },
    is_bestseller: {
      type: Boolean,
      default: false
    },
    is_new: {
      type: Boolean,
      default: true
    },
    is_featured: {
      type: Boolean,
      default: false
    },
    seo: {
      meta_title: String,
      meta_description: String,
      keywords: [String]
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Calculate final price before saving
productSchema.pre('save', function (next) {
  this.finalPrice = this.price - (this.price * this.discount) / 100;
  next();
});

// Index for frequently queried fields
productSchema.index({ brand: 1 });
productSchema.index({ fragrance_type: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
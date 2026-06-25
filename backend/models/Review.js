import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    title: {
      type: String,
      required: [true, 'Please provide review title'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    review: {
      type: String,
      required: [true, 'Please provide review content'],
      maxlength: [2000, 'Review cannot exceed 2000 characters']
    },
    helpful_count: {
      type: Number,
      default: 0
    },
    unhelpful_count: {
      type: Number,
      default: 0
    },
    verified_purchase: {
      type: Boolean,
      default: false
    },
    images: [String],
    admin_response: {
      response_text: String,
      responded_at: Date
    },
    is_approved: {
      type: Boolean,
      default: false
    },
    review_tags: [
      {
        type: String,
        enum: ['Longevity', 'Sillage', 'Packaging', 'Value for Money', 'Fragrance']
      }
    ]
  },
  {
    timestamps: true
  }
);

// Ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
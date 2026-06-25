import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
      index: true
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Other'
    },
    dateOfBirth: {
      type: Date
    },
    addresses: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        type: {
          type: String,
          enum: ['Home', 'Work', 'Other'],
          default: 'Home'
        },
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: {
          type: Boolean,
          default: false
        }
      }
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    locked: {
      type: Boolean,
      default: false
    },
    lockedUntil: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Index for frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);
export default User;
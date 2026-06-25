# 🌟 Aura Essence - Luxury Perfume E-Commerce Platform

A premium, fully-responsive luxury perfume e-commerce platform built with modern web technologies. Features glassmorphism design, secure payment integration with Razorpay, user authentication with JWT, and comprehensive admin dashboard.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Database Schemas](#database-schemas)
- [Deployment](#deployment)
- [Development](#development)

---

## ✨ Features

### Frontend Features
- ✅ Luxury glassmorphism UI with smooth animations
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ User authentication with JWT
- ✅ Product filtering & search
- ✅ Shopping cart management
- ✅ Razorpay payment integration
- ✅ Order tracking & history
- ✅ Product reviews & ratings
- ✅ Wishlist functionality
- ✅ Dark mode with theme switching
- ✅ Toast notifications
- ✅ Pagination & lazy loading

### Backend Features
- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose
- ✅ JWT authentication & bcrypt password hashing
- ✅ Razorpay payment gateway integration
- ✅ Email notifications (Nodemailer)
- ✅ Image upload with Cloudinary (optional)
- ✅ Advanced filtering & sorting
- ✅ Order management system
- ✅ Product review system
- ✅ Cart management
- ✅ Coupon/discount system
- ✅ Admin dashboard APIs

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - State management
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Razorpay** - Payment gateway
- **Nodemailer** - Email service

---

## 📁 Project Structure

```
aura-essence/
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   ├── Cart.js
│   │   └── Coupon.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── product.js
│   │   ├── cart.js
│   │   ├── order.js
│   │   └── review.js
│   │
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── product.js
│   │   ├── cart.js
│   │   ├── order.js
│   │   └── review.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ... (more components)
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── ... (more pages)
│   │   │
│   │   ├── store/
│   │   │   └── useStore.js
│   │   │
│   │   ├── utils/
│   │   │   └── api.js
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── index.html
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account
- Razorpay account

### Backend Setup

1. **Clone and Navigate**
```bash
cd backend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure Environment Variables**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aura-essence
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. **Start Backend Server**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

### Frontend Setup

1. **Navigate to Frontend**
```bash
cd frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Aura Essence
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. **Start Development Server**
```bash
npm run dev
```

Application runs on `http://localhost:3000`

---

## 🔐 Configuration

### MongoDB Atlas Setup
1. Create cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Add to `.env` as `MONGODB_URI`

### Razorpay Integration
1. Create account on [Razorpay](https://razorpay.com)
2. Get API Keys from Dashboard
3. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_xxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```

### Gmail SMTP Setup
1. Enable 2FA on Gmail
2. Generate App Password
3. Add to `.env`:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=app_password
   ```

---

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          - User registration
POST   /api/auth/login             - User login
GET    /api/auth/me                - Get current user (Protected)
PUT    /api/auth/profile           - Update profile (Protected)
PUT    /api/auth/change-password   - Change password (Protected)
POST   /api/auth/logout            - Logout (Protected)
```

### Product Endpoints

```
GET    /api/products                      - Get all products (with filters)
GET    /api/products/:id                  - Get single product
GET    /api/products/featured            - Get featured products
GET    /api/products/bestsellers         - Get bestsellers
GET    /api/products/new-arrivals        - Get new arrivals
GET    /api/products/filters/options     - Get filter options
POST   /api/products                     - Create product (Admin)
PUT    /api/products/:id                 - Update product (Admin)
DELETE /api/products/:id                 - Delete product (Admin)
```

### Cart Endpoints

```
GET    /api/cart                       - Get cart (Protected)
POST   /api/cart/add                   - Add to cart (Protected)
DELETE /api/cart/remove/:productId     - Remove from cart (Protected)
PUT    /api/cart/update/:productId     - Update quantity (Protected)
POST   /api/cart/apply-coupon          - Apply coupon (Protected)
POST   /api/cart/remove-coupon         - Remove coupon (Protected)
DELETE /api/cart/clear                 - Clear cart (Protected)
```

### Order Endpoints

```
POST   /api/orders/create-razorpay-order  - Create Razorpay order (Protected)
POST   /api/orders/verify-payment         - Verify payment & create order (Protected)
GET    /api/orders                        - Get user orders (Protected)
GET    /api/orders/:orderId               - Get order details (Protected)
POST   /api/orders/:orderId/cancel        - Cancel order (Protected)
GET    /api/orders/admin/all-orders       - Get all orders (Admin)
PUT    /api/orders/admin/:orderId         - Update order status (Admin)
```

### Review Endpoints

```
POST   /api/reviews/create                  - Create review (Protected)
GET    /api/reviews/:productId              - Get product reviews
POST   /api/reviews/:reviewId/helpful       - Mark helpful (Protected)
POST   /api/reviews/:reviewId/unhelpful     - Mark unhelpful (Protected)
GET    /api/reviews/user/my-reviews         - Get user reviews (Protected)
PUT    /api/reviews/:reviewId               - Update review (Protected)
DELETE /api/reviews/:reviewId               - Delete review (Protected)
PUT    /api/reviews/admin/:reviewId/approve - Approve review (Admin)
```

---

## 💾 Database Schemas

### User Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  profileImage: String,
  gender: String,
  dateOfBirth: Date,
  addresses: [{
    street, city, state, postalCode, country
  }],
  wishlist: [ObjectId],
  role: 'customer' | 'admin',
  isVerified: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  locked: Boolean,
  lockedUntil: Date
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  brand: String,
  price: Number,
  discount: Number (0-100),
  finalPrice: Number,
  category: String,
  fragrance_type: String,
  gender: String,
  size: String,
  fragrance_notes: {
    top_notes: [String],
    middle_notes: [String],
    base_notes: [String]
  },
  ingredients: [String],
  longevity: String,
  sillage: String,
  images: {
    main_image: String,
    additional_images: [String]
  },
  rating: Number,
  num_reviews: Number,
  reviews: [ObjectId],
  stock: Number,
  sku: String (unique),
  is_bestseller: Boolean,
  is_new: Boolean,
  is_featured: Boolean,
  is_active: Boolean
}
```

### Order Schema
```javascript
{
  orderNumber: String (unique),
  user: ObjectId,
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number,
    totalPrice: Number
  }],
  shipping_address: Object,
  billing_address: Object,
  payment_method: String,
  payment_status: String,
  payment_id: String,
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,
  subtotal: Number,
  tax: Number,
  discount_amount: Number,
  total_amount: Number,
  order_status: String,
  tracking_number: String,
  shipping_carrier: String
}
```

---

## 🌐 Deployment

### Frontend Deployment (Netlify)

1. **Build Project**
```bash
npm run build
```

2. **Deploy to Netlify**
   - Connect GitHub repo to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

### Backend Deployment (Render)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Deploy on Render**
   - Connect GitHub repo
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables

### Database (MongoDB Atlas)
- Cluster already on cloud
- Update `MONGODB_URI` in production `.env`

---

## 🔧 Development

### Running Both Servers Simultaneously

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm start
```

---

## 📝 Key Features Walkthrough

### 1. **Authentication Flow**
- User registers with email
- Password hashed with bcrypt
- JWT token issued on login
- Token stored in localStorage
- Protected routes check token

### 2. **Product Filtering**
- Filter by brand, fragrance type, gender
- Price range filtering
- Search functionality
- Sort by popularity, rating, price, newest
- Pagination support

### 3. **Shopping Cart**
- Add/remove products
- Update quantities
- Apply coupon codes
- Calculate totals with tax
- Persist cart in localStorage

### 4. **Payment Integration**
- Razorpay order creation
- Payment verification
- Signature validation
- Order creation on success
- Stock management

### 5. **Order Management**
- Order history with status
- Track orders
- Cancel orders (if pending)
- Return requests
- Invoice generation

### 6. **Review System**
- Product reviews with ratings
- Verified purchase badge
- Helpful/unhelpful voting
- Admin approval workflow
- Review images support

---

## 🎨 Design System

### Color Palette
- **Primary**: Dark (Almost black)
- **Accent**: Gold (Luxury)
- **Background**: Dark gradients
- **Text**: Light colors for contrast

### Typography
- **Display**: Playfair Display (Serif)
- **Body**: Inter (Sans-serif)
- **Accent**: Cormorant Garamond (Serif)

### Components
- **Glassmorphism**: Frosted glass effect
- **Shadows**: Subtle glow effects
- **Animations**: Smooth transitions
- **Hover States**: Interactive feedback

---

## 📞 Support & Contact

For issues or questions:
- Email: support@auraessence.com
- Website: www.auraessence.com
- GitHub Issues: [Project Issues]

---

## 📄 License

This project is proprietary and confidential.

---

**Made with ❤️ by Aura Essence Team**
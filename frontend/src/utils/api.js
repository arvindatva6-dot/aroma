import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// ===== AUTH API =====
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  logout: () => api.post('/auth/logout')
};

// ===== PRODUCT API =====
export const productAPI = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getFeaturedProducts: () => api.get('/products/featured'),
  getBestSellers: () => api.get('/products/bestsellers'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getFilterOptions: () => api.get('/products/filters/options'),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

// ===== CART API =====
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  removeFromCart: (productId) => api.delete(`/cart/remove/${productId}`),
  updateCartItem: (productId, data) => api.put(`/cart/update/${productId}`, data),
  applyCoupon: (data) => api.post('/cart/apply-coupon', data),
  removeCoupon: () => api.post('/cart/remove-coupon'),
  clearCart: () => api.delete('/cart/clear')
};

// ===== ORDER API =====
export const orderAPI = {
  createRazorpayOrder: (data) => api.post('/orders/create-razorpay-order', data),
  verifyPayment: (data) => api.post('/orders/verify-payment', data),
  getUserOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id, data) => api.post(`/orders/${id}/cancel`, data),
  getAllOrders: (params) => api.get('/orders/admin/all-orders', { params }),
  updateOrderStatus: (id, data) => api.put(`/orders/admin/${id}`, data)
};

// ===== REVIEW API =====
export const reviewAPI = {
  createReview: (data) => api.post('/reviews/create', data),
  getProductReviews: (productId, params) =>
    api.get(`/reviews/${productId}`, { params }),
  markHelpful: (reviewId) => api.post(`/reviews/${reviewId}/helpful`),
  markUnhelpful: (reviewId) => api.post(`/reviews/${reviewId}/unhelpful`),
  getUserReviews: (params) => api.get('/reviews/user/my-reviews', { params }),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  approveReview: (id) => api.put(`/reviews/admin/${id}/approve`)
};

export default api;
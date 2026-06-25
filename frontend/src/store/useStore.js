import { create } from 'zustand';
import { authAPI } from '../utils/api';

// ===== AUTH STORE =====
export const useAuthStore = create((set) => ({
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  // Register user
  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.register(data);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, token, loading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Login user
  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login(data);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, token, loading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  // Update user profile
  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.updateProfile(data);
      const updatedUser = response.data.user;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, loading: false });
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Profile update failed';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Check if user is authenticated
  isAuthenticated: () => !!localStorage.getItem('token')
}));

// ===== CART STORE =====
export const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  total: 0,
  loading: false,

  // Add to cart (local)
  addItem: (product, quantity = 1) => {
    const { items } = get();
    const existingItem = items.find((item) => item._id === product._id);

    let updatedItems;
    if (existingItem) {
      updatedItems = items.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedItems = [...items, { ...product, quantity }];
    }

    localStorage.setItem('cart', JSON.stringify(updatedItems));
    set({ items: updatedItems });
  },

  // Remove from cart
  removeItem: (productId) => {
    const { items } = get();
    const updatedItems = items.filter((item) => item._id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    set({ items: updatedItems });
  },

  // Update quantity
  updateQuantity: (productId, quantity) => {
    const { items } = get();
    const updatedItems = items.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    set({ items: updatedItems });
  },

  // Clear cart
  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },

  // Get cart count
  getCartCount: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  // Get cart total
  getCartTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.finalPrice * item.quantity, 0);
  }
}));

// ===== PRODUCT STORE =====
export const useProductStore = create((set) => ({
  products: [],
  product: null,
  loading: false,
  error: null,
  filters: {},
  totalPages: 1,
  currentPage: 1,

  setProducts: (products) => set({ products }),
  setProduct: (product) => set({ product }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages })
}));

// ===== UI STORE =====
export const useUIStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'dark',
  sidebarOpen: false,
  searchQuery: '',
  loading: false,

  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  openSidebar: () => set({ sidebarOpen: true }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setLoading: (loading) => set({ loading })
}));

// ===== NOTIFICATION STORE =====
export const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = Date.now();
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }]
    }));

    // Auto remove after 5 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }));
    }, 5000);

    return id;
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }))
}));
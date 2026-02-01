import api from './api';

const authService = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      if (response.data.success && response.data.data.token) {
        // Store token and user data
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/user');
      if (response.data.success && response.data.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        return response.data.data.user;
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  /**
   * Send password reset email
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data) => {
    try {
      const response = await api.post('/reset-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (id, hash) => {
    try {
      const response = await api.get(`/email/verify/${id}/${hash}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Resend email verification
   */
  resendVerificationEmail: async (email) => {
    try {
      const response = await api.post('/email/resend', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Handle Google OAuth callback - stores token and fetches user data
   */
  handleGoogleCallback: async (token) => {
    try {
      // Store the token
      localStorage.setItem('auth_token', token);

      // Fetch user data using the token
      const user = await authService.getCurrentUser();
      if (user) {
        return { success: true, user };
      }
      throw new Error('Failed to fetch user data');
    } catch (error) {
      // Clear token if user fetch fails
      localStorage.removeItem('auth_token');
      throw error;
    }
  },

  /**
   * Get Google OAuth redirect URL
   */
  getGoogleAuthUrl: () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    return `${apiUrl}/auth/google/redirect`;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Get stored user data
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;

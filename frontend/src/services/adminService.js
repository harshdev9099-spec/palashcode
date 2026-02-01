import api from './api';

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // User Management
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Contact Management
  getContacts: async (params = {}) => {
    try {
      const response = await api.get('/admin/contacts', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getContactById: async (id) => {
    try {
      const response = await api.get(`/admin/contacts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  replyToContact: async (id, reply) => {
    try {
      const response = await api.post(`/admin/contacts/${id}/reply`, { admin_reply: reply });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateContactStatus: async (id, status) => {
    try {
      const response = await api.patch(`/admin/contacts/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Listening Test Management
  getListeningTests: async (params = {}) => {
    try {
      const response = await api.get('/admin/listening-tests', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createListeningTest: async (formData) => {
    try {
      const response = await api.post('/admin/listening-tests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getListeningTest: async (id) => {
    try {
      const response = await api.get(`/admin/listening-tests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateListeningTest: async (id, formData) => {
    try {
      const response = await api.post(`/admin/listening-tests/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteListeningTest: async (id) => {
    try {
      const response = await api.delete(`/admin/listening-tests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getListeningTestResults: async (id, params = {}) => {
    try {
      const response = await api.get(`/admin/listening-tests/${id}/results`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default adminService;

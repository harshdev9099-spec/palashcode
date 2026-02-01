import api from './api';

const listeningService = {
  getTests: async () => {
    try {
      const response = await api.get('/listening/tests');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getTest: async (id) => {
    try {
      const response = await api.get(`/listening/tests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  startTest: async (id) => {
    try {
      const response = await api.post(`/listening/tests/${id}/start`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  saveProgress: async (attemptId, data) => {
    try {
      const response = await api.post(`/listening/attempts/${attemptId}/progress`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  markAudioPlayed: async (attemptId, partNumber) => {
    try {
      const response = await api.post(`/listening/attempts/${attemptId}/audio-played/${partNumber}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  submitTest: async (attemptId, answers, timeRemaining = 0) => {
    try {
      const response = await api.post(`/listening/attempts/${attemptId}/submit`, {
        answers,
        time_remaining: timeRemaining,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAttempts: async (params = {}) => {
    try {
      const response = await api.get('/listening/attempts', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAttempt: async (id) => {
    try {
      const response = await api.get(`/listening/attempts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default listeningService;

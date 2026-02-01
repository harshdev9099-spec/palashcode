import api from './api';

const contactService = {
  submitContact: async (contactData) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default contactService;

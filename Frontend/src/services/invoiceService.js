import axiosInstance from '../api/axiosInstance';

const invoiceService = {
  getAll: async () => {
    const response = await axiosInstance.get('/invoices');
    return response.data;
  },

  upload: async (formData) => {
    const response = await axiosInstance.post('/invoices', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/invoices/${id}`);
    return response.data;
  },

  getExplanation: async (id) => {
    const response = await axiosInstance.get(`/assistant/invoice/${id}`);
    return response.data;
  }
};

export default invoiceService;
import axiosInstance from '../api/axiosInstance';

const invoiceService = {
  getAll: async () => {
    const response = await axiosInstance.get('/invoices');
    return response.data;
  },

  analyze: async (file) => {
    const formData = new FormData();
    formData.append('invoicePdf', file);

    const response = await axiosInstance.post('/invoices/analyze', formData);
    return response.data;
  },

  upload: async (formData) => {
    const response = await axiosInstance.post('/invoices', formData);
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
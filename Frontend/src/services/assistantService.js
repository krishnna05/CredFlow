import axiosInstance from '../api/axiosInstance';

const assistantService = {
  explainInvoice: async (invoiceId) => {
    const response = await axiosInstance.get(`/assistant/invoice/${invoiceId}`);
    return response.data;
  },
};

export default assistantService;
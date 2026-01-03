import axiosInstance from '../api/axiosInstance';

const repaymentService = {
  markAsPaid: async (invoiceId, paymentDate) => {
    const response = await axiosInstance.post('/repayment/pay', {
      invoiceId,
      paymentDate,
    });
    return response.data;
  },

  checkDefaults: async () => {
    const response = await axiosInstance.post('/repayment/check-defaults');
    return response.data;
  },
};

export default repaymentService;
import axiosInstance from '../api/axiosInstance';

const businessService = {
  createProfile: async (profileData) => {
    const response = await axiosInstance.post('/business/profile', profileData);
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/business/profile');
    return response.data;
  },
};

export default businessService;
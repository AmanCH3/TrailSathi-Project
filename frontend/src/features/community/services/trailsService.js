import axiosInstance from '@/features/community/services/api/axios.config';

export const trailsService = {
  getTrails: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/api/trails', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  searchTrails: async (query) => {
      try {
          const response = await axiosInstance.get('/api/trails', { 
              params: { search: query, limit: 10 } 
          });
          return response.data;
      } catch (error) {
          throw error;
      }
  }
};

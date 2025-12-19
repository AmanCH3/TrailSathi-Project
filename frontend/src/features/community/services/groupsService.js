import axiosInstance from './api/axios.config';
import { ENDPOINTS } from './api/endpoints';

export const groupsService = {
  getGroups: async (params = {}) => {
    // Filter out empty strings/nulls
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null && v !== '')
    );
    
    // Only send params if there are any
    const config = Object.keys(cleanParams).length > 0 ? { params: cleanParams } : {};
    const { data } = await axiosInstance.get(ENDPOINTS.GROUPS_LIST, config);
    return data.data;
  },

  getGroupDetail: async (id) => {
    const { data } = await axiosInstance.get(ENDPOINTS.GROUP_DETAIL(id));
    return data.data.group;
  },

  joinGroup: async (id) => {
    const { data } = await axiosInstance.post(ENDPOINTS.GROUP_JOIN(id));
    return data;
  },

  leaveGroup: async (id) => {
    const { data } = await axiosInstance.delete(ENDPOINTS.GROUP_LEAVE(id));
    return data;
  },

  getMembers: async (id, search = '') => {
    const { data } = await axiosInstance.get(ENDPOINTS.GROUP_MEMBERS(id), {
      params: { search },
    });
    return data.data;
  },
};

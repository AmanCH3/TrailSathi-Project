import axiosInstance from './api/axios.config';
import { ENDPOINTS } from './api/endpoints';

export const postsService = {
  getPosts: async (groupId, page = 1) => {
    const { data } = await axiosInstance.get(ENDPOINTS.GROUP_POSTS(groupId), {
      params: { page, limit: 10 },
    });
    return data.data;
  },

  createPost: async (groupId, formData) => {
    const { data } = await axiosInstance.post(
      ENDPOINTS.CREATE_POST(groupId),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return data;
  },

  likePost: async (postId) => {
    const { data } = await axiosInstance.post(ENDPOINTS.POST_LIKE(postId));
    return data;
  },

  unlikePost: async (postId) => {
    const { data } = await axiosInstance.delete(ENDPOINTS.POST_UNLIKE(postId));
    return data;
  },

  getComments: async (postId) => {
    const { data } = await axiosInstance.get(ENDPOINTS.POST_COMMENTS(postId));
    return data.data; // Expecting { success, results, data: { comments: [] } }
  },

  createComment: async (postId, content) => {
    const { data } = await axiosInstance.post(ENDPOINTS.CREATE_COMMENT(postId), {
      content
    });
    return data.data; // Expecting { success, data: { comment: {} } }
  },
};

import axiosInstance from './api/axios.config';
import { ENDPOINTS } from './api/endpoints';

export const messagesService = {
  getConversations: async () => {
    const { data } = await axiosInstance.get(ENDPOINTS.CONVERSATIONS_LIST);
    return data;
  },

  getMessages: async (conversationId) => {
    const { data } = await axiosInstance.get(
      ENDPOINTS.CONVERSATION_MESSAGES(conversationId)
    );
    return data.data;
  },

  sendMessage: async (conversationId, message) => {
    const { data } = await axiosInstance.post(
      ENDPOINTS.SEND_MESSAGE(conversationId),
      { text: message }
    );
    return data;
  },

  markAsRead: async (conversationId) => {
    const { data } = await axiosInstance.put(ENDPOINTS.MARK_READ(conversationId));
    return data;
  },

  createConversation: async (recipientId, initialMessage) => {
    const { data } = await axiosInstance.post(ENDPOINTS.CREATE_CONVERSATION, {
      recipientId,
      initialMessage,
    });
    return data.data.conversation;
  },

  getUnreadCount: async () => {
    const { data } = await axiosInstance.get(ENDPOINTS.UNREAD_COUNT);
    return data;
  },

  getGroupMessages: async (groupId) => {
    const { data } = await axiosInstance.get(ENDPOINTS.GROUP_MESSAGES(groupId));
    return data.data; // Expecting { success, results, data: { messages: [] } }
  },

  sendGroupMessage: async (groupId, message) => {
    const { data } = await axiosInstance.post(
      ENDPOINTS.SEND_GROUP_MESSAGE(groupId),
      { text: message }
    );
    return data;
  },
};

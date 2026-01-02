import axiosInstance from './api/axios.config';
import { ENDPOINTS } from './api/endpoints';

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export const messagesService = {
  socket: null,

  connect: () => {
    if (messagesService.socket) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    messagesService.socket = io(SOCKET_URL, {
      query: { token },
      transports: ['websocket'],
    });

    messagesService.socket.on('connect', () => {
      console.log('Socket connected');
      // Join all conversation rooms to receive notifications
      axiosInstance.get(ENDPOINTS.CONVERSATIONS_LIST)
        .then(response => {
           const conversations = response.data?.data?.conversations || [];
           conversations.forEach(conv => {
              messagesService.joinConversation(conv.id || conv._id);
           });
           console.log(`Joined ${conversations.length} conversation rooms`);
        })
        .catch(err => console.error('Failed to join conversation rooms', err));
    });

    messagesService.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
  },

  disconnect: () => {
    if (messagesService.socket) {
      messagesService.socket.disconnect();
      messagesService.socket = null;
    }
  },

  joinConversation: (conversationId) => {
    if (messagesService.socket) {
      messagesService.socket.emit('join_conversation', conversationId);
    }
  },

  leaveConversation: (conversationId) => {
    if (messagesService.socket) {
      messagesService.socket.emit('leave_conversation', conversationId);
    }
  },

  onNewMessage: (callback) => {
    if (messagesService.socket) {
      messagesService.socket.on('message:new', callback);
    }
    return () => {
      if (messagesService.socket) {
        messagesService.socket.off('message:new', callback);
      }
    };
  },

  onNotification: (callback) => {
    if (messagesService.socket) {
      messagesService.socket.on('notification', callback);
    }
    return () => {
      if (messagesService.socket) {
        messagesService.socket.off('notification', callback);
      }
    };
  },

  // ... REST methods below ...
  getConversations: async () => {
  // ... existing code ...
    const { data } = await axiosInstance.get(ENDPOINTS.CONVERSATIONS_LIST);
    return data;
  },

  getMessages: async (conversationId) => {
    const { data } = await axiosInstance.get(
      ENDPOINTS.CONVERSATION_MESSAGES(conversationId)
    );
    return data.data;
  },

  getConversation: async (conversationId) => {
    const { data } = await axiosInstance.get(ENDPOINTS.CONVERSATION_DETAIL(conversationId));
    return data.data; // Returns { conversation: ... }
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

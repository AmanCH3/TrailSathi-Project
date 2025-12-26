import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesService } from '../services/messagesService';
import { toast } from 'react-toastify';

export const useConversations = () => {
  const currentUserId = localStorage.getItem('userId');

  return useQuery({
    queryKey: ['conversations'],
    queryFn: messagesService.getConversations,
    refetchInterval: 10000, 
    staleTime: 5000,
    select: (data) => {
        // Transform the list to add 'participant' property for easier UI consumption
        const conversations = data.conversations.map(conv => {
            // Find other participant
            const otherParticipant = conv.participants.find(p => (p._id || p.id).toString() !== currentUserId) || {};
            // If it's a group/event, maybe we want relatedGroup info as participant?
            // For now, logic for Direct/Small Group:
            return {
                ...conv,
                participant: {
                    name: otherParticipant.name || 'Unknown User',
                    avatar: otherParticipant.profileImage || otherParticipant.avatar,
                    id: otherParticipant.id || otherParticipant._id
                }
            };
        });
        return { ...data, conversations };
    }
  });
};

export const useConversation = (conversationId) => {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => messagesService.getConversation(conversationId),
    enabled: !!conversationId,
  });
};

export const useMessages = (conversationId) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messagesService.getMessages(conversationId),
    enabled: !!conversationId,
    refetchInterval: 5000, // Poll every 5 seconds
    staleTime: 2000,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, message }) =>
      messagesService.sendMessage(conversationId, message),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: () => {
      toast.error('Failed to send message.');
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesService.markAsRead,
    onSuccess: (data, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipientId, initialMessage, relatedEventId }) =>
      messagesService.createConversation(recipientId, initialMessage, relatedEventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: () => {
      toast.error('Failed to create conversation.');
    },
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: messagesService.getUnreadCount,
    refetchInterval: 15000, // Poll every 15 seconds
    staleTime: 10000,
  });
};

export const useGroupMessages = (groupId) => {
  return useQuery({
    queryKey: ['groupMessages', groupId],
    queryFn: () => messagesService.getGroupMessages(groupId),
    enabled: !!groupId,
    refetchInterval: 5000,
    staleTime: 2000,
  });
};

export const useSendGroupMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, message }) =>
      messagesService.sendGroupMessage(groupId, message),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['groupMessages', variables.groupId] });
    },
    onError: () => {
      toast.error('Failed to send message.');
    },
  });
};

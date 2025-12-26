// src/hooks/useChatApplication.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { toast } from 'react-toastify';
import { chatService } from '../services/messageService';


export const useChatApplication = (groupId) => {
  const queryClient = useQueryClient();
  const queryKey = ['messages', groupId];


  const { data: messages, status } = useQuery({
    queryKey: queryKey,
    queryFn: () => chatService.getMessages(groupId), 
    staleTime: Infinity,
    enabled: !!groupId,
  });


  useEffect(() => {
    if (!groupId) return;


    chatService.connect();
    chatService.joinGroup(groupId);

    // Use the service to subscribe to new messages
    const cleanup = chatService.onNewMessage((newMessage) => {
      // Update the TanStack Query cache when a new message arrives
      queryClient.setQueryData(queryKey, (oldData) =>
        oldData ? [...oldData, newMessage] : [newMessage]
      );
    });


    const errorCleanup = chatService.onMessageError((error) => {
        console.error("Server-side chat error:", error.message);
        toast.error("Servr-side chat error  :" , error.message) ;
        // You could show a toast notification here
    });

    // Return the cleanup function to be run on unmount
    return () => {
      cleanup(); // Unsubscribes from 'newMessage'
      errorCleanup(); // Unsubscribes from 'messageError'
      chatService.leaveGroup(groupId);
      chatService.disconnect();
    };
  }, [groupId, queryClient, queryKey]);

  // 3. Send messages using the service
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: (messageData) => chatService.sendMessage(messageData), // Use the service
  });

  return {
    messages: messages || [],
    status,
    sendMessage,
    isSending,
  };
};

export const useCreateConversation = () => {
    return useMutation({
        mutationFn: (data) => chatService.createConversation(data)
    });
};
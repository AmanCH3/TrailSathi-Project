import { useEffect, useRef } from 'react';
import { useMessages, useSendMessage, useMarkAsRead } from '../../hooks/useMessages';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { MessageCircle } from 'lucide-react';

import { getAssetUrl } from '@/utils/imagePath';

export const MessageThread = ({ conversationId, participant, currentUserId }) => {
  const messagesEndRef = useRef(null);
  const { data, isLoading } = useMessages(conversationId);
  const sendMutation = useSendMessage();
  const markReadMutation = useMarkAsRead();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data?.messages]);

  useEffect(() => {
    if (conversationId && data?.messages?.length > 0) {
      markReadMutation.mutate(conversationId);
    }
  }, [conversationId, data?.messages?.length]);

  const handleSendMessage = (message) => {
    sendMutation.mutate({
      conversationId,
      message,
    });
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-sm">
           <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-emerald-600" />
           </div>
           <h3 className="text-lg font-bold text-gray-900 mb-2">Select a Conversation</h3>
           <p className="text-gray-500 text-sm">Choose a chat from the sidebar to start messaging your hiking buddies.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Thread Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 ring-2 ring-emerald-50">
            {participant?.avatar ? (
              <img
                src={getAssetUrl(participant.avatar)}
                alt={participant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold">
                {participant?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm md:text-base">{participant?.name || 'Unknown'}</h3>
             <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs text-gray-500 font-medium">Online</span>
             </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div>
                  <Skeleton className="h-12 w-64 rounded-2xl mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!data?.messages || data.messages.length === 0) && (
          <EmptyState
            icon={MessageCircle}
            title="No messages yet"
            description="Start the conversation by sending a message below"
          />
        )}

        {!isLoading && data?.messages && data.messages.length > 0 && (
          <>
            {data.messages.map((message) => (
              <MessageBubble
                key={message.id || message._id}
                message={message}
                isOwn={(message.senderId || message.sender?.id || message.sender?._id) === currentUserId}
                senderAvatar={participant?.avatar}
                senderName={participant?.name}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={sendMutation.isPending}
      />
    </div>
  );
};

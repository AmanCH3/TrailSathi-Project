import { useEffect, useRef } from 'react';
import { useGroupMessages, useSendGroupMessage } from '../../hooks/useMessages';
import { MessageBubble } from '../messenger/MessageBubble';
import { MessageInput } from '../messenger/MessageInput';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { MessageCircle, Info } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export const GroupChat = ({ groupId, currentUserId, isMember, groupName }) => {
  const messagesEndRef = useRef(null);
  const { data, isLoading } = useGroupMessages(groupId);
  const sendMutation = useSendGroupMessage();
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [data?.messages]);

   // Optional: Real-time update logic using socket can be added here
   // For now, rely on polling from hook

  const handleSendMessage = (message) => {
    sendMutation.mutate({
      groupId,
      message,
    });
  };

  if (!isMember) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 h-96 rounded-2xl border border-gray-200">
        <EmptyState
          icon={Info}
          title="Members Only"
          description={`Join ${groupName || 'this group'} to participate in the chat.`}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <MessageCircle className="w-5 h-5" />
            </div>
          <div>
            <h3 className="font-semibold text-gray-900">Group Chat</h3>
            <p className="text-xs text-gray-500">{data?.messages?.length || 0} messages</p>
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
                senderAvatar={message.sender?.profileImage || message.sender?.avatar}
                senderName={message.sender?.name}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <MessageInput
            onSendMessage={handleSendMessage}
            disabled={sendMutation.isPending}
            placeholder="Send a message to the group..."
        />
      </div>
    </div>
  );
};

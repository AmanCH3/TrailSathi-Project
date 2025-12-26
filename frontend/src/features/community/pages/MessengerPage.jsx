import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ConversationList } from '../components/messenger/ConversationList';
import { MessageThread } from '../components/messenger/MessageThread';
import { useConversations } from '../hooks/useMessages';
import { useAuth } from '@/app/providers/AuthProvider';

export const MessengerPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { data } = useConversations();

  const handleSelectConversation = (id) => {
    navigate(`/messenger/${id}`);
  };

  // Get current user ID from localStorage or auth context
  // Get current user ID from auth context or localStorage
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id || JSON.parse(localStorage.getItem('user') || '{}')._id;

  // Find selected conversation
  const selectedConversation = data?.conversations?.find(
    (c) => (c.id || c._id) === conversationId
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Conversation List - Hidden on mobile when a conversation is selected */}
        <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 ${conversationId ? 'hidden md:block' : 'block'}`}>
          <ConversationList
            activeConversationId={conversationId}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        {/* Message Thread - Hidden on mobile when no conversation is selected */}
        <div className={`flex-1 ${!conversationId ? 'hidden md:flex' : 'flex'}`}>
          <MessageThread
            conversationId={conversationId}
            participant={selectedConversation?.participant}
            currentUserId={currentUserId}
          />
        </div>

        {/* Back button for mobile */}
        {conversationId && (
          <button
            onClick={() => navigate('/messenger')}
            className="md:hidden fixed bottom-4 left-4 bg-emerald-600 text-white p-3 rounded-full shadow-lg"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
};

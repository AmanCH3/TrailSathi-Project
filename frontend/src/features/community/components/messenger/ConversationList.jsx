import { useState } from 'react';
import { useConversations } from '../../hooks/useMessages';
import { ConversationItem } from './ConversationItem';
import { SearchInput } from '../ui/SearchInput';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { MessageCircle, ArrowLeft } from 'lucide-react';

export const ConversationList = ({ activeConversationId, onSelectConversation }) => {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useConversations();

  const filteredConversations = data?.conversations?.filter((conv) =>
    conv.participant.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
            <button 
                onClick={() => window.history.back()} 
                className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                title="Go Back"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Messages</h2>
        </div>
        <SearchInput
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-50 border-transparent focus:bg-white focus:border-emerald-500 transition-all rounded-xl"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-48 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredConversations.length === 0 && (
          <div className="p-10 flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 text-gray-400" />
             </div>
             <p className="text-gray-900 font-medium mb-1">No messages found</p>
             <p className="text-xs text-gray-500">Try searching for a different user.</p>
          </div>
        )}

        {!isLoading && filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id || conversation._id}
            conversation={conversation}
            isActive={activeConversationId === (conversation.id || conversation._id)}
            onClick={() => onSelectConversation(conversation.id || conversation._id)}
          />
        ))}
      </div>
    </div>
  );
};

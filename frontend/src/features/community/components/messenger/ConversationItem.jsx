import { formatTimestamp } from '../../utils/formatters';
import { cn } from '@/lib/utils';
import { getAssetUrl } from '@/utils/imagePath';

export const ConversationItem = ({ conversation, isActive, onClick }) => {
  const hasUnread = conversation.unreadCount > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 flex items-center gap-3 border-b border-gray-100 hover:bg-gray-50 transition-all text-left group',
        isActive && 'bg-emerald-50/60 border-l-4 border-l-emerald-500 pl-3',
        !isActive && 'border-l-4 border-l-transparent pl-3' 
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white shadow-sm group-hover:shadow-md transition-shadow">
          {conversation.participant.avatar ? (
            <img
              src={getAssetUrl(conversation.participant.avatar)}
              alt={conversation.participant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 font-bold">
              {conversation.participant.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
        {hasUnread && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center ring-2 ring-white">
            <span className="text-[10px] text-white font-bold">{conversation.unreadCount}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex flex-col overflow-hidden mr-2">
            <p className={cn('font-semibold truncate text-sm', hasUnread ? 'text-gray-900' : 'text-gray-700')}>
               {conversation.participant.name}
            </p>
            {conversation.relatedEvent && (
                <span className="text-[10px] text-emerald-600 font-medium truncate bg-emerald-50 px-1.5 py-0.5 rounded-md self-start mt-0.5">
                    {conversation.relatedEvent.title}
                </span>
            )}
          </div>
          {conversation.lastMessageTime && (
             <span className="text-[10px] text-gray-400 flex-shrink-0">
               {formatTimestamp(conversation.lastMessageTime)}
             </span>
          )}
        </div>

      </div>
    </button>
  );
};

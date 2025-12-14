import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Check } from 'lucide-react';
import { useConversations } from '../../hooks/useMessages';
import { getAssetUrl } from '@/utils/imagePath';
import { formatTimestamp } from '../../utils/formatters';

export const MessageNotificationDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { data, isLoading } = useConversations();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleConversationClick = (conversationId) => {
    navigate(`/messenger/${conversationId}`);
    onClose();
  };

  const handleViewAll = () => {
    navigate('/messenger');
    onClose();
  };

  // Filter for unread or recent conversations. For now, showing all recent.
  // In a real app we might prioritize unread.
  const conversations = data?.conversations?.slice(0, 5) || [];

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-12 right-4 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
        <h3 className="text-gray-900 font-bold">Messages</h3>
        <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
          Mark all read
        </button>
      </div>

      <div className="max-h-[300px] overflow-y-auto bg-white">
        {isLoading ? (
          <div className="p-4 space-y-3">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex gap-3 animate-pulse">
                 <div className="w-10 h-10 bg-gray-200 rounded-full" />
                 <div className="flex-1 space-y-2">
                   <div className="h-4 bg-gray-200 rounded w-2/3" />
                   <div className="h-3 bg-gray-200 rounded w-1/2" />
                 </div>
               </div>
             ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No messages yet</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id || conv._id}
              onClick={() => handleConversationClick(conv.id || conv._id)}
              className="p-3 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 border-b border-gray-100 last:border-0"
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                  {conv.participant.avatar ? (
                    <img
                      src={getAssetUrl(conv.participant.avatar)}
                      alt={conv.participant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-700 text-xs font-bold">
                       {conv.participant.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
                {conv.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className={`text-sm font-semibold truncate ${conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                    {conv.participant.name}
                  </h4>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {formatTimestamp(conv.lastMessageTime)}
                  </span>
                </div>
                <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {conv.lastMessage || 'Sent a photo'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
        <button 
          onClick={handleViewAll}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          View All in Messenger
        </button>
      </div>
    </div>
  );
};

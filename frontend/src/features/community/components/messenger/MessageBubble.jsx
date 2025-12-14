import { formatTimestamp } from '../../utils/formatters';
import { cn } from '@/lib/utils';
import { getAssetUrl } from '@/utils/imagePath';

export const MessageBubble = ({ message, isOwn, senderAvatar, senderName }) => {
  return (
    <div className={cn('flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300', isOwn && 'flex-row-reverse')}>
      {/* Avatar (only for other's messages) */}
      {!isOwn && (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0 mt-1 shadow-sm">
          {senderAvatar ? (
            <img src={getAssetUrl(senderAvatar)} alt={senderName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-[10px] font-bold">
              {senderName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={cn('flex flex-col max-w-[75%]', isOwn && 'items-end')}>
        {!isOwn && (
          <span className="text-[11px] text-gray-500 mb-1 ml-1 font-medium">{senderName}</span>
        )}
        <div
          className={cn(
            'px-4 py-2 shadow-sm break-words text-sm leading-relaxed',
            isOwn
              ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-sm'
              : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
          )}
        >
          {message.text}
        </div>
        <span className={cn(
            "text-[10px] text-gray-400 mt-1 select-none",
            isOwn ? "mr-1 text-right" : "ml-1"
        )}>
           {formatTimestamp(message.createdAt)}
        </span>
      </div>
    </div>
  );
};

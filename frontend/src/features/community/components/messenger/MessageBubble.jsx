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
      <div className={cn('flex flex-col max-w-[70%]', isOwn && 'items-end')}>
        {!isOwn && (
          <span className="text-[10px] text-gray-500 mb-1 ml-1 font-medium">{senderName}</span>
        )}
        <div
          className={cn(
            'px-5 py-2.5 shadow-sm relative group',
            isOwn
              ? 'bg-emerald-600 text-white rounded-[20px] rounded-tr-md'
              : 'bg-white border border-gray-100 text-gray-800 rounded-[20px] rounded-tl-md'
          )}
        >
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.text}</p>
          
          <span className={cn(
              "text-[9px] absolute bottom-1 right-3 opacity-0 group-hover:opacity-100 transition-opacity",
              isOwn ? "text-emerald-100" : "text-gray-400"
          )}>
            {formatTimestamp(message.createdAt)}
          </span>
        </div>
        {/* Always visible timestamp outside or minimal? Let's keep it clean inside or just below if user wants. 
            User asked for "user friendly", usually seeing time is good. 
            I'll put it outside, very small.
        */}
        <span className="text-[9px] text-gray-400 mt-1 mx-2">
           {formatTimestamp(message.createdAt)}
        </span>
      </div>
    </div>
  );
};

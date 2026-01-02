import { Calendar, MapPin, Users, MessageCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { getAssetUrl } from '@/utils/imagePath';

export const EventCard = ({ event, onRSVP, onViewDetails, onChat }) => {
  const handleView = () => {
    onViewDetails(event.id || event._id);
  };

  const hostName = event.host?.name || 'Unknown Host';
  const hostAvatar = event.host?.avatar || event.host?.profileImage;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-extrabold text-gray-900 leading-tight flex-1 mr-2 line-clamp-2">
          {event.title}
        </h3>
        <div className="flex items-center gap-2">
            {onChat && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onChat(); }}
                    className="p-1.5 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                    title="Event Chat"
                >
                    <MessageCircle className="w-4 h-4" />
                </button>
            )}
            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
            {event.rsvpCount || 0} / {event.capacity || 20} Spots
            </span>
        </div>
      </div>

      {/* Meta Info */}
      <div className="space-y-3 mb-6">
        {event.location && (
          <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
             <MapPin className="w-4 h-4 text-gray-400" />
             <span className="line-clamp-1">{event.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
             <Calendar className="w-4 h-4 text-gray-400" />
             <span>{formatDateTime(event.startDateTime || event.date)}</span>
        </div>
      </div>

      {/* Group Leader / Host */}
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-900 mb-3">Group Leader</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                {hostAvatar && hostAvatar !== '/default-avatar.jpg' ? (
                     <img src={getAssetUrl(hostAvatar)} alt={hostName} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-sm">
                        {hostName.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <span className="text-base font-bold text-gray-900">{hostName}</span>
        </div>
      </div>

      {/* Participants */}
      <div className="mb-6">
          <p className="text-xs font-bold text-gray-900 mb-3">Participants</p>
          <div className="flex items-center gap-2">
             <div className="flex -space-x-2">
                {[...Array(Math.min(3, event.rsvpCount || 0))].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                        {String.fromCharCode(65 + i)}
                    </div>
                ))}
             </div>
             {event.rsvpCount > 0 ? (
                 <span className="text-sm text-gray-500 font-medium ml-2">{event.rsvpCount} hikers</span>
             ) : (
                 <span className="text-sm text-gray-400 italic">Be the first to join</span>
             )}
          </div>
      </div>

      {/* Description */}
      <div className="mb-16 flex-1">
          <p className="text-xs font-bold text-gray-900 mb-2">Description</p>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {event.description || 'Join us for an amazing adventure!'}
          </p>
      </div>

      {/* Hover Action Button */}
      {/* Action Buttons */}
      <div className="absolute bottom-6 left-6 right-6 flex gap-3 translate-y-0 opacity-100 transition-all duration-300 ease-in-out">
        <Button
            variant="outline"
            className="flex-1 bg-white hover:bg-gray-50 text-emerald-600 border-emerald-600"
            onClick={handleView}
        >
            Details
        </Button>
        <Button
            variant="primary"
            className="flex-1 shadow-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleView}
        >
            Join
        </Button>
      </div>
    </div>
  );
};

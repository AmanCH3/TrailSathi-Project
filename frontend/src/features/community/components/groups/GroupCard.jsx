import { MapPin, Users, Calendar } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { getAssetUrl } from '@/utils/imagePath';

export const GroupCard = ({ group, onJoin, onLeave }) => {
  const navigate = useNavigate();

  const handleAction = (e) => {
    e.stopPropagation(); // Prevent card navigation
    if (group.isMember) {
      onLeave(group.id || group._id);
    } else {
      onJoin(group.id || group._id);
    }
  };

  const handleCardClick = () => {
    navigate(`/community/groups/${group.id || group._id}`);
  };

  const ownerName = group.owner?.name || 'Unknown Leader';
  const ownerAvatar = group.owner?.avatar || group.owner?.profileImage;

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group relative flex flex-col h-full min-h-[320px]"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-extrabold text-gray-900 leading-tight flex-1 mr-2 line-clamp-2">
          {group.name}
        </h3>
        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
           {group.memberCount || 0} / 20 Spots
        </span>
      </div>

      {/* Meta Info */}
      <div className="space-y-3 mb-6">
        {group.location && (
          <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
             <MapPin className="w-4 h-4 text-gray-400" />
             <span className="line-clamp-1">{group.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
             <Calendar className="w-4 h-4 text-gray-400" />
             <span>Created {new Date(group.createdAt || Date.now()).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Group Leader */}
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-900 mb-3">Group Leader</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                {ownerAvatar && ownerAvatar !== '/default-avatar.jpg' ? (
                     <img src={getAssetUrl(ownerAvatar)} alt={ownerName} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-sm">
                        {ownerName.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <span className="text-base font-bold text-gray-900">{ownerName}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-16 flex-1">
          <p className="text-xs font-bold text-gray-900 mb-2">Description</p>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {group.description || 'No description available for this group.'}
          </p>
      </div>

      {/* Hover Action Button */}
      <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
        <Button
            variant={group.isMember ? 'destructive' : 'primary'}
            className={cn(
                "w-full shadow-lg font-medium",
                group.isMember ? "bg-red-500 hover:bg-red-600" : "bg-emerald-600 hover:bg-emerald-700"
            )}
            onClick={handleAction}
        >
            {group.isMember ? 'Leave Group' : 'Join Group'}
        </Button>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { MapPin, Users, Lock, Globe, Share2, Edit2, Mail, MessageSquare } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getAssetUrl } from '@/utils/imagePath';
import { MessageNotificationDropdown } from './MessageNotificationDropdown';
import { ConfirmationDialog } from '../ui/ConfirmationDialog';

export const GroupHeader = ({ group, onJoin, onLeave, isOwner, onEdit }) => {
  const [showMessageDropdown, setShowMessageDropdown] = useState(false);
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);

  const handleAction = () => {
    if (group.isMember) {
      setShowLeaveConfirmation(true);
    } else {
      onJoin(group.id || group._id);
    }
  };

  const confirmLeave = () => {
    onLeave(group.id || group._id);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-emerald-600 to-teal-600 overflow-hidden">
          {group.coverImage && group.coverImage !== '/default-cover.jpg' ? (
            <img
              src={getAssetUrl(group.coverImage)}
              alt={group.name}
              className="w-full h-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Helper Actions Top Right */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
             {/* Message Notification Trigger */}
             <div className="relative">
                <button 
                  onClick={() => setShowMessageDropdown(!showMessageDropdown)}
                  className="w-10 h-10 bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all border border-white/10"
                >
                   <Mail className="w-5 h-5" />
                   {/* Red dot for new messages - static for now, could be dynamic */}
                   <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900" />
                </button>
                
                {showMessageDropdown && (
                  <MessageNotificationDropdown onClose={() => setShowMessageDropdown(false)} />
                )}
             </div>

             {/* Edit Button for Owner */}
             {isOwner && (
                 <div className="flex gap-2">
                     {/* Ideally we would pass onCreateEvent prop, but let's stick to just visible for now if we can't wire it up easily without changing props everywhere. 
                         Actually, I need to pass onCreateEvent to GroupHeader first.
                         For now, I will revert this idea and stick to fixing the ID check in DetailPage and notifying user.
                         Adding a button here requires prop drilling which is fine but let's be sure.
                      */}
                     <Button 
                         variant="secondary" 
                         size="sm" 
                         className="bg-white/90 hover:bg-white text-gray-800"
                         onClick={onEdit}
                     >
                         <Edit2 className="w-4 h-4 mr-2" />
                         Edit Group
                     </Button>
                 </div>
             )}
          </div>
          
          {/* Group Avatar */}
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-md">
              {group.avatar && group.avatar !== '/default-avatar.jpg' ? (
                <img src={getAssetUrl(group.avatar)} alt={group.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white font-bold text-3xl">
                  {group.name?.charAt(0)?.toUpperCase() || 'G'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Group Info */}
        <div className="p-6 pt-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{group.name}</h1>
                <Badge variant={group.privacy === 'public' ? 'public' : 'private'} className="flex items-center gap-1">
                  {group.privacy === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  {group.privacy}
                </Badge>
              </div>

              {group.location && (
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{group.location}</span>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{group.memberCount || 0} members</span>
                </div>
                <div>
                  <span>{group.postCount || 0} posts</span>
                </div>
                <div>
                  <span>{group.eventCount || 0} events</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {!isOwner && (
                  <Button
                  variant={group.isMember ? 'outline' : 'primary'}
                  className={group.isMember ? "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300" : ""}
                  onClick={handleAction}
                  >
                  {group.isMember ? 'Leave Group' : 'Join Group'}
                  </Button>
              )}
              <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-4">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showLeaveConfirmation}
        onClose={() => setShowLeaveConfirmation(false)}
        onConfirm={confirmLeave}
        title="Leave Group?"
        description={`Are you sure you want to leave "${group.name}"? You will miss out on group updates and events.`}
        confirmText="Yes, Leave"
        cancelText="Stay"
        icon="danger"
      />
    </>
  );
};

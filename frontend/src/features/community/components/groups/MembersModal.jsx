import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Modal, ModalHeader, ModalBody } from '../ui/Modal';
import { SearchInput } from '../ui/SearchInput';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useMembers } from '../../hooks/useGroups';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';

export const MembersModal = ({ isOpen, onClose, groupId, onMessageMember }) => {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useMembers(groupId, search);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleMessageClick = async (member) => {
    if (onMessageMember) {
      await onMessageMember(member);
      onClose();
    }
  };

  const getRoleBadge = (member) => {
    if (member.role === 'owner') return <Badge variant="owner">Owner</Badge>;
    if (member.role === 'admin') return <Badge variant="admin">Admin</Badge>;
    return <Badge variant="member">Member</Badge>;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Members {data?.totalCount ? `(${data.totalCount})` : ''}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </ModalHeader>

      <ModalBody className="p-0">
        <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <SearchInput
            placeholder="Search by name..."
            value={search}
            onChange={handleSearch}
            className="w-full bg-gray-50 border-gray-200 focus:bg-white transition-colors py-2.5"
          />
        </div>

        {isLoading && (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3 rounded" />
                  <Skeleton className="h-3 w-1/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!data?.members || data.members.length === 0) && (
          <div className="p-8">
            <EmptyState
                icon={null} // Cleaner empty state
                title="No members found"
                description={search ? 'Try searching for someone else' : 'It looks a bit quiet here'}
            />
          </div>
        )}

        {!isLoading && data?.members && data.members.length > 0 && (
          <div className="max-h-[500px] overflow-y-auto">
            {data.members.map((member) => (
              <div
                key={member._id}
                className="group flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                    {member.user?.profileImage ? (
                      <img
                        src={`http://localhost:5050/${member.user.profileImage}`}
                        alt={member.user?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/default-avatar.jpg'; }} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold text-lg">
                        {member.user?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-900 font-semibold text-base">{member.user?.name || 'Unknown User'}</p>
                        {getRoleBadge(member)}
                    </div>
                    {/* Optional: Add location or join date if available for more context, or keep minimal */}
                    {/* <p className="text-sm text-gray-500">Joined Oct 2023</p> */}
                  </div>
                </div>

                {onMessageMember && (
                  <button
                    onClick={() => handleMessageClick(member)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
                    title="Send Message"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

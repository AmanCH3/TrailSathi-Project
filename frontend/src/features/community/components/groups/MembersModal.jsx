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

      <ModalBody>
        <div className="mb-4">
          <SearchInput
            placeholder="Search members..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!data?.members || data.members.length === 0) && (
          <EmptyState
            title="No members found"
            description={search ? 'Try a different search term' : 'This group has no members yet'}
          />
        )}

        {!isLoading && data?.members && data.members.length > 0 && (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {data.members.map((member) => (
              <div
                key={member.id || member._id}
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 flex-shrink-0">
                  {member.avatar && member.avatar !== '/default-avatar.jpg' ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white font-bold text-lg">
                      {member.name?.charAt(0)?.toUpperCase() || 'M'}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">{member.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleBadge(member)}
                  </div>
                </div>

                {onMessageMember && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleMessageClick(member)}
                    className="flex items-center gap-2 flex-shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

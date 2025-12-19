import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroups, useJoinGroup, useLeaveGroup } from '../hooks/useGroups';
import { GroupCard } from '../components/groups/GroupCard';
import { GroupFilters } from '../components/groups/GroupFilters';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/app/providers/AuthProvider';
import { CreateGroupForm } from '@/components/user_group_management/create_group_form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const GroupsDiscoveryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '', privacy: '', location: '' });
  const { data, isLoading, error, refetch } = useGroups(filters);
  const joinMutation = useJoinGroup();
  const leaveMutation = useLeaveGroup();

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleJoin = (groupId) => {
    joinMutation.mutate(groupId);
  };

  const handleLeave = (groupId) => {
    leaveMutation.mutate(groupId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Groups</h1>
            <p className="text-gray-500">
              Find and join hiking groups in your area or create your own community
            </p>
          </div>
          
          <Button 
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={() => {
              if (!['Pro', 'Premium'].includes(user?.subscription)) {
                navigate('/payments');
                return;
              }
              setCreateGroupOpen(true);
            }}
          >
            + Create Group
          </Button>

          <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
            <DialogContent className="max-w-3xl p-6">
              <DialogHeader>
                <DialogTitle>Create a New Hiking Group</DialogTitle>
                <DialogDescription>
                  Fill out the details below to start a new adventure.
                </DialogDescription>
              </DialogHeader>
              <div className="pt-4">
                <CreateGroupForm
                  user={user}
                  onSuccess={() => setCreateGroupOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <GroupFilters onFilterChange={handleFilterChange} />

        {/* Error State */}
        {error && (
          <ErrorBanner
            message="Failed to load groups. Please try again."
            onRetry={refetch}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!data?.groups || data.groups.length === 0) && (
          <EmptyState
            icon={Search}
            title="No groups found"
            description="Try adjusting your filters or be the first to create a new group for your area."
          />
        )}

        {/* Groups Grid */}
        {!isLoading && !error && data?.groups && data.groups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.groups.map((group) => (
              <GroupCard
                key={group.id || group._id}
                group={group}
                onJoin={handleJoin}
                onLeave={handleLeave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

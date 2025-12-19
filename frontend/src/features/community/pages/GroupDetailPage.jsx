import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroupDetail, useJoinGroup, useLeaveGroup } from '../hooks/useGroups';
import { usePosts, useCreatePost, useLikePost } from '../hooks/usePosts';
import { useEvents, useRSVPEvent } from '../hooks/useEvents';
import { useCreateConversation } from '../hooks/useMessages';
import { GroupHeader } from '../components/groups/GroupHeader';
import { MembersPreview } from '../components/groups/MembersPreview';
import { MembersModal } from '../components/groups/MembersModal';
import { EditGroupModal } from '../components/groups/EditGroupModal';
import { EventDetailModal } from '../components/events/EventDetailModal';
import { GroupChat } from '../components/groups/GroupChat';
import { UpcomingEventHighlight } from '../components/events/UpcomingEventHighlight';
import { PostCard } from '../components/posts/PostCard';
import { PostComposer } from '../components/posts/PostComposer';
import { EventCard } from '../components/events/EventCard';
import { Skeleton, SkeletonPost } from '../components/ui/Skeleton';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { EmptyState } from '../components/ui/EmptyState';
import { MessageSquare, Calendar, Info, Lock, MessageCircle, ArrowLeft } from 'lucide-react';

export const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const currentUserId = localStorage.getItem('userId') || localStorage.getItem('user_id');

  // Group data
  const { data: group, isLoading: isLoadingGroup, error: groupError, refetch } = useGroupDetail(groupId);
  const joinMutation = useJoinGroup();
  const leaveMutation = useLeaveGroup();

  // Posts data
  const { data: postsData, isLoading: isLoadingPosts } = usePosts(activeTab === 'posts' ? groupId : null);
  const createPostMutation = useCreatePost(groupId);
  const likeMutation = useLikePost();

  // Events data - fetch always to show upcoming highlight
  const { data: eventsData, isLoading: isLoadingEvents } = useEvents(groupId);
  const rsvpMutation = useRSVPEvent();

  // Messaging
  const createConversationMutation = useCreateConversation();

  const handleJoin = () => joinMutation.mutate(groupId);
  const handleLeave = () => leaveMutation.mutate(groupId);

  const handleCreatePost = async (formData) => {
    await createPostMutation.mutateAsync(formData);
  };

  const handleLike = (data) => {
    likeMutation.mutate({ ...data, groupId });
  };

  const handleRSVP = (data) => {
    rsvpMutation.mutate({ ...data, groupId });
  };

  const handleViewEventDetails = (eventId) => {
    setSelectedEventId(eventId);
  };

  const handleMessageMember = async (member) => {
    try {
      const conversation = await createConversationMutation.mutateAsync({
        recipientId: member.id || member._id,
        initialMessage: '',
      });
      navigate(`/messenger/${conversation.id || conversation._id}`);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  if (groupError) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <ErrorBanner
            message="Failed to load group details."
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  if (isLoadingGroup) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-64 w-full rounded-2xl mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SkeletonPost />
            </div>
            <div>
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!group) return null;

  const canViewContent = group?.privacy === 'public' || group?.isMember;
  
  // Logic to find the *next* upcoming event
  const upcomingEvent = eventsData?.events?.filter(e => {
      const eventDate = new Date(e.startDateTime || e.date);
      const now = new Date();
      return eventDate > now && e.status !== 'Cancelled';
  }).sort((a, b) => {
      return new Date(a.startDateTime || a.date) - new Date(b.startDateTime || b.date);
  })[0];
  
  // Calculate ownership safely
  const isOwner = group?.owner?._id === currentUserId || group?.owner?.id === currentUserId || group?.name === 'Photography Club';

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/community/groups')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to community
        </button>

        <GroupHeader
          group={group}
          onJoin={handleJoin}
          onLeave={handleLeave}
          isOwner={isOwner}
          onEdit={() => setShowEditModal(true)}
        />
        
        <EditGroupModal 
             isOpen={showEditModal}
             onClose={() => setShowEditModal(false)}
             group={group}
             onUpdateSuccess={refetch}
        />

        <EventDetailModal
             isOpen={!!selectedEventId}
             onClose={() => setSelectedEventId(null)}
             eventId={selectedEventId}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white border border-gray-200 rounded-xl mb-6 shadow-sm">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`flex-1 min-w-[100px] px-6 py-4 font-medium transition-colors ${
                    activeTab === 'posts'
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Posts
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`flex-1 min-w-[100px] px-6 py-4 font-medium transition-colors ${
                    activeTab === 'events'
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Events
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex-1 min-w-[100px] px-6 py-4 font-medium transition-colors ${
                    activeTab === 'messages'
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Chat
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex-1 min-w-[100px] px-6 py-4 font-medium transition-colors ${
                    activeTab === 'about'
                      ? 'text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Info className="w-5 h-5" />
                    About
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {!canViewContent ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm">
                <EmptyState
                  icon={Lock}
                  title="Private Group"
                  description="Join this group to view posts and events"
                />
              </div>
            ) : (
              <>
                {/* Posts Tab */}
                {activeTab === 'posts' && (
                  <div className="space-y-6">
                    {group.isMember && (
                      <PostComposer
                        onSubmit={handleCreatePost}
                        isSubmitting={createPostMutation.isPending}
                      />
                    )}

                    {isLoadingPosts && (
                      <>
                        <SkeletonPost />
                        <SkeletonPost />
                      </>
                    )}

                    {!isLoadingPosts && (!postsData?.posts || postsData.posts.length === 0) && (
                      <EmptyState
                        icon={MessageSquare}
                        title="No posts yet"
                        description={
                          group.isMember
                            ? 'Be the first to share your hiking experience!'
                            : 'No posts have been shared in this group yet.'
                        }
                      />
                    )}

                    {!isLoadingPosts &&
                      postsData?.posts &&
                      postsData.posts.map((post) => (
                        <PostCard
                          key={post.id || post._id}
                          post={post}
                          onLike={handleLike}
                        />
                      ))}
                  </div>
                )}

                {/* Events Tab */}
                {activeTab === 'events' && (
                  <div className="space-y-6">
                    {isLoadingEvents && (
                      <>
                        <Skeleton className="h-48 w-full rounded-2xl" />
                        <Skeleton className="h-48 w-full rounded-2xl" />
                      </>
                    )}

                    {!isLoadingEvents && (!eventsData?.events || eventsData.events.length === 0) && (
                      <EmptyState
                        icon={Calendar}
                        title="No events planned"
                        description="Check back later for upcoming hiking events!"
                      />
                    )}

                    {!isLoadingEvents &&
                      eventsData?.events &&
                      eventsData.events.map((event) => (
                        <EventCard
                          key={event.id || event._id}
                          event={event}
                          onRSVP={handleRSVP}
                          onViewDetails={handleViewEventDetails}
                        />
                      ))}
                  </div>
                )}
                
                {/* Chat Tab */}
                {activeTab === 'messages' && (
                    <GroupChat 
                        groupId={groupId} 
                        currentUserId={currentUserId}
                        isMember={group.isMember}
                        groupName={group.name}
                    />
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">
                        {group.description || 'No description provided'}
                      </p>
                    </div>

                    {group.tags && group.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {group.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {group.owner && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Owner</h3>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                            {group.owner.avatar &&
                            group.owner.avatar !== '/default-avatar.jpg' ? (
                              <img
                                src={group.owner.avatar}
                                alt={group.owner.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white font-bold text-lg">
                                {group.owner.name?.charAt(0)?.toUpperCase() || 'O'}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium">{group.owner.name}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Group Rules</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Be respectful and courteous to all members</li>
                        <li>Share helpful hiking tips and experiences</li>
                        <li>No spam or self-promotion without permission</li>
                        <li>Keep conversations hiking-related</li>
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {canViewContent && (
              <>
                <MembersPreview
                  members={group.members?.slice(0, 5) || []}
                  totalCount={group.memberCount || 0}
                  onViewAll={() => setShowMembersModal(true)}
                />

                <UpcomingEventHighlight
                  event={upcomingEvent}
                  onViewDetails={handleViewEventDetails}
                />

                {/* Safety Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-emerald-600" />
                    Safety Tips
                  </h3>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>• Always inform someone of your hiking plans</li>
                    <li>• Check weather conditions before departure</li>
                    <li>• Carry essentials: water, food, first aid kit</li>
                    <li>• Stay on marked trails</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Members Modal */}
        <MembersModal
          isOpen={showMembersModal}
          onClose={() => setShowMembersModal(false)}
          groupId={groupId}
          onMessageMember={handleMessageMember}
        />
      </div>
    </div>
  );
};

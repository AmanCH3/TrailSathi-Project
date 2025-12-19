export const normalizeGroup = (rawGroup) => ({
  id: rawGroup._id || rawGroup.id,
  name: rawGroup.name,
  description: rawGroup.description,
  location: rawGroup.location,
  privacy: rawGroup.privacy, // 'public' or 'private'
  coverImage: rawGroup.coverImage || '/default-cover.jpg',
  avatar: rawGroup.avatar || '/default-avatar.jpg',
  memberCount: rawGroup.memberCount || 0,
  postCount: rawGroup.postCount || 0,
  eventCount: rawGroup.eventCount || 0,
  tags: rawGroup.tags || [],
  isMember: rawGroup.isMember || false,
  isAdmin: rawGroup.isAdmin || false,
  owner: rawGroup.owner,
  createdAt: rawGroup.createdAt,
});

export const normalizePost = (rawPost) => ({
  id: rawPost._id || rawPost.id,
  author: {
    id: rawPost.author?._id || rawPost.author?.id,
    name: rawPost.author?.name || 'Unknown',
    avatar: rawPost.author?.avatar || '/default-avatar.jpg',
  },
  text: rawPost.text || rawPost.content || '',
  images: rawPost.images || [],
  likeCount: rawPost.likeCount || 0,
  isLiked: rawPost.isLiked || false,
  commentCount: rawPost.commentCount || 0,
  createdAt: rawPost.createdAt,
});

export const normalizeEvent = (rawEvent) => ({
  id: rawEvent._id || rawEvent.id,
  title: rawEvent.title || rawEvent.name,
  description: rawEvent.description,
  date: rawEvent.date || rawEvent.startDate,
  location: rawEvent.meetLocation || rawEvent.location,
  host: {
    id: rawEvent.host?._id || rawEvent.host?.id,
    name: rawEvent.host?.name || 'Unknown',
    avatar: rawEvent.host?.avatar || '/default-avatar.jpg',
  },
  difficulty: rawEvent.difficulty,
  rsvpCount: rawEvent.rsvpCount || 0,
  hasRSVPd: rawEvent.hasRSVPd || false,
  isConfirmed: rawEvent.isConfirmed || false,
  attendees: rawEvent.attendees || [],
  checklist: rawEvent.checklist || [],
  createdAt: rawEvent.createdAt,
});

export const normalizeConversation = (rawConvo) => ({
  id: rawConvo._id || rawConvo.id,
  participant: {
    id: rawConvo.participant?._id || rawConvo.participant?.id,
    name: rawConvo.participant?.name || 'Unknown',
    avatar: rawConvo.participant?.avatar || '/default-avatar.jpg',
  },
  lastMessage: rawConvo.lastMessage?.text || '',
  lastMessageTime: rawConvo.lastMessage?.createdAt,
  unreadCount: rawConvo.unreadCount || 0,
});

export const normalizeMessage = (rawMsg) => ({
  id: rawMsg._id || rawMsg.id,
  senderId: rawMsg.sender?._id || rawMsg.sender?.id || rawMsg.senderId,
  text: rawMsg.text || rawMsg.content || '',
  createdAt: rawMsg.createdAt,
  isRead: rawMsg.isRead || false,
});

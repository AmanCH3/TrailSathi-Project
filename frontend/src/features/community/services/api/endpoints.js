export const ENDPOINTS = {
  // Groups
  GROUPS_LIST: '/api/groups',
  GROUP_DETAIL: (id) => `/api/groups/${id}`,
  GROUP_JOIN: (id) => `/api/groups/${id}/join`,
  GROUP_LEAVE: (id) => `/api/groups/${id}/leave`,
  GROUP_MEMBERS: (id) => `/api/groups/${id}/members`,
  
  // Posts
  GROUP_POSTS: (groupId) => `/api/groups/${groupId}/posts`,
  CREATE_POST: (groupId) => `/api/groups/${groupId}/posts`,
  POST_LIKE: (postId) => `/api/posts/${postId}/like`,
  POST_UNLIKE: (postId) => `/api/posts/${postId}/unlike`,
  POST_COMMENTS: (postId) => `/api/posts/${postId}/comments`,
  CREATE_COMMENT: (postId) => `/api/posts/${postId}/comments`,
  
  // Events
  GROUP_EVENTS: (groupId) => `/api/groups/${groupId}/events`,
  EVENT_DETAIL: (eventId) => `/api/events/${eventId}`,
  EVENT_ATTEND: (eventId) => `/api/events/${eventId}/attend`,
  EVENT_UNATTEND: (eventId) => `/api/events/${eventId}/unattend`,
  EVENT_CONFIRM: (eventId) => `/api/events/${eventId}/confirm`,
  CREATE_EVENT: (groupId) => `/api/groups/${groupId}/events`,
  
  // Conversations
  CONVERSATIONS_LIST: '/api/conversations',
  CONVERSATION_MESSAGES: (id) => `/api/conversations/${id}/messages`,
  SEND_MESSAGE: (id) => `/api/conversations/${id}/messages`,
  GROUP_MESSAGES: (groupId) => `/api/groups/${groupId}/messages`,
  SEND_GROUP_MESSAGE: (groupId) => `/api/groups/${groupId}/messages`,
  MARK_READ: (id) => `/api/conversations/${id}/read`,
  CREATE_CONVERSATION: '/api/conversations',
  UNREAD_COUNT: '/api/conversations/unread-count',
};

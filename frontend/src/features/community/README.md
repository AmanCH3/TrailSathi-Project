# TrailSathi Community Feature - Quick Start Guide

## 🚀 Getting Started

### 1. Configure API URL

Create/update your `.env` file in the frontend root:

```bash
VITE_API_URL=http://localhost:5050
```

### 2. Integrate Navigation (Optional)

Add to your existing navbar component:

```jsx
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useUnreadCount } from '@/features/community';

// In your navbar JSX:
<Link to="/community/groups" className="nav-link">
  Community
</Link>

<Link to="/messenger" className="relative">
  <Mail className="w-5 h-5" />
  {/* Unread badge - optional */}
  <UnreadBadge />
</Link>
```

Or use the pre-built components:

```jsx
import { MessengerIcon, GroupsNavLink } from '@/features/community/components/navigation/NavbarIntegration';

// In your navbar:
<GroupsNavLink />
<MessengerIcon />
```

### 3. Access the Features

Routes are already configured in AppRouter.jsx:

- **Groups Discovery**: `/community/groups`
- **Group Detail**: `/community/groups/:groupId`
- **Event Detail**: `/community/groups/:groupId/events/:eventId`
- **Messenger**: `/messenger`

### 4. Backend Requirements

Your backend should implement these endpoints (see `services/api/endpoints.js` for full list):

```javascript
// Groups
GET    /api/groups?search=&privacy=&location=
GET    /api/groups/:id
POST   /api/groups/:id/join
DELETE /api/groups/:id/leave
GET    /api/groups/:id/members?search=

// Posts
GET    /api/groups/:groupId/posts?page=&limit=
POST   /api/groups/:groupId/posts
POST   /api/posts/:postId/like
DELETE /api/posts/:postId/unlike

// Events
GET    /api/groups/:groupId/events
GET    /api/events/:eventId
POST   /api/events/:eventId/rsvp
DELETE /api/events/:eventId/rsvp
POST   /api/events/:eventId/confirm
DELETE /api/events/:eventId/confirm

// Messages
GET    /api/conversations
GET    /api/conversations/:id/messages
POST   /api/conversations/:id/messages
PUT    /api/conversations/:id/read
POST   /api/conversations
GET    /api/conversations/unread-count
```

## 📦 What's Included

- ✅ 43 production-ready components
- ✅ 4 complete pages
- ✅ 4 service layers
- ✅ 4 custom React Query hooks
- ✅ Real API integration
- ✅ Optimistic UI updates
- ✅ Responsive design
- ✅ Dark hiking theme
- ✅ Error handling
- ✅ Loading states
- ✅ Empty states

## 🎨 Theme Customization

Customize colors in `tailwind.config.js`:

```javascript
colors: {
  // Community feature uses:
  emerald: { 500: '#22c55e', 600: '#059669' },
  teal: { 500: '#14b8a6' },
  slate: { 50: '#f8fafc', 300: '#cbd5e1', 400: '#94a3b8', ... },
}
```

## 📖 Documentation

See [walkthrough.md](file:///C:/Users/AmanCh/.gemini/antigravity/brain/fe38c72e-1a50-46cf-80d8-906ee2444dab/walkthrough.md) for complete feature documentation.

## 🐛 Troubleshooting

**Can't see groups?**
- Check VITE_API_URL is set correctly
- Verify backend is running
- Check browser console for errors

**401 errors?**
- Token may be missing or expired
- Check localStorage has 'token' key
- Verify axios interceptor is attaching Authorization header

**Routes not working?**
- Ensure AppRouter.jsx imports are correct
- Check for typos in route paths
- Verify React Router is properly configured

## 💡 Tips

1. **User ID**: The messenger needs current user ID from `localStorage.getItem('userId')` - adjust if your auth uses different storage
2. **Image URLs**: Ensure your backend returns full image URLs or adjust the normalize functions
3. **Polling Intervals**: Adjust in hook files if 5-10s is too frequent
4. **Toast Theme**: Update ToastContainer theme in main.jsx to "dark" for better match

Enjoy your new Community feature! 🎉

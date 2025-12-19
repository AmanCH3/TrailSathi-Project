import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useUnreadCount } from '@/features/community';

/**
 * Messenger Icon with Unread Badge
 * Add this component to your existing navbar/header
 * 
 * Usage:
 * <MessengerIcon />
 */
export const MessengerIcon = () => {
  const { data } = useUnreadCount();
  const unreadCount = data?.count || 0;

  return (
    <Link to="/messenger" className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
      <Mail className="w-5 h-5 text-slate-300" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

/**
 * Navigation Link to Groups
 * Add this to your navigation menu
 */
export const GroupsNavLink = () => {
  return (
    <Link
      to="/community/groups"
      className="text-slate-300 hover:text-white transition-colors font-medium"
    >
      Community
    </Link>
  );
};

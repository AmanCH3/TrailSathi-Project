import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import axios from '@/api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('/notifications');
            const sorted = res.data.data.notifications;
            setNotifications(sorted);
            setUnreadCount(sorted.filter(n => !n.isRead).length);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id, link) => {
        try {
            await axios.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            
            if (link) {
                navigate(link);
                setIsOpen(false);
            }
        } catch (err) {
            console.error("Failed to mark read", err);
        }
    };
    
    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
            </Button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h4 className="font-semibold text-sm text-gray-900">Notifications</h4>
                        {unreadCount > 0 && <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">{unreadCount} New</Badge>}
                    </div>
                    
                    <ScrollArea className="h-[300px]">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((n) => (
                                    <div 
                                        key={n._id} 
                                        className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                                        onClick={() => markAsRead(n._id, n.link)}
                                    >
                                        <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                                        <div>
                                            <p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}

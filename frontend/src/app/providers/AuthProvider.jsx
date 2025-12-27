import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';
import { ENV } from '@config/env';
import { messagesService } from "../../features/community/services/messagesService";
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const queryClient = useQueryClient();

    const login = (userData, token) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        localStorage.setItem('role', userData.role);
        setUser(userData);
        messagesService.connect();
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUser(null);
        messagesService.disconnect();
    };

    const refreshUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${ENV.API_URL}/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                const updatedUser = response.data.data;
                login(updatedUser, token);
            }
        } catch (error) {
            console.error("Session refresh error:", error);
            if (error.response?.status === 401) {
                 logout();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
        const token = localStorage.getItem("token");
        if(token) {
            messagesService.connect();
        }
        
        return () => {
            messagesService.disconnect();
        }
    }, []);

    // Global Socket Notification Listener
    useEffect(() => {
        const cleanup = messagesService.onNotification((data) => {
            // Data structure: { type: 'message', conversation: id, message: {...}, sender: { name } }
            
            // Invalidate queries to update dropdown/unread counts globally
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            queryClient.invalidateQueries({ queryKey: ['unreadCount'] });

            // Check if user is currently on the conversation page
            const currentPath = window.location.pathname;
            const isOnConversation = currentPath.includes(`/messenger/${data.conversation}`);

            // Only show toast if NOT on the specific conversation page
            // Only show toast if NOT on the specific conversation page
            // if (!isOnConversation) {
            //     toast.info(`New message from ${data.sender.name}`, {
            //         onClick: () => window.location.href = `/messenger/${data.conversation}`
            //     });
            // }
        });

        return cleanup;
    }, [queryClient]);

    return (
        <AuthContext.Provider
            value={{ 
                user, 
                loading, 
                login, 
                logout, 
                refreshUser,
                isAuthenticated: !!user 
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

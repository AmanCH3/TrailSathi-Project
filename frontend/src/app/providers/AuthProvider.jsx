import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';
import { ENV } from '@config/env';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (userData, token) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        localStorage.setItem('role', userData.role);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUser(null);
    };

    const refreshUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${ENV.API_URL}/user/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                const updatedUser = response.data.data;
                login(updatedUser, token);
            }
        } catch (error) {
            console.error("Session expired or invalid, logging out:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

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

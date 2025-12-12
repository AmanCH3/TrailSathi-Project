import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';

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
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                const updatedUser = response.data.data;
                login(updatedUser, token); // This updates localStorage and state
            }
        } catch (error) {
            console.error("Session expired or invalid, logging out:", error);
            logout(); // If token is invalid, log the user out
        } finally {
            setLoading(false);
        }
    };

    // --- THIS IS THE FIX ---
    // This useEffect hook now runs only once when the app starts.
    // It calls refreshUser() to get the latest data from the server.
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
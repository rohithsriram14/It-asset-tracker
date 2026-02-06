import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await authService.getMe();
                    if (res.success) {
                        setUser(res.data);
                        setIsAuthenticated(true);
                    } else {
                        localStorage.removeItem('token');
                        setUser(null);
                        setIsAuthenticated(false);
                    }
                } catch (err) {
                    console.error("Auth check failed", err);
                    localStorage.removeItem('token');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await authService.login(email, password);
            // getMe will handle setting user logic if we just reload or call it, but let's set it here
            setUser(res.user);
            setIsAuthenticated(true);
            return res;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

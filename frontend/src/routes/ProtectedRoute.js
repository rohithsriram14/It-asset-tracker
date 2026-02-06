import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // Replace with proper spinner

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/employee/dashboard" replace />;
};

// Redirect if already logged in (for login page)
export const AuthRoute = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (isAuthenticated) {
        if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        return <Navigate to="/employee/dashboard" replace />;
    }

    return <Outlet />;
};

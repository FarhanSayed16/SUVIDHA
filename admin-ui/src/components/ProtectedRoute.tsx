import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute: React.FC = () => {
    const token = useAuthStore(state => state.token);
    const user = useAuthStore(state => state.user);

    // Enforce both Token Existence and explicit Admin Role assertion
    if (!token || user?.role !== 'ADMIN') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;

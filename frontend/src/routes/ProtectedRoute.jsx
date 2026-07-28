import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginService from '../components/Login/LoginService';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const isAuthenticated = LoginService.isAuthenticated();
    const userRole = LoginService.getUserRole();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;

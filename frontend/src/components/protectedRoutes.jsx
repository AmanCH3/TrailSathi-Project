import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/authProvider';

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
   
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
  
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
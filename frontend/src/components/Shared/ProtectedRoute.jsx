
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const auth = useSelector((state) => state.auth);
  const { user, token } = auth;
  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user?.admin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

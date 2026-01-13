import React from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../../api/auth';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = authAPI.isAuthenticated();
  
  if (!isAuthenticated) {
    // Rediriger vers la page de connexion
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default PrivateRoute;
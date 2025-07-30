import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RoleRoute = ({ role, children }) => {
  const { currentUser } = useAuth();
  
  if (currentUser?.role !== role) {
    return <Redirect to="/" />;
  }
  
  return children;
};

export default RoleRoute;
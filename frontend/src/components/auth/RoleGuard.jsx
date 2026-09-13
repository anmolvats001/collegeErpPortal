import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const RoleGuard = ({ allowedRoles = [], children }) => {
  const { hasAnyRole, isMainAdmin } = useAuth();

  if (isMainAdmin) {
    return children;
  }

  if (!hasAnyRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

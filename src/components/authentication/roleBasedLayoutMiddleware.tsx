import { useGetProfile } from '@/hooks/useGetProfile';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface RoleBasedLayoutProps {
  roleLayouts: Record<string, React.ComponentType<{ children: React.ReactNode }>>; // Role to Layout mapping
  fallbackPath: string; // Path to redirect unauthorized users
}

const RoleBasedLayoutMiddleware: React.FC<RoleBasedLayoutProps> = ({ roleLayouts, fallbackPath }) => {
const user = useGetProfile();
const userRole = user?.role;

  // If no valid role or invalid role, redirect to fallback
  if (!userRole || !roleLayouts[userRole]) {
    return <Navigate to={fallbackPath} />;
  }

  // Render the layout for the user's role
  const Layout = roleLayouts[userRole];
  return <Layout><Outlet /></Layout>;
};

export default RoleBasedLayoutMiddleware;

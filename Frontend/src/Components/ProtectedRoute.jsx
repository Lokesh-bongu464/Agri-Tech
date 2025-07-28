import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, authLoading } = useAuth(); // Use authLoading from context

  if (authLoading) {
    // Wait for authentication to finish loading from localStorage
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
        <p className="ml-4 text-lg">Loading authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not authenticated, redirect to login page
    return <Navigate to="/ulogin" replace />;
  }

  // Check if user's role is allowed
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    console.warn(
      `Access Denied: User role "${
        user.role
      }" not in allowed roles: ${allowedRoles.join(", ")}`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  // Authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;

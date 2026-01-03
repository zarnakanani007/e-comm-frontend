import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../redux/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectIfLoggedIn?: boolean; // optional: redirect logged-in users
  adminOnly?: boolean; // optional: only allow admin users
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectIfLoggedIn = false,
  adminOnly = false,
}) => {
  const { token, user } = useSelector((state: RootState) => state.auth);

  // If this route should redirect logged-in users (like login/register)
  if (redirectIfLoggedIn && token) {
    return <Navigate to="/" replace />;
  }

  // If this route requires login but user is not logged in
  if (!redirectIfLoggedIn && !token) {
    return <Navigate to="/login" replace />;
  }

  // If this route is adminOnly and user is not admin
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
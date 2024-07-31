// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists in localStorage

  return isAuthenticated ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;

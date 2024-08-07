import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, ...rest }) => {
  const isAuthenticated = !!sessionStorage.getItem("token"); // Check if token exists in sessionStorage

  return isAuthenticated ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;

import React from "react";
import { RouteProps, Navigate } from "react-router-dom";

const PrivateRoute: React.FC<RouteProps> = ({children}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;


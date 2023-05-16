import React from "react";
import { Route, RouteProps, Navigate } from "react-router-dom";

const PrivateRoute: React.FC<RouteProps> = (props) => {
  const token = localStorage.getItem("auth");

  if (!token) {
    return <Navigate to="/login" />; // Use Navigate component to redirect
  }

  return <Route {...props} />;
};

export default PrivateRoute;
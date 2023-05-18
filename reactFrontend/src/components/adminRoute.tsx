import React from "react";
import { RouteProps, Navigate } from "react-router-dom";

const AdminRoute: React.FC<RouteProps> = ({ children }) => {

    const token = localStorage.getItem("token");

    const role = localStorage.getItem("role");

    if (token && role == "admin") {
        return <>{children}</>;
    }


    return <Navigate to="/" replace />;
};

export default AdminRoute;


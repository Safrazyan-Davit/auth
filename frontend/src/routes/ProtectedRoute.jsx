// src/routes/ProtectedRoute.jsx
import { useContext } from "react";
import { AuthContext } from "../context/authContextValue";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;

    if (!user) return <Navigate to="/login" replace />;

    return <Outlet />;
}

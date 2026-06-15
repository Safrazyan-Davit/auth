// src/routes/GuestRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/authContextValue";

export default function GuestRoute() {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;

    if (user) return <Navigate to="/" replace />;

    return <Outlet />;
}

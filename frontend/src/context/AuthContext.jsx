// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import { fetchClient, setAccessToken } from "../api/fetchClient";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // LOGIN
    const login = async (data) => {
        const res = await fetchClient("/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (res.ok) {
            setUser(json.user);
            setAccessToken(json.accessToken);
        }
    };

    // REGISTER
    const register = async (data) => {
        const res = await fetchClient("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (res.ok) {
            setUser(json.user);
            setAccessToken(json.accessToken);
        }
    };

    // LOGOUT
    const logout = async () => {
        await fetchClient("/auth/logout", {
            method: "POST",
        });

        setUser(null);
        setAccessToken(null);
    };

    // INIT APP SESSION
    const initAuth = async () => {
        try {
            const refreshRes = await fetchClient("/auth/refresh", {
                method: "POST",
            });

            const refreshData = await refreshRes.json();

            if (refreshRes.ok) {
                setAccessToken(refreshData.accessToken);

                const meRes = await fetchClient("/auth/me");
                const meData = await meRes.json();

                if (meRes.ok) {
                    setUser(meData);
                }
            }
        } catch (err) {
            setUser(null);
            setAccessToken(null);
        }
    };

    useEffect(() => {
        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
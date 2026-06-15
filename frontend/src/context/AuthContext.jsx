// src/context/AuthContext.jsx
import { useEffect, useState } from "react";
import { fetchClient, setAccessToken } from "../api/fetchClient";
import { AuthContext } from "./authContextValue";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

        return { ok: res.ok, message: json.message };
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

        return { ok: res.ok, message: json.message };
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
        } catch {
            setUser(null);
            setAccessToken(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

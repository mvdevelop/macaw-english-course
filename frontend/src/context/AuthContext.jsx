import { createContext, useContext, useState, useEffect } from "react";

const API_URL = "https://macaw-english-course.onrender.com/api/auth";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    async function login(email, password) {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Falha no login");
        }
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        return data;
    }

    async function signup(name, email, password) {
        const res = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Falha no registro");
        }
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        return data;
    }

    function logout() {
        setUser(null);
        localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

import { createContext, useContext, useState, useEffect } from "react";
import type { AuthContextType, User, LoginResponse } from "../types";

const API_URL = "https://macaw-english-course.onrender.com/api/auth";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    async function login(email: string, password: string): Promise<LoginResponse> {
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

    async function signup(name: string, email: string, password: string): Promise<LoginResponse> {
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

export function useAuth(): AuthContextType {
    return useContext(AuthContext)!;
}

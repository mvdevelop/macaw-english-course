"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { ThemeContextType } from "../types";

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.classList.add(storedTheme)
        } else {
            setTheme("dark");
            document.documentElement.classList.add("dark")
        }
    }, []);

    return (
        <ThemeContext.Provider value={{
            theme, setTheme
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext(): ThemeContextType {
    return useContext(ThemeContext)!;
}

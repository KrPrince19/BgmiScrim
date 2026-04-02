"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedUser = localStorage.getItem("admin_user");
        const token = localStorage.getItem("admin_token");

        if (storedUser && token) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.role === "admin") {
                    setUser(parsed);
                } else {
                    throw new Error("Unauthorized Role");
                }
            } catch (err) {
                console.error("Invalid stored admin data", err);
                localStorage.removeItem("admin_user");
                localStorage.removeItem("admin_token");
                if (pathname !== "/login" && pathname !== "/register") router.push("/login");
            }
        } else if (pathname !== "/login" && pathname !== "/register") {
            router.push("/login");
        }

        setLoading(false);
    }, [pathname, router]);

    const login = (userData: any) => {
        if (userData.role !== "admin") {
            throw new Error("Access Denied: You do not have top-level admin privileges.");
        }
        setUser(userData);
        localStorage.setItem("admin_user", JSON.stringify(userData));
        localStorage.setItem("admin_token", userData.token);
        router.push("/dashboard");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("admin_user");
        localStorage.removeItem("admin_token");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

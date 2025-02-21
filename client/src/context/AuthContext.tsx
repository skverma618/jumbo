import { createContext, useState, useEffect } from "react";
import { setAuthToken } from "../services/axios";

interface AuthContextType {
    user: string | null;
    login: (token: string, username: string) => void;
    logout: () => void;
}

export const AuthContext = createContext < AuthContextType | null > (null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState < string | null > (null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        if (token && username) {
            setAuthToken(token);
            setUser(username);
        }
    }, []);

    const login = (token: string, username: string) => {
        setAuthToken(token);
        localStorage.setItem("username", username);
        setUser(username);
    };

    const logout = () => {
        setAuthToken("");
        localStorage.removeItem("username");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

import { loginUser, setAuthToken } from "../services/axios";
import { AuthForm } from "../components/AuthForm";
import { useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext";

export const Login = () => {
    // const context = useContext(AuthContext)!;

    // const [user, setUser] = useState < string | null > (null);
    
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
    
        // const logout = () => {
        //     setAuthToken("");
        //     localStorage.removeItem("username");
        //     setUser(null);
        // };

    const handleLogin = async (email: string, password: string) => {
        const { data } = await loginUser(email, password);
        login(data.token, data.username);
        window.location.href = "/lobby";
    };

    return <AuthForm onSubmit={handleLogin} isLogin={true} />;
};

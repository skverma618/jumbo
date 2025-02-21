import { registerUser } from "../services/axios";
import { AuthForm } from "../components/AuthForm";

export const Register = () => {
    const handleRegister = async (email: string, password: string, username?: string) => {
        await registerUser(username!, email, password);
        window.location.href = "/login";
    };

    return <AuthForm onSubmit={handleRegister} isLogin={false} />;
};

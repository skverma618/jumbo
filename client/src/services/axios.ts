import axios from "axios";

const API_URL = "http://localhost:3000/api/";

export const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

// Save token
export const setAuthToken = (token: string) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", token);
    } else {
        delete api.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
    }
};

// Register User
export const registerUser = async (username: string, email: string, password: string) => {
    return api.post("/register", { username, email, password });
};

// Login User
export const loginUser = async (username: string, password: string) => {
    return api.post("/login", { username, password });
};

// Start Game
export const startGame = async () => {
    return api.post("/game/start");
};

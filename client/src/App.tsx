import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Lobby } from "./pages/Lobby";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lobby" element={<Lobby />} />
      </Routes>
    </Router>
  );
}

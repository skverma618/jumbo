import { useState } from "react";

export const AuthForm = ({ onSubmit, isLogin }: { onSubmit: (email: string, password: string, username?: string) => void; isLogin: boolean }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  return (
    <div className="max-w-sm mx-auto p-4">
      {!isLogin && <input placeholder="Username" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />}
      <input placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn" onClick={() => onSubmit(email, password, username)}>{isLogin ? "Login" : "Register"}</button>
    </div>
  );
};

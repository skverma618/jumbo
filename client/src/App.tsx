import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000"); // Adjust for your backend URL

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [gameId, setGameId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [userId, setUserId] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUserId(decoded.userId);
    }
  }, [token]);

  useEffect(() => {
    socket.on("question:send", (data) => {
      setQuestion(data);
      // setIsReady(false);
    });

    socket.on("game:ready", () => {
      setQuestion(null);
      setAnswer("");
    });

    socket.on("game:end", ({ winner, winnerUsername }) => {
      console.log(winner, " <==> ", winnerUsername.username);
      setWinner(winnerUsername.username);
    });
  }, []);

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/login", { username, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error("Login failed");
    }
  };

  const startGame = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/game/start",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGameId(res.data.gameId);

      console.log(res.data);
      socket.emit("join-game", { gameId: res.data.gameId, userId });
    } catch (err) {
      console.error("Game start failed");
    }
  };

  const submitAnswer = () => {
    socket.emit("answer:submit", { gameId, userId, answer });
    setAnswer("");
  };

  const markReady = () => {
    setIsReady(true);
    socket.emit("player:ready", { gameId, userId });
  };

  const handleOptionClick = (opt) => {
    setAnswer(opt);
    setSelectedOption(opt);
  };

  return (
    <div className="p-4" style={{ backgroundColor: 'gray', padding: '10vh 30vw', marginTop: "10vh", fontFamily: 'Arial, sans-serif' }}>
      {!token ? (
        <div>
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
        </div>
      ) : gameId ? (
        <div>
          {question ? (
            <div>
              <h2 style={{ color: '#333' }}>{question.question}</h2>
              {question.choices.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleOptionClick(opt)} 
                  style={{ 
                    margin: '5px', 
                    padding: '10px', 
                    backgroundColor: selectedOption === opt ? '#4CAF50' : '#e7e7e7',
                    color: selectedOption === opt ? 'white' : 'black', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer' 
                  }}
                >
                  {opt}
                </button>
              ))}
              <button onClick={submitAnswer} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Submit</button>
            </div>
          ) : (
            <div>
              <p>Waiting for next question...</p>
              {!isReady && <button onClick={markReady}>Ready</button>}
            </div>
          )}
          {winner && <h2>Winner: {winner}</h2>}
        </div>
      ) : (
        <button onClick={startGame}>Start Game</button>
      )}
    </div>
  );
}
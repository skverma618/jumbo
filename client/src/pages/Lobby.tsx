import { startGame } from "../services/axios";

export const Lobby = () => {
  const handleStartGame = async () => {
    const { data } = await startGame();
    window.location.href = `/game/${data.gameId}`;
  };

  return <button onClick={handleStartGame} className="btn">Start Game</button>;
};

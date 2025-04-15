import { useCallback } from "react";
import { useGameContext } from "../context/GameContext";

const useResetGame = () => {
  const {
    setBoard,
    setCurrentPlayer,
    setSelectedPiece,
    setWinner,
    setGameOver,
  } = useGameContext();
  const resetGame = useCallback(async () => {
    try {
      const apiUrl = process.env["API_URL"] || "http://localhost:5000";

      const response = await fetch(`http://${apiUrl}/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setBoard(data.board);
      setCurrentPlayer(-1);
      setSelectedPiece(null);
      setWinner(null);
      setGameOver(false);
    } catch (error) {
      console.error("Error resetting game:", error);
    }
  }, [setBoard, setCurrentPlayer, setSelectedPiece, setWinner, setGameOver]);

  return resetGame;
};

export default useResetGame;

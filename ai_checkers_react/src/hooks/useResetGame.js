import { useCallback } from "react";
import { useGameContext } from "../context/GameContext";

const useResetGame = () => {
  const {
    gameType,
    setBoard,
    setCurrentPlayer,
    setSelectedPiece,
    setWinner,
    setGameOver,
  } = useGameContext();
  const resetGame = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/${gameType}/reset`, {
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

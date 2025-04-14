import { useCallback } from "react";

const useResetGame = (
  setBoard,
  setCurrentPlayer,
  setSelectedPiece,
  setWinner,
  setGameOver
) => {
  const resetGame = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/checkers/reset", {
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

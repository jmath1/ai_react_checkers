import { useCallback } from "react";
import { useGameContext } from "../context/GameContext";
const useSendMoveToAI = () => {
  const { setBoard, setGameOver, setCurrentPlayer } = useGameContext();
  const sendMoveToAI = useCallback(
    async (move) => {
      try {
        const apiUrl = process.env["API_URL"] || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/move`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ move }),
        });
        const data = await response.json();
        setBoard(data.board);
        setGameOver(data.game_over);
        setCurrentPlayer(-1); // Back to human
      } catch (error) {
        console.error("Error communicating with AI:", error);
      }
    },
    [setBoard, setGameOver, setCurrentPlayer]
  );

  return sendMoveToAI;
};

export default useSendMoveToAI;

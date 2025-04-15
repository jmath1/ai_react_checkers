import React from "react";
import { useGameContext } from "../context/GameContext";
const GameDirection = () => {
  const { currentPlayer, gameOver, winner } = useGameContext();

  const getWinnerText = (winner) => {
    if (winner === -1) return "You";
    if (winner === 1) return "AI";
    return null;
  };

  const getCurrentPlayerText = (currentPlayer) => {
    return currentPlayer === 1 ? "AI" : "You";
  };

  const winnerText = getWinnerText(winner);
  const currentPlayerText = getCurrentPlayerText(currentPlayer);

  return (
    <div style={{ textAlign: "center" }}>
      <p>Current Player: {currentPlayerText}</p>

      {winnerText && <p className="winner">Winner: {winnerText}!</p>}

      {gameOver && !winner && <p className="winner">Game Over!</p>}
    </div>
  );
};

export default GameDirection;

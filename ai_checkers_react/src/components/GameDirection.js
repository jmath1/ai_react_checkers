import React from "react";
import { useGameContext } from "../context/GameContext";
const GameDirection = () => {
  const { currentPlayer, gameOver, winner } = useGameContext();
  const winnerText = winner === -1 ? "You" : winner === 1 ? "AI" : null;
  const currentPlayerText = currentPlayer === 1 ? "AI" : "You";

  return (
    <div style={{ textAlign: "center" }}>
      <p>Current Player: {currentPlayerText}</p>

      {winnerText ? <p className="winner">Winner: {winnerText}!</p> : null}

      {gameOver && !winner && <p className="winner">Game Over!</p>}
    </div>
  );
};

export default GameDirection;

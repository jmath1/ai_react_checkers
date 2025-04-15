import React from "react";
import { useGameContext } from "../context/GameContext";
const GameDirection = () => {
  const { gameType, currentPlayer, gameOver, winner } = useGameContext();
  return (
    <div>
      <h1>{gameType === "checkers" ? "Checkers" : "Chess"} Game</h1>
      <p>Current Player: {currentPlayer === -1 ? "You" : "AI"}</p>
      {winner && (
        <p className="winner">Winner: {winner === -1 ? "You" : "AI"}!</p>
      )}
      {gameOver && !winner && <p className="winner">Game Over!</p>}
    </div>
  );
};

export default GameDirection;

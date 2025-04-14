import React from "react";

const GameDirection = ({ gameType, winner, gameOver, currentPlayer }) => {
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

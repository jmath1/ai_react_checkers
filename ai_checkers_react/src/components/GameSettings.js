import React from "react";
import GameDirection from "./GameDirection";
import ColorControls from "./ColorControls";
import ResetButton from "./ResetButton";
const GameSettings = ({ checkersGame }) => {
  const { board, resetGame } = checkersGame;
  return (
    <div>
      <GameDirection board={board} />
      <ColorControls />
      <ResetButton resetGame={resetGame} />
    </div>
  );
};

export default GameSettings;

import React from "react";
import GameDirection from "./GameDirection";
import ColorControls from "./ColorControls";
import ResetButton from "./ResetButton";
const GameSettings = () => {
  return (
    <div>
      <GameDirection />
      <ColorControls />
      <ResetButton />
    </div>
  );
};

export default GameSettings;

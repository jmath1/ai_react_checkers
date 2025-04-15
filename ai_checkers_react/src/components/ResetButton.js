import React from "react";
import useResetGame from "../hooks/useResetGame";
const ResetButton = () => {
  const resetGame = useResetGame();
  const handleReset = () => {
    resetGame();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={handleReset}>Reset Game</button>
      <br></br>
      <br></br>
    </div>
  );
};

export default ResetButton;

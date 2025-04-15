import React from "react";
import useResetGame from "../hooks/useResetGame";

const ResetButton = () => {
  const resetGame = useResetGame();

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={resetGame}>Reset Game</button>
      <br></br>
      <br></br>
    </div>
  );
};

export default ResetButton;

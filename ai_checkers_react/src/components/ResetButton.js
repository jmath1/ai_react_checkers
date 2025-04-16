import React from "react";

const ResetButton = ({ resetGame }) => {
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

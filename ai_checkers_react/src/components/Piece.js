import React from "react";

const Piece = ({ piece, humanColor, aiColor }) => {
  const pieceColor = piece > 0 ? humanColor : aiColor;

  return (
    <div
      className={`piece ${Math.abs(piece) === 2 ? "king" : ""}`}
      style={{ backgroundColor: pieceColor }}
    >
      {Math.abs(piece) === 2 && <span className="king-label">K</span>}
    </div>
  );
};

export default Piece;

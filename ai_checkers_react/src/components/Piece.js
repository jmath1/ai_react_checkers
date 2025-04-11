import React from "react";

const Piece = ({ piece }) => {
  return (
    <div
      className={`piece ${piece > 0 ? "red-piece" : "black-piece"} ${
        Math.abs(piece) === 2 ? "king" : ""
      }`}
    >
      {Math.abs(piece) === 2 && <span className="king-label">K</span>}
    </div>
  );
};

export default Piece;

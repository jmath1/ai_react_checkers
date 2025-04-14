import React from "react";
import { useColorContext } from "../context/ColorContext";

const CheckersPiece = ({ piece }) => {
  const { humanColor, aiColor } = useColorContext();
  const pieceColor = piece > 0 ? aiColor : humanColor;

  return (
    <div
      className={`piece ${Math.abs(piece) === 2 ? "king" : ""}`}
      style={{ backgroundColor: pieceColor }}
    >
      {Math.abs(piece) === 2 && <span className="king-label">★</span>}
    </div>
  );
};

export default CheckersPiece;

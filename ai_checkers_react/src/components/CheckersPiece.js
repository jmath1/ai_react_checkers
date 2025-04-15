import React from "react";
import { useColorContext } from "../context/ColorContext";

const CheckersPiece = ({ piece }) => {
  const { humanColor, aiColor } = useColorContext();

  const getPieceColor = () => {
    return piece > 0 ? aiColor : humanColor;
  };

  const getPieceClassName = () => {
    return `piece ${Math.abs(piece) === 2 ? "king" : ""}`;
  };

  const pieceType = () => {
    return Math.abs(piece) === 2 && <span className="king-label">★</span>;
  };

  const pieceColor = getPieceColor();
  const pieceClassName = getPieceClassName();

  return (
    <div className={pieceClassName} style={{ backgroundColor: pieceColor }}>
      {pieceType()}
    </div>
  );
};

export default CheckersPiece;

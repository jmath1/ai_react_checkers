import React from "react";
import Piece from "./Piece";

const Square = ({
  row,
  col,
  piece,
  selectedPiece,
  handleSquareClick,
  humanColor,
  aiColor,
}) => {
  const isDark = (row + col) % 2 === 1;
  const isSelected =
    selectedPiece && selectedPiece[0] === row && selectedPiece[1] === col;

  return (
    <div
      className={`square ${isDark ? "dark-square" : "light-square"} ${
        isSelected ? "selected" : ""
      }`}
      onClick={() => handleSquareClick(row, col)}
    >
      {piece !== 0 && (
        <Piece piece={piece} humanColor={humanColor} aiColor={aiColor} />
      )}
    </div>
  );
};

export default Square;

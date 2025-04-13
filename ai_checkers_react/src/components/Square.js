import React from "react";
import Piece from "./Piece";
import { useColorContext } from "../context/ColorContext";
const Square = ({ row, col, piece, selectedPiece, handleSquareClick }) => {
  const { darkSquareColor, lightSquareColor } = useColorContext();
  const isDark = (row + col) % 2 === 1;
  const isSelected =
    selectedPiece && selectedPiece[0] === row && selectedPiece[1] === col;

  return (
    <div
      className={`square ${isSelected ? "selected" : ""}`}
      style={{ backgroundColor: isDark ? darkSquareColor : lightSquareColor }}
      onClick={() => handleSquareClick(row, col)}
    >
      {piece !== 0 && <Piece piece={piece} />}
    </div>
  );
};

export default Square;

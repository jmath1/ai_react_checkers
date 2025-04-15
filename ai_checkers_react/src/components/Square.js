import React from "react";
import CheckersPiece from "./CheckersPiece";
import { useColorContext } from "../context/ColorContext";
const Square = ({ row, col, piece, selectedPiece, handleSquareClick }) => {
  const { darkSquareColor, lightSquareColor } = useColorContext();

  const getBackgroundColor = () => {
    const isDark = (row + col) % 2 === 1;
    return isDark ? darkSquareColor : lightSquareColor;
  };

  const getSelection = () =>
    selectedPiece?.[0] === row && selectedPiece?.[1] === col ? "selected" : "";

  const backgroundColor = getBackgroundColor();
  const selection = getSelection();

  return (
    <div
      className={`square ${selection}`}
      style={{ backgroundColor: backgroundColor }}
      onClick={() => handleSquareClick(row, col)}
    >
      {piece !== 0 && <CheckersPiece piece={piece} />}
    </div>
  );
};

export default Square;

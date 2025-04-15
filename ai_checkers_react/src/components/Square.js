import React from "react";
import CheckersPiece from "./CheckersPiece";
import { useColorContext } from "../context/ColorContext";
import { useGameContext } from "../context/GameContext";
const Square = ({ row, col, piece, selectedPiece, handleSquareClick }) => {
  const { darkSquareColor, lightSquareColor } = useColorContext();
  const { movingOptions } = useGameContext();
  const isMovingOption = movingOptions.some(
    (option) => option[0] === row && option[1] === col
  );

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
      className={`square ${selection} ${isMovingOption ? "moving-option" : ""}`}
      style={{ backgroundColor: backgroundColor }}
      onClick={() => handleSquareClick(row, col)}
    >
      {piece !== 0 && <CheckersPiece piece={piece} />}
    </div>
  );
};

export default Square;

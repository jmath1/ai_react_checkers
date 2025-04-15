import React from "react";
import { useColorContext } from "../context/ColorContext";
import { useGameContext } from "../context/GameContext";
import CheckersPiece from "./CheckersPiece";
import ChessPiece from "./ChessPiece";

const Piece = ({ piece }) => {
  const { humanColor, aiColor } = useColorContext();

  const getPieceColor = () => {
    return piece > 0 ? aiColor : humanColor;
  };

  const pieceColor = getPieceColor();

  return <CheckersPiece piece={piece} color={pieceColor} />;
};

export default Piece;

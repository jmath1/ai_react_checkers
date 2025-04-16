import React from "react";
import Square from "./Square";
import { useGameContext } from "../context/GameContext";
import {
  getDirections,
  isValidJump,
  isValidMove,
  applyMoveToBoard,
} from "../utils/GameUtils";
import useSendMoveToAI from "../hooks/useSendMoveToAI";

const Board = () => {
  const sendMoveToAI = useSendMoveToAI();
  const { selectedPiece, setSelectedPiece } = useGameContext();

  const {
    board,
    currentPlayer,
    gameOver,
    setBoard,
    setCurrentPlayer,
    setMovingOptions,
    movingOptions,
  } = useGameContext();

  const provideMovingOptions = (row, col) => {
    const piece = board[row][col];
    const directions = getDirections(piece);
    const options = [];

    const addMoveOption = (newRow, newCol, rowDir, colDir) => {
      if (board[newRow][newCol] === 0) {
        options.push([newRow, newCol]);
      } else if (Math.sign(board[newRow][newCol]) !== Math.sign(piece)) {
        const jumpRow = newRow + rowDir;
        const jumpCol = newCol + colDir;
        if (isValidJump(board, jumpRow, jumpCol)) {
          options.push([jumpRow, jumpCol]);
        }
      }
    };

    for (const [rowDir, colDir] of directions) {
      const newRow = row + rowDir;
      const newCol = col + colDir;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        addMoveOption(newRow, newCol, rowDir, colDir);
      }
    }
    setMovingOptions(options);
    return options;
  };

  const handleSquareClick = (row, col) => {
    if (currentPlayer !== -1 || gameOver) return;

    const piece = board[row][col];

    if (!selectedPiece && piece !== 0 && piece < 0) {
      setSelectedPiece([row, col]);
      provideMovingOptions(row, col);
      return;
    }

    if (selectedPiece) {
      const [fromRow, fromCol] = selectedPiece;
      const validMove = isValidMove(row, col, movingOptions);

      if (validMove) {
        const move = [fromRow, fromCol, row, col];
        const newBoard = applyMoveToBoard(board, move);
        setMovingOptions([]);
        setBoard(newBoard);
        setSelectedPiece(null);
        setCurrentPlayer(1);
        sendMoveToAI(move);
      } else {
        setSelectedPiece(null);
      }
    }
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((_, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            piece={board[rowIndex][colIndex]}
            selectedPiece={selectedPiece}
            handleSquareClick={handleSquareClick}
          />
        ))
      )}
    </div>
  );
};

export default Board;

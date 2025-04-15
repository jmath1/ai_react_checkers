import React from "react";
import Square from "./Square";
import { useGameContext } from "../context/GameContext";

const Board = ({ selectedPiece, setSelectedPiece, sendMoveToAI }) => {
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
    // given a row an a column, provide the moving options. The end result will be that movingOptions is populated by a list of possible moves
    const piece = board[row][col];
    const isKing = Math.abs(piece) === 2;
    const directions = isKing
      ? [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ]
      : piece < 0
      ? [
          [-1, -1],
          [-1, 1],
        ]
      : [
          [1, -1],
          [1, 1],
        ];
    const options = [];

    for (const [rowDir, colDir] of directions) {
      const newRow = row + rowDir;
      const newCol = col + colDir;

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        if (board[newRow][newCol] === 0) {
          options.push([newRow, newCol]);
        } else if (Math.sign(board[newRow][newCol]) !== Math.sign(piece)) {
          const jumpRow = newRow + rowDir;
          const jumpCol = newCol + colDir;

          if (
            jumpRow >= 0 &&
            jumpRow < 8 &&
            jumpCol >= 0 &&
            jumpCol < 8 &&
            board[jumpRow][jumpCol] === 0
          ) {
            options.push([jumpRow, jumpCol]);
          }
        }
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
      const isKing = Math.abs(board[fromRow][fromCol]) === 2;
      const validMove = isValidMove(fromRow, fromCol, row, col, isKing);

      if (validMove) {
        const move = [fromRow, fromCol, row, col];
        const newBoard = applyMove(board, move);
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

  const isValidMove = (fromRow, fromCol, toRow, toCol, isKing) => {
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    const piece = board[fromRow][fromCol];

    if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
    if (board[toRow][toCol] !== 0) return false;

    if (!isKing && piece < 0 && rowDiff > 0) return false;

    if (Math.abs(rowDiff) === 1) return true;

    if (Math.abs(rowDiff) === 2) {
      const midRow = (fromRow + toRow) / 2;
      const midCol = (fromCol + toCol) / 2;
      const midPiece = board[midRow][midCol];
      return midPiece !== 0 && midPiece > 0;
    }
    return false;
  };

  const applyMove = (board, move) => {
    const newBoard = board.map((row) => [...row]);
    const [fromRow, fromCol, toRow, toCol] = move;
    newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
    newBoard[fromRow][fromCol] = 0;
    if (Math.abs(toRow - fromRow) === 2) {
      const midRow = (fromRow + toRow) / 2;
      const midCol = (fromCol + toCol) / 2;
      newBoard[midRow][midCol] = 0;
    }
    if (toRow === 0 && newBoard[toRow][toCol] === -1)
      newBoard[toRow][toCol] = -2; // Black King
    if (toRow === 7 && newBoard[toRow][toCol] === 1) newBoard[toRow][toCol] = 2; // Red King
    return newBoard;
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

import React from "react";
import Square from "./Square";

const Board = ({
  board,
  currentPlayer,
  selectedPiece,
  setSelectedPiece,
  setBoard,
  setCurrentPlayer,
  sendMoveToAI,
  gameOver,
  humanColor,
  aiColor,
}) => {
  const handleSquareClick = (row, col) => {
    if (currentPlayer !== 1 || gameOver) return;

    const piece = board[row][col];

    if (!selectedPiece && piece !== 0 && piece > 0) {
      setSelectedPiece([row, col]);
      return;
    }

    if (selectedPiece) {
      const [fromRow, fromCol] = selectedPiece;
      const isKing = Math.abs(board[fromRow][fromCol]) === 2;
      const validMove = isValidMove(fromRow, fromCol, row, col, isKing);

      if (validMove) {
        const move = [fromRow, fromCol, row, col];
        const newBoard = applyMove(board, move);
        setBoard(newBoard);
        setSelectedPiece(null);
        setCurrentPlayer(-1);
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

    if (!isKing && piece > 0 && rowDiff < 0) return false;

    if (Math.abs(rowDiff) === 1) return true;

    if (Math.abs(rowDiff) === 2) {
      const midRow = (fromRow + toRow) / 2;
      const midCol = (fromCol + toCol) / 2;
      const midPiece = board[midRow][midCol];
      return midPiece !== 0 && midPiece < 0;
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
    if (toRow === 7 && newBoard[toRow][toCol] === 1) newBoard[toRow][toCol] = 2;
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
            humanColor={humanColor}
            aiColor={aiColor}
          />
        ))
      )}
    </div>
  );
};

export default Board;

const kingDirections = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

const playerDirections = [
  [-1, -1],
  [-1, 1],
];

const aiDirections = [
  [1, -1],
  [1, 1],
];

export const getDirections = (piece) => {
  const isKing = Math.abs(piece) === 2;

  const pieceType = isKing ? "king" : piece < 0 ? "player" : "ai";

  switch (pieceType) {
    case "king":
      return kingDirections;
    case "player":
      return playerDirections;
    case "ai":
      return aiDirections;
    default:
      return [];
  }
};

export const isValidJump = (board, jumpRow, jumpCol) => {
  return (
    jumpRow >= 0 &&
    jumpRow < 8 &&
    jumpCol >= 0 &&
    jumpCol < 8 &&
    board[jumpRow][jumpCol] === 0
  );
};

export const isValidMove = (fromRow, fromCol, toRow, toCol, board) => {
  const isKing = Math.abs(board[fromRow][fromCol]) === 2;

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

export const applyMoveToBoard = (board, move) => {
  const jump = (fromRow, fromCol, toRow, toCol, newBoard) => {
    if (Math.abs(toRow - fromRow) === 2) {
      const midRow = (fromRow + toRow) / 2;
      const midCol = (fromCol + toCol) / 2;
      newBoard[midRow][midCol] = 0;
    }
  };

  const promoteKing = (toRow, toCol, newBoard) => {
    if (toRow === 0 && newBoard[toRow][toCol] === -1) {
      newBoard[toRow][toCol] = -2; // Black King
    } else if (toRow === 7 && newBoard[toRow][toCol] === 1) {
      newBoard[toRow][toCol] = 2; // Red King
    }
  };

  const newBoard = board.map((row) => [...row]);

  const [fromRow, fromCol, toRow, toCol] = move;

  newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
  newBoard[fromRow][fromCol] = 0;

  jump(fromRow, fromCol, toRow, toCol, newBoard);
  promoteKing(toRow, toCol, newBoard);
  return newBoard;
};

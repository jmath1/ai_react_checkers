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

// Checkers logic converted from Python to JavaScript (function-based)

import { useState, useCallback } from "react";

const DEPTH = 5;
const initialBoard = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [-1, 0, -1, 0, -1, 0, -1, 0],
  [0, -1, 0, -1, 0, -1, 0, -1],
  [-1, 0, -1, 0, -1, 0, -1, 0],
];

function deepCopy(board) {
  return board.map((row) => [...row]);
}

function evaluateBoard(board) {
  let aiScore = 0,
    playerScore = 0;
  for (let row of board) {
    for (let cell of row) {
      if (cell === 1) aiScore += 1;
      if (cell === 2) aiScore += 1.5;
      if (cell === -1) playerScore += 1;
      if (cell === -2) playerScore += 1.5;
    }
  }
  return aiScore - playerScore;
}

function getPossibleMoves(board, player) {
  const moves = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === player || board[row][col] === player * 2) {
        const isKing = board[row][col] === player * 2;
        const directions = isKing ? [1, -1] : player === 1 ? [1] : [-1];

        for (let dRow of directions) {
          for (let dCol of [-1, 1]) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (
              newRow >= 0 &&
              newRow < 8 &&
              newCol >= 0 &&
              newCol < 8 &&
              board[newRow][newCol] === 0
            ) {
              moves.push([row, col, newRow, newCol]);
            }
          }
        }

        for (let dRow of directions) {
          for (let dCol of [-1, 1]) {
            const newRow = row + dRow * 2;
            const newCol = col + dCol * 2;
            const midRow = row + dRow;
            const midCol = col + dCol;
            if (
              newRow >= 0 &&
              newRow < 8 &&
              newCol >= 0 &&
              newCol < 8 &&
              midRow >= 0 &&
              midRow < 8 &&
              midCol >= 0 &&
              midCol < 8 &&
              [-player, -player * 2].includes(board[midRow][midCol]) &&
              board[newRow][newCol] === 0
            ) {
              moves.push([row, col, newRow, newCol]);
            }
          }
        }
      }
    }
  }
  return moves;
}

function applyMove(board, move) {
  const [fromRow, fromCol, toRow, toCol] = move;
  const newBoard = deepCopy(board);
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
  newBoard[fromRow][fromCol] = 0;

  if (Math.abs(fromRow - toRow) === 2) {
    const midRow = (fromRow + toRow) / 2;
    const midCol = (fromCol + toCol) / 2;
    newBoard[midRow][midCol] = 0;
  }

  if (toRow === 0 && newBoard[toRow][toCol] === -1) {
    newBoard[toRow][toCol] = -2;
  } else if (toRow === 7 && newBoard[toRow][toCol] === 1) {
    newBoard[toRow][toCol] = 2;
  }

  return newBoard;
}

function minimax(board, depth, maximizingPlayer, alpha, beta) {
  if (depth === 0 || !hasMoves(board, maximizingPlayer ? 1 : -1)) {
    return [evaluateBoard(board), null];
  }

  let bestMove = null;
  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (let move of getPossibleMoves(board, 1)) {
      const [evalScore] = minimax(
        applyMove(board, move),
        depth - 1,
        false,
        alpha,
        beta
      );
      if (evalScore > maxEval) {
        maxEval = evalScore;
        bestMove = move;
      }
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return [maxEval, bestMove];
  } else {
    let minEval = Infinity;
    for (let move of getPossibleMoves(board, -1)) {
      const [evalScore] = minimax(
        applyMove(board, move),
        depth - 1,
        true,
        alpha,
        beta
      );
      if (evalScore < minEval) {
        minEval = evalScore;
        bestMove = move;
      }
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return [minEval, bestMove];
  }
}

function hasMoves(board, player) {
  return getPossibleMoves(board, player).length > 0;
}

export function useCheckersGame() {
  const [board, setBoard] = useState(deepCopy(initialBoard));

  const resetGame = useCallback(() => {
    setBoard(deepCopy(initialBoard));
    console.log(board);
  }, [setBoard]);

  const sendMoveToAI = useCallback(
    (move) => {
      const newBoard = applyMove(board, move);
      setBoard(newBoard);

      const [, aiMove] = minimax(newBoard, DEPTH, true, -Infinity, Infinity);
      setTimeout(() => {
        const finalBoard = aiMove ? applyMove(newBoard, aiMove) : newBoard;
        setBoard(finalBoard);
      }, 1000);
      return aiMove;
    },
    [board]
  );

  return {
    board,
    resetGame,
    sendMoveToAI,
    hasMoves: (player) => hasMoves(board, player),
    setBoard,
  };
}

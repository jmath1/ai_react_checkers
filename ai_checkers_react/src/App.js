import { useState, useEffect } from "react";
import "./App.css";

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

const App = () => {
  const [board, setBoard] = useState(initialBoard);

  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 = Human (Red), -1 = AI (Black)
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Check for winner
  useEffect(() => {
    const redPieces = board.flat().filter((x) => x > 0).length;
    const blackPieces = board.flat().filter((x) => x < 0).length;
    if (redPieces === 0) setWinner(-1); // AI wins
    if (blackPieces === 0) setWinner(1); // Human wins
  }, [board]);

  // Send move to backend and get AI response
  const sendMoveToAI = async (move) => {
    try {
      const response = await fetch("http://localhost:5000/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ move }),
      });
      const data = await response.json();
      setBoard(data.board);
      setGameOver(data.game_over);
      setCurrentPlayer(1); // Back to human
    } catch (error) {
      console.error("Error communicating with AI:", error);
    }
  };

  // Handle square click
  const handleSquareClick = (row, col) => {
    if (currentPlayer !== 1 || gameOver) return; // Only human moves, not when game over

    const piece = board[row][col];

    if (!selectedPiece && piece !== 0 && piece > 0) {
      // Select Red piece
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
        setCurrentPlayer(-1); // AI's turn
        sendMoveToAI(move);
      } else {
        setSelectedPiece(null);
      }
    }
  };

  // Validate move (same as backend for consistency)
  const isValidMove = (fromRow, fromCol, toRow, toCol, isKing) => {
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    const piece = board[fromRow][fromCol];

    if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
    if (board[toRow][toCol] !== 0) return false;

    if (!isKing && piece > 0 && rowDiff < 0) return false; // Red moves down

    if (Math.abs(rowDiff) === 1) return true;

    if (Math.abs(rowDiff) === 2) {
      const midRow = (fromRow + toRow) / 2;
      const midCol = (fromCol + toCol) / 2;
      const midPiece = board[midRow][midCol];
      return midPiece !== 0 && midPiece < 0; // Can jump Black piece
    }
    return false;
  };

  // Apply move locally (for immediate feedback)
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

  // Render square
  const renderSquare = (row, col) => {
    const isDark = (row + col) % 2 === 1;
    const piece = board[row][col];
    const isSelected =
      selectedPiece && selectedPiece[0] === row && selectedPiece[1] === col;

    return (
      <div
        className={`square ${isDark ? "dark-square" : "light-square"} ${
          isSelected ? "selected" : ""
        }`}
        onClick={() => handleSquareClick(row, col)}
      >
        {piece !== 0 && (
          <div
            className={`piece ${piece > 0 ? "red-piece" : "black-piece"} ${
              Math.abs(piece) === 2 ? "king" : ""
            }`}
          >
            {Math.abs(piece) === 2 && <span className="king-label">K</span>}
          </div>
        )}
      </div>
    );
  };

  // Render board
  const renderBoard = () => (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((_, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`}>
            {renderSquare(rowIndex, colIndex)}
          </div>
        ))
      )}
    </div>
  );

  // Reset game
  const resetGame = async () => {
    try {
      const response = await fetch("http://localhost:5000/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setBoard(data.board);
      setCurrentPlayer(1);
      setSelectedPiece(null);
      setWinner(null);
      setGameOver(false);
    } catch (error) {
      console.error("Error resetting game:", error);
    }
  };

  return (
    <>
      <div className="container">
        <h1>Checkers Game</h1>
        <p>
          Current Player: {currentPlayer === 1 ? "You (Red)" : "AI (Black)"}
        </p>
        {winner && (
          <p className="winner">
            Winner: {winner === 1 ? "You (Red)" : "AI (Black)"}!
          </p>
        )}
        {gameOver && !winner && <p className="winner">Game Over!</p>}
        {renderBoard()}
        <button onClick={resetGame}>Reset Game</button>
      </div>
    </>
  );
};

export default App;

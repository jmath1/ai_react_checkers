import { useState, useEffect } from "react";
import "./App.css";
import Board from "./components/Board";
import GameControls from "./components/GameControls";

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

  useEffect(() => {
    const redPieces = board.flat().filter((x) => x > 0).length;
    const blackPieces = board.flat().filter((x) => x < 0).length;
    if (redPieces === 0) setWinner(-1); // AI wins
    if (blackPieces === 0) setWinner(1); // Human wins
  }, [board]);

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
    <div className="container">
      <h1>Checkers Game</h1>
      <p>Current Player: {currentPlayer === 1 ? "You (Red)" : "AI (Black)"}</p>
      {winner && (
        <p className="winner">
          Winner: {winner === 1 ? "You (Red)" : "AI (Black)"}!
        </p>
      )}
      {gameOver && !winner && <p className="winner">Game Over!</p>}
      <Board
        board={board}
        currentPlayer={currentPlayer}
        selectedPiece={selectedPiece}
        setSelectedPiece={setSelectedPiece}
        setBoard={setBoard}
        setCurrentPlayer={setCurrentPlayer}
        sendMoveToAI={sendMoveToAI}
        gameOver={gameOver}
      />
      <GameControls resetGame={resetGame} />
    </div>
  );
};

export default App;

import { useState, useEffect } from "react";
import "./App.css";
import Board from "./components/Board";
import ChessBoard from "./components/ChessBoard";
import GameControls from "./components/GameControls";
import ColorControls from "./components/ColorControls";

import { ColorProvider } from "./context/ColorContext";
import { GameProvider, useGameContext } from "./context/GameContext";

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

const AppContent = () => {
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState(-1); // -1 = Human (Black), 1 = AI (Red)
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const { gameType, setGameType } = useGameContext();

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    const redPieces = board.flat().filter((x) => x > 0).length;
    const blackPieces = board.flat().filter((x) => x < 0).length;
    if (redPieces === 0) setWinner(-1); // Human wins
    if (blackPieces === 0) setWinner(1); // AI wins
  }, [board]);

  const resetGame = async () => {
    try {
      const response = await fetch("http://localhost:5000/checkers/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setBoard(data.board);
      setCurrentPlayer(-1);
      setSelectedPiece(null);
      setWinner(null);
      setGameOver(false);
    } catch (error) {
      console.error("Error resetting game:", error);
    }
  };

  const sendMoveToAI = async (move) => {
    try {
      const apiUrl = process.env["API_URL"] || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/checkers/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ move }),
      });
      const data = await response.json();
      setBoard(data.board);
      setGameOver(data.game_over);
      setCurrentPlayer(-1); // Back to human
    } catch (error) {
      console.error("Error communicating with AI:", error);
    }
  };

  return (
    <div className="container">
      <select
        value={gameType}
        onChange={(e) => {
          setGameType(e.target.value);
          resetGame();
        }}
      >
        <option value="checkers">Checkers</option>
        <option value="chess">Chess</option>
      </select>

      <h1>{gameType === "checkers" ? "Checkers" : "Chess"} Game</h1>
      <p>Current Player: {currentPlayer === -1 ? "You (Black)" : "AI (Red)"}</p>
      {winner && (
        <p className="winner">
          Winner: {winner === -1 ? "You (Black)" : "AI (Red)"}!
        </p>
      )}
      {gameOver && !winner && <p className="winner">Game Over!</p>}
      <ColorControls />

      <div className="board-container">
        <Board
          board={board}
          currentPlayer={currentPlayer}
          selectedPiece={selectedPiece}
          setSelectedPiece={setSelectedPiece}
          setBoard={setBoard}
          setCurrentPlayer={setCurrentPlayer}
          gameOver={gameOver}
          sendMoveToAI={sendMoveToAI}
        />
        <GameControls resetGame={resetGame} />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <GameProvider>
      <ColorProvider>
        <AppContent />
      </ColorProvider>
    </GameProvider>
  );
};

export default App;

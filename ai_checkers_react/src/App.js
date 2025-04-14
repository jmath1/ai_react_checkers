import { useState, useEffect } from "react";
import "./App.css";
import Board from "./components/Board";
import SelectGameType from "./components/SelectGameType";
import GameControls from "./components/GameControls";
import ColorControls from "./components/ColorControls";

import { ColorProvider } from "./context/ColorContext";
import { GameProvider, useGameContext } from "./context/GameContext";
import GameDirection from "./components/GameDirection";
import useCheckWinner from "./hooks/useCheckWinner";
import useSendMoveToAI from "./hooks/useSendMoveToAI";

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

  const sendMoveToAI = useSendMoveToAI(setBoard, setGameOver, setCurrentPlayer);

  useEffect(() => {
    resetGame();
  }, []);

  useCheckWinner(board, setWinner);

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

  return (
    <div className="container">
      <SelectGameType gameType={gameType} setGameType={setGameType} />
      <GameDirection
        gameType={gameType}
        winner={winner}
        gameOver={gameOver}
        currentPlayer={currentPlayer}
      />

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

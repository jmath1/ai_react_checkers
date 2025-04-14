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
import useResetGame from "./hooks/useResetGame";

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
  const resetGame = useResetGame(
    setBoard,
    setCurrentPlayer,
    setSelectedPiece,
    setWinner,
    setGameOver
  );

  useEffect(() => {
    resetGame();
  }, []);

  useCheckWinner(board, setWinner);

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

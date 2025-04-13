import { useState, useEffect } from "react";
import "./App.css";
import Board from "./components/Board";
import GameControls from "./components/GameControls";
import ColorPicker from "./components/ColorPicker";
import { ColorProvider, useColorContext } from "./context/ColorContext";

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
  const {
    humanColor,
    aiColor,
    setHumanColor,
    setAiColor,
    darkSquareColor,
    setDarkSquareColor,
    lightSquareColor,
    setLightSquareColor,
  } = useColorContext();

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    const redPieces = board.flat().filter((x) => x > 0).length;
    const blackPieces = board.flat().filter((x) => x < 0).length;
    if (redPieces === 0) setWinner(-1); // Human wins
    if (blackPieces === 0) setWinner(1); // AI wins
  }, [board]);

  const resetGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer(-1);
    setSelectedPiece(null);
    setWinner(null);
    setGameOver(false);
  };

  return (
    <div className="container">
      <h1>Checkers Game</h1>
      <p>Current Player: {currentPlayer === -1 ? "You (Black)" : "AI (Red)"}</p>
      {winner && (
        <p className="winner">
          Winner: {winner === -1 ? "You (Black)" : "AI (Red)"}!
        </p>
      )}
      {gameOver && !winner && <p className="winner">Game Over!</p>}
      <div className="color-controls">
        <ColorPicker
          label="Your Pieces"
          color={humanColor}
          onChange={setHumanColor}
        />
        <ColorPicker label="AI Pieces" color={aiColor} onChange={setAiColor} />
        <br></br>
        <br></br>
        <ColorPicker
          label="Dark Squares"
          color={darkSquareColor}
          onChange={setDarkSquareColor}
        />
        <ColorPicker
          label="Light Squares"
          color={lightSquareColor}
          onChange={setLightSquareColor}
        />
      </div>
      <Board
        board={board}
        currentPlayer={currentPlayer}
        selectedPiece={selectedPiece}
        setSelectedPiece={setSelectedPiece}
        setBoard={setBoard}
        setCurrentPlayer={setCurrentPlayer}
        gameOver={gameOver}
      />
      <GameControls resetGame={resetGame} />
    </div>
  );
};

const App = () => {
  return (
    <ColorProvider>
      <AppContent />
    </ColorProvider>
  );
};

export default App;

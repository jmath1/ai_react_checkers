import { useState, useEffect } from "react";
import "./App.css";
import Board from "./components/Board";
import GameControls from "./components/GameControls";
import ColorPicker from "./components/ColorPicker";

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
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 = Human, -1 = AI
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [humanColor, setHumanColor] = useState("#ff0000"); // Default red
  const [aiColor, setAiColor] = useState("#000000"); // Default black

  useEffect(() => {
    // Reset game on component mount (page load/refresh)
    resetGame();
  }, []); //

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
      <p>Current Player: {currentPlayer === 1 ? "You" : "AI"}</p>
      {winner && (
        <p className="winner">Winner: {winner === 1 ? "You" : "AI"}!</p>
      )}
      {gameOver && !winner && <p className="winner">Game Over!</p>}
      <div className="color-controls">
        <ColorPicker
          label="Your Pieces"
          color={humanColor}
          onChange={setHumanColor}
        />
        <ColorPicker label="AI Pieces" color={aiColor} onChange={setAiColor} />
      </div>
      <Board
        board={board}
        currentPlayer={currentPlayer}
        selectedPiece={selectedPiece}
        setSelectedPiece={setSelectedPiece}
        setBoard={setBoard}
        setCurrentPlayer={setCurrentPlayer}
        sendMoveToAI={sendMoveToAI}
        gameOver={gameOver}
        humanColor={humanColor}
        aiColor={aiColor}
      />
      <GameControls resetGame={resetGame} />
    </div>
  );
};

export default App;

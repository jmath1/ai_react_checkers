import { useState, useEffect } from "react";
import "./App.css";
import Board from "./components/Board";
import GameSettings from "./components/GameSettings";

import { ColorProvider } from "./context/ColorContext";
import { GameProvider } from "./context/GameContext";

import useCheckWinner from "./hooks/useCheckWinner";
import useSendMoveToAI from "./hooks/useSendMoveToAI";
import useResetGame from "./hooks/useResetGame";

const AppContent = () => {
  const [selectedPiece, setSelectedPiece] = useState(null);

  const sendMoveToAI = useSendMoveToAI();
  const resetGame = useResetGame();

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useCheckWinner();

  return (
    <div className="container">
      <GameSettings resetGame={resetGame} />
      <div className="board-container">
        <Board
          selectedPiece={selectedPiece}
          setSelectedPiece={setSelectedPiece}
          sendMoveToAI={sendMoveToAI}
        />
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

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
      <SelectGameType />
      <GameDirection />

      <ColorControls />

      <div className="board-container">
        <Board
          selectedPiece={selectedPiece}
          setSelectedPiece={setSelectedPiece}
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

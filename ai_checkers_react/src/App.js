import { useEffect } from "react";
import "./App.css";
import Board from "./components/Board";
import GameSettings from "./components/GameSettings";

import { ColorProvider } from "./context/ColorContext";
import { GameProvider } from "./context/GameContext";

import useCheckWinner from "./hooks/useCheckWinner";
import useResetGame from "./hooks/useResetGame";

const AppContent = () => {
  const resetGame = useResetGame();

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useCheckWinner();

  return (
    <div className="container">
      <GameSettings />
      <Board />
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

import React from "react";
import "./App.css";
import Board from "./components/Board";
import GameSettings from "./components/GameSettings";

import { ColorProvider } from "./context/ColorContext";
import { GameProvider } from "./context/GameContext";

import { useCheckersGame } from "./hooks/useCheckersGame";

const AppContent = () => {
  const checkersGame = useCheckersGame();

  return (
    <div className="container">
      <GameSettings checkersGame={checkersGame} />
      <Board checkersGame={checkersGame} />
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

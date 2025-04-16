import React, { createContext, useState, useContext } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [currentPlayer, setCurrentPlayer] = useState(-1); // -1 = Human (Black), 1 = AI (Red)
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [movingOptions, setMovingOptions] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);

  return (
    <GameContext.Provider
      value={{
        currentPlayer,
        setCurrentPlayer,
        winner,
        setWinner,
        gameOver,
        setGameOver,
        movingOptions,
        setMovingOptions,
        selectedPiece,
        setSelectedPiece,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  return useContext(GameContext);
};

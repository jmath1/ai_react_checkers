import React, { createContext, useState, useContext } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameType, setGameType] = useState("checkers");
  return (
    <GameContext.Provider
      value={{
        gameType,
        setGameType,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  return useContext(GameContext);
};

import React, { createContext, useState, useContext } from "react";

const GameContext = createContext();

const initialCheckersBoard = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [-1, 0, -1, 0, -1, 0, -1, 0],
  [0, -1, 0, -1, 0, -1, 0, -1],
  [-1, 0, -1, 0, -1, 0, -1, 0],
];

const initialChessBoard = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

export const GameProvider = ({ children }) => {
  const [gameType, setGameType] = useState("checkers");
  const [board, setBoard] = useState(
    gameType === "checkers" ? initialCheckersBoard : initialChessBoard
  );
  const [currentPlayer, setCurrentPlayer] = useState(-1); // -1 = Human (Black), 1 = AI (Red)
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  return (
    <GameContext.Provider
      value={{
        gameType,
        setGameType,
        board,
        setBoard,
        currentPlayer,
        setCurrentPlayer,
        winner,
        setWinner,
        gameOver,
        setGameOver,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  return useContext(GameContext);
};

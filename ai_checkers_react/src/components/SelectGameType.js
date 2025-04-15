import React from "react";
import useResetGame from "../hooks/useResetGame";
import { useGameContext } from "../context/GameContext";
const SelectGameType = () => {
  const { setGameType, gameType } = useGameContext();
  const resetGame = useResetGame();

  const handleGameTypeChange = (event) => {
    setGameType(event.target.value);
    resetGame();
  };

  return (
    <div className="select-game-type">
      <label htmlFor="game-type">Select Game Type: </label>
      <select id="game-type" value={gameType} onChange={handleGameTypeChange}>
        <option value="checkers">Checkers</option>
        <option value="chess">Chess</option>
      </select>
    </div>
  );
};
export default SelectGameType;

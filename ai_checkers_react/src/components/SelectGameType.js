import React from "react";

const SelectGameType = ({ gameType, setGameType }) => {
  const handleGameTypeChange = (event) => {
    setGameType(event.target.value);
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

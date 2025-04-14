import { useEffect } from "react";

const useCheckWinner = (board, setWinner) => {
  useEffect(() => {
    const redPieces = board.flat().filter((x) => x > 0).length;
    const blackPieces = board.flat().filter((x) => x < 0).length;

    if (redPieces === 0) setWinner(-1); // Human wins
    else if (blackPieces === 0) setWinner(1); // AI wins
  }, [board, setWinner]);
};

export default useCheckWinner;

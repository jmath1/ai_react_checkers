import React, { createContext, useState, useContext } from "react";

const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  const [humanColor, setHumanColor] = useState("#000000"); // Default black
  const [aiColor, setAiColor] = useState("#ff0000"); // Default red
  const [darkSquareColor, setDarkSquareColor] = useState("#8B4513"); // Default brown
  const [lightSquareColor, setLightSquareColor] = useState("#FFF8DC"); // Default beige

  return (
    <ColorContext.Provider
      value={{
        humanColor,
        aiColor,
        setHumanColor,
        setAiColor,
        darkSquareColor,
        setDarkSquareColor,
        lightSquareColor,
        setLightSquareColor,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => {
  return useContext(ColorContext);
};

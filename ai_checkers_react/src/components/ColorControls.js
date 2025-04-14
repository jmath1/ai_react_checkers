import { useColorContext } from "../context/ColorContext";
import ColorPicker from "./ColorPicker";

const ColorControls = ({ color, setColor }) => {
  const {
    humanColor,
    aiColor,
    setHumanColor,
    setAiColor,
    darkSquareColor,
    setDarkSquareColor,
    lightSquareColor,
    setLightSquareColor,
  } = useColorContext();
  return (
    <div className="color-controls">
      <ColorPicker label="AI Pieces" color={aiColor} onChange={setAiColor} />
      <ColorPicker
        label="Your Pieces"
        color={humanColor}
        onChange={setHumanColor}
      />
      <br></br>
      <br></br>
      <ColorPicker
        label="Dark Squares"
        color={darkSquareColor}
        onChange={setDarkSquareColor}
      />
      <ColorPicker
        label="Light Squares"
        color={lightSquareColor}
        onChange={setLightSquareColor}
      />
    </div>
  );
};

export default ColorControls;

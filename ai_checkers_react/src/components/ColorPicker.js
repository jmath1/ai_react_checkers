import React from "react";

const ColorPicker = ({ label, color, onChange }) => {
  return (
    <div className="color-picker">
      <label>{label}: </label>
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default ColorPicker;

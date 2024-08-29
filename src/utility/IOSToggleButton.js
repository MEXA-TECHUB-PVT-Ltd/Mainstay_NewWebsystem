import React, { useState } from "react";

const IOSToggleButton = ({ defaultChecked, handleChange }) => {
  const [isChecked, setChecked] = useState(defaultChecked || false);

  const handleToggle = () => {
    const updatedValue = !isChecked;
    setChecked(updatedValue);
    if (handleChange) {
      handleChange(updatedValue);
    }
    console.log("Toggle button changed:", updatedValue);
  };

  const containerStyle = {
    position: "relative",
    alignSelf: "center",

    display: "inline-block",
    cursor: "pointer",
    margin: "4px 0",
  };

  const inputStyle = {
    opacity: "0",
    width: "0",
    height: "0",
    position: "absolute",
  };

  const sliderStyle = {
    width: "32px",
    height: "18px",
    backgroundColor: isChecked ? "#0F6D6A26" : "#F4F4F4",
    borderRadius: "20px",
    transition: "0.4s",
  };

  const handleStyle = {
    width: "18px",
    height: "18px",
    backgroundColor: isChecked ? "#0F6D6A" : "#C2C2C2",
    borderRadius: "50%",
    position: "absolute",
    left: isChecked ? "15px" : "0",
    transition: "0.4s",
  };

  return (
    <div style={containerStyle} onClick={handleToggle}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        style={inputStyle}
      />
      <div style={sliderStyle}>
        <div style={handleStyle}></div>
      </div>
    </div>
  );
};

export default IOSToggleButton;

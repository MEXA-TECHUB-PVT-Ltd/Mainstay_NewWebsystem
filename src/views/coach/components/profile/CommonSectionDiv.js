import React from "react";
import { Button } from "reactstrap";

const CommonSectionDiv = ({ children }) => {
  return (
    <div
      className="d-flex justify-content-between align-items-center mb-1 px-2 "
      style={{
        backgroundColor: "#0F6D6A",
        borderRadius: "20px",
        padding: "5px"
      }}
    >
      {children}
    </div>
  );
};

export const HeaderText = ({ text }) => {
  return <h4 style={{ color: "#FFF" }}>{text}</h4>;
};

export const MyButton = ({ text, toggleModal }) => {
  return (
    <Button
      color=""
      size="sm"
      style={{
        boxShadow: "none",
        backgroundColor: "#FFF",
        color: "#0F6D6A",
      }}
      onClick={toggleModal}
    >
      {text}
    </Button>
  );
};

export default CommonSectionDiv;

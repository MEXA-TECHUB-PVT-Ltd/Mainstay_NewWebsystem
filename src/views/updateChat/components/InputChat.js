import React from "react";
import { Input, Spinner } from "reactstrap";
import { X } from "react-feather"; // Import the X icon from react-feather
import sendIcon from "@assets/images/avatars/send.png";
import attachIcon from "@assets/images/avatars/attachicon.png";
import { useTranslation } from "react-i18next";

const InputChat = ({
  message,
  setMessage,
  sendMessage,
  handleFileChange,
  imagePreview,
  setImagePreview,
  setImageInput,
  loading,
}) => {
  const { t } = useTranslation();
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageInput(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        borderTop: "1px solid #ccc",
        position: "fixed",
        bottom: 0,
        left: "40%",
        right: 60,
        backgroundColor: "#fff",
      }}
    >
      {imagePreview && (
        <div style={{ marginBottom: "10px", textAlign: "center" }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ width: "100px", height: "auto" }}
          />
          <X
            onClick={handleRemoveImage}
            style={{
              width: "20px",
              height: "20px",
              cursor: "pointer",
              position: "absolute",
              marginTop: "-10px",
              marginLeft: "0px",
            }}
          />
        </div>
      )}
      <div style={{ display: "flex" }}>
        <img
          src={attachIcon}
          alt="Attach file"
          style={{ width: "40px", cursor: "pointer", marginRight: "10px" }}
          onClick={() => document.getElementById("file-input").click()}
        />
        <input
          id="file-input"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress} // Add key down event to input
          style={{
            width: "calc(100% - 50px)", // Adjust width to make room for the send icon
            borderRadius: "50px",
            borderColor: "#ced4da",
            boxShadow: "none",
          }}
          placeholder={t("Type a message")}
        />
        {loading ? (
          <div
            style={{
              backgroundColor: "rgb(7, 63, 61)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 5px",
              borderRadius: "50%",
              width: "41px",
            }}
          >
            <Spinner size="sm" color="white" />
          </div>
        ) : (
          <img
            src={sendIcon}
            alt="Send message"
            style={{ width: "40px", cursor: "pointer" }}
            onClick={sendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default InputChat;

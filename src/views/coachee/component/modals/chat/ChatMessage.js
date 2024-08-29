const ChatMessage = ({ message, isSender }) => (
  <div
    style={{
      textAlign: isSender ? "right" : "left",
      backgroundColor: isSender ? "#DCEBEB" : "#E4E4E4D4",
      color: isSender ? "#0F6D6A" : "#383737",
      marginBottom: "10px",
      maxWidth: "40%",
      borderRadius: isSender ? "10px 0 10px 10px" : "0 10px 10px 10px",
      padding: "10px",
      wordWrap: "break-word",
      marginLeft: isSender ? "auto" : "0",
      marginRight: isSender ? "auto" : "0",
    }}
  >
    {message.image ? (
      <img src={message.image} alt="Sent" style={{ maxWidth: "100px" }} />
    ) : (
      <>{message.text}</>
    )}
  </div>
);


export default ChatMessage;

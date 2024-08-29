import ChatMessage from "./ChatMessage";
import NoMessages from "./NoMessages";

const MessageDisplay = ({ messages, userId, profilePic, contactFirstName }) => (
  <div
    style={{ overflowX: "auto", flex: "1", maxHeight: "65vh", padding: "15px" }}
  >
    {messages.length === 0 ? (
      <NoMessages profilePic={profilePic} contactFirstName={contactFirstName} />
    ) : (
      messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          isSender={message.senderid === userId}
        />
      ))
    )}
  </div>
);


export default MessageDisplay;

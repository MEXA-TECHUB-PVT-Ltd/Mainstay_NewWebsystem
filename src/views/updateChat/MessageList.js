import { t } from "i18next";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

function MessageList({ messages, userId }) {
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        minHeight: "70vh",
        maxHeight: "80vh",
        overflowY: "auto",
        marginBottom: "50px",
        marginTop: "60px",
        padding: "0 20px",
      }}
    >
      {messages?.length === 0 && <p> {t("No messages to display.")} </p>}
      {messages.map((msg, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent:
              msg.sender_id === userId ? "flex-end" : "flex-start",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              maxWidth: "60%",
              backgroundColor: msg.sender_id === userId ? "#dcf8c6" : "#fff",
              padding: "10px",
              borderRadius: "10px",
              boxShadow: "0 1px .5px rgba(0,0,0,0.13)",
            }}
          >
            <p>{msg.message}</p>
            {msg.image_url && (
              <img
                src={msg.image_url}
                alt="Attached"
                style={{ maxWidth: "100%", borderRadius: "10px" }}
                onLoad={() =>
                  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
                }
              />
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;

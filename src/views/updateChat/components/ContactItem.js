import React from "react";
import { ListGroupItem } from "reactstrap";

function ContactItem({
  contact,
  onSelectContact,
  receiverId,
  count,
  messages,
}) {

  console.log(contact)
  return (
    <ListGroupItem
      action
      onClick={() => onSelectContact(contact)}
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: receiverId === contact.id ? "#ebebeb" : "#fff",
        cursor: "pointer",
      }}
    >
      <img
        src={contact.profile_pic || "default-avatar.png"}
        alt={`${contact.first_name} ${contact.last_name}`}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          marginRight: "15px",
        }}
      />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div style={{ fontSize: "14px", color: "#333", fontWeight: "bold" }}>
          {contact.first_name} {contact.last_name}
        </div>
        <div style={{ fontSize: "12px", color: "#666" }}>
          {contact?.last_message}
        </div>
      </div>
      {/* <div style={{ fontSize: "12px", color: "#888", marginLeft: "10px" }}>
        {contact.last_message_time}
      </div> */}
      {contact.unread_count > 0 && contact.id === receiverId && (
        <span
          style={{
            backgroundColor: "#06d755",
            color: "#fff",
            borderRadius: "50%",
            padding: "2px 6px",
            marginLeft: "10px",
            fontSize: "12px",
          }}
        >
          {contact.unread_count}
        </span>
      )}
    </ListGroupItem>
  );
}

export default ContactItem;

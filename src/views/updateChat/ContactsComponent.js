import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { SOCKET_URL } from "../../urls/api";

function ContactsComponent({ userId, onSelectContact, receiverId }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const socket = io(SOCKET_URL, { query: { userId } });

    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${SOCKET_URL}/contacts/${userId}`);
        setContacts(response.data);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    fetchContacts();

    socket.on("update_contacts", fetchContacts);

    return () => {
      socket.off("update_contacts");
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (contacts.length > 0 && !receiverId) {
      onSelectContact(contacts[0]);
    }
  }, [contacts, onSelectContact, receiverId]);


  return (
    <div
      style={{
        width: "250px",
        borderRight: "1px solid gray",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <h2>My Contacts</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <li
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              style={{
                padding: "10px",
                backgroundColor: receiverId === contact.id ? "#ddd" : "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontWeight: receiverId === contact.id ? "bold" : "normal",
              }}
            >
              <img
                src={contact.image_url || "default-avatar.png"}
                alt={contact.first_name}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <div>
                <div>
                  {contact.first_name} {contact.last_name}
                </div>
                {contact.unread_count > 0 && (
                  <span style={{ color: "red" }}>({contact.unread_count})</span>
                )}
                <div
                  style={{
                    color: contact.is_online ? "green" : "gray",
                    fontSize: "0.8em",
                  }}
                >
                  {contact.is_online
                    ? "Online"
                    : `Last online: ${new Date(
                        contact.last_online
                      ).toLocaleString()}`}
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No contacts available.</p>
        )}
      </ul>
    </div>
  );
}

export default ContactsComponent;

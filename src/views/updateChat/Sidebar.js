import React from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import ContactItem from "./components/ContactItem";
import { useTranslation } from "react-i18next";

function Sidebar({ contacts, onSelectContact, receiverId, count, messages }) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        width: "300px",
        // backgroundColor: "#f0f2f5",
        height: "80vh",
        overflowY: "auto",
        borderRight: "1px solid #e0e0e0",
        position: "fixed",
        zIndex: 2,
        transition: "transform 0.3s ease-out",
      }}
    >
      <ListGroup flush style={{ width: "100%" }}>
        {contacts?.length > 0 ? (
          contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              onSelectContact={onSelectContact}
              receiverId={receiverId}
              count={count}
              messages={messages}
            />
          ))
        ) : (
          <ListGroupItem> {t("No contacts available.")} </ListGroupItem>
        )}
      </ListGroup>
    </div>
  );
}

export default Sidebar;

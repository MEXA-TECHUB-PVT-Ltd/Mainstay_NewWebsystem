import ContactListItem from "./ContactListItem";

const ContactList = ({
  contacts,
  selectedContactId,
  handleContactSelection,
}) => (
  <div
    style={{
      overflowY: "auto",
      maxHeight: "80vh",
      width: "35%",
      borderRight: "1px solid #ccc",
      padding: "0px",
    }}
  >
    {contacts.map((contact) => (
      <ContactListItem
        key={contact.id}
        contact={contact}
        isSelected={selectedContactId === contact.contact_id}
        onSelect={handleContactSelection}
      />
    ))}
  </div>
);


export default ContactList;

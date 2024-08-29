const ContactListItem = ({ contact, isSelected, onSelect }) => (
  <div
    style={{
      cursor: "pointer",
      height: "8vh",
      borderRadius: "5px",
      backgroundColor: isSelected ? "#e2e2e2" : "transparent",
      marginBottom: "5px",
      padding: "5px",
    }}
    onClick={() => onSelect(contact)}
  >
    <div style={{ paddingTop: "5px", display: "flex", alignItems: "left" }}>
      <img
        src={contact.profile_pic || avatar}
        style={{ width: "30px", borderRadius: "50px" }}
        alt="Avatar"
      />
      <div style={{ marginLeft: "10px" }}>
        <h6 style={{ fontSize: "12px", margin: "0" }}>
          {contact.contact_first_name}
        </h6>
        <p style={{ fontSize: "11px", marginLeft: "10px" }}>
          {formatTimestamp(contact.last_message_timestamp)}
        </p>
        <p style={{ fontSize: "11px", marginTop: "-15px", marginLeft: "30px" }}>
          {contact.last_message}
        </p>
      </div>
    </div>
  </div>
);


export default ContactListItem;

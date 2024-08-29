const ChatHeader = ({ selectedContact }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "5px",
      height: "8vh",
      backgroundImage: "linear-gradient(90.46deg, #073F3D 0%, #0F6D6A 100%)",
      borderRadius: "15px",
      padding: "10px",
      backgroundColor: "green",
      width: "100%",
    }}
  >
    <img
      src={selectedContact.profile_pic || avatar}
      style={{ width: "30px", borderRadius: "50px" }}
      alt="Avatar"
    />
    <h5 style={{ color: "white", margin: "0", width: "calc(100% - 80px)" }}>
      {selectedContact.contact_first_name} {selectedContact.contact_last_name}
    </h5>
    <img
      src={Report}
      onClick={toggle}
      style={{ cursor: "pointer", width: "30px", borderRadius: "50px" }}
      alt="Avatar"
    />
    <img
      src={Trash}
      onClick={() => deletetoggle(userId, selectedContact.contact_id)}
      style={{ width: "30px", borderRadius: "50px" }}
      alt="Avatar"
    />
  </div>
);


export default ChatHeader;

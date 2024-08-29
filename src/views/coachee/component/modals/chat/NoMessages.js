const NoMessages = ({ profilePic, contactFirstName }) => (
  <>
    <div>
      <img
        src={profilePic || avatar}
        style={{ width: "30px", borderRadius: "50px" }}
        alt="Avatar"
      />
      <h5 style={{ color: "white", margin: "0" }}>{contactFirstName}</h5>
    </div>
    <div style={{ marginTop: "200px", textAlign: "center" }}>
      Messages Not Found for this user
    </div>
  </>
);


export default NoMessages;

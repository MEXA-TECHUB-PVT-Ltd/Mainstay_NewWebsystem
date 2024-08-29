import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "react-feather";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Spinner,
  Row,
  Col,
} from "reactstrap";
import avatar from "@assets/images/avatars/avatar-blank.png";
import Send from "@assets/images/avatars/send.png";
import Trash from "@assets/images/avatars/Trash.png";
import Report from "@assets/images/avatars/report.png";
import Attachicon from "@assets/images/avatars/attachicon.png";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import io from "socket.io-client";
import Loader from "../../utility/Loader";
import "./Scrollbar.css";
import { BASE_URL, SOCKET_URL } from "../../urls/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReportModal from "./component/modals/chat/ReportModal";
import DeleteModal from "./component/modals/chat/DeleteModal";

const socket = io(`${SOCKET_URL}`);

// const userId = 98;
// const receiverId = 113;

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const Chat = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const contact_first_name = params.get("contact_first_name");
  const contact_id = params.get("contact_id");
  const profile_pic = params.get("profile_pic");

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [imageInput, setImageInput] = useState(null); // State to store uploaded image
  const [previewImage, setPreviewImage] = useState(""); // State to store preview image
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  const [showPreview, setShowPreview] = useState(false); // State to show image preview
  const loginUserData = JSON.parse(localStorage.getItem("loginUserData"));
  const userId = loginUserData?.user
    ? parseInt(loginUserData.user.id)
    : parseInt(loginUserData?.id);

  const fetchMessages = (receiverId) => {
    const targetReceiverId = selectedContact?.contact_id
      ? selectedContact?.contact_id
      : receiverId;
    if (targetReceiverId) {
      socket.emit("fetch messages", {
        senderid: userId,
        receiverid: targetReceiverId,
      });
    }
  };

  const fetchContacts = () => {
    socket.emit("fetch contacts", { userId });
  };

  const uploadImageToCloudinary = async () => {
    setLoading(true); // Set loading to true when upload starts
    const formData = new FormData();
    formData.append("file", imageInput);
    formData.append("upload_preset", "m1lpfutg");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dbx8adecl/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setLoading(false); // Clear loading when upload is finished
      return data.secure_url;
    } catch (error) {
      setLoading(false); // Clear loading on error
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

  const sendMessage = async () => {
    if (messageInput.trim() !== "" || imageInput) {
      let imageUrl = null;
      if (imageInput) {
        imageUrl = await uploadImageToCloudinary();
        if (!imageUrl) {
          console.error("Failed to upload image to Cloudinary");
          return;
        }
      }

      try {
        // if (contact_id) {
        const data = {
          senderid: userId,
          receiverid: selectedContact?.contact_id
            ? selectedContact?.contact_id
            : contact_id,
          message: messageInput,
          image: imageUrl, // Include the image URL in the message data
        };

        socket.emit("chat message", data);
        setMessageInput("");
        setImageInput(null);
        setPreviewImage("");
        setShowPreview(false); // Hide image preview after sending
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 100);
        // } else {
        //   const data = {
        //     senderid: userId,
        //     receiverid: selectedContact?.contact_id,
        //     message: messageInput,
        //     image: imageUrl, // Include the image URL in the message data
        //   };

        //   socket.emit("chat message", data);
        //   setMessageInput("");
        //   setImageInput(null);
        //   setPreviewImage("");
        //   setShowPreview(false); // Hide image preview after sending
        //   setTimeout(() => {
        //     messagesEndRef.current?.scrollIntoView({
        //       behavior: "smooth",
        //       block: "end",
        //     });
        //   }, 100);
        // }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImageInput(file);
      setShowPreview(true); // Show image preview after selecting
    }
  };

  const handleContactSelection = (contact) => {
    console.log(contact);
    setSelectedContact(contact);
    fetchMessages(contact.contact_id);
  };

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const reportuser = async () => {
    setLoading(true);
    setTimeout(async () => {
      var Data = {
        sender_id: userId,
        receiver_id: selectedContact.contact_id,
      };
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      await fetch(`${BASE_URL}users/report/user`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);

          if (response.success) {
            setLoading(false);
            setModal(false);
            setTimeout(async () => {
              console.log(response.message);

              const type = "success";

              toast(response.message, {
                type,
              });
            }, 1000);
          } else {
            setLoading(false);
            setModal(false);
            setTimeout(async () => {
              console.log(response.message);

              const type = "error";

              toast(response.message, {
                type,
              });
            }, 1000);
          }
        })
        .catch((error) => {
          setLoading(false);
          alert(error);
        });
    }, 1000);
  };

  const [deletmodal, setDeleteModal] = useState(false);
  const [senderID, setSenderID] = useState("");
  const [receiverID, setReceiverID] = useState("");

  const deletetoggle = (senderid, receiverid) => {
    setSenderID(senderid);
    setReceiverID(receiverid);

    setDeleteModal(!deletmodal);
  };

  const deleteMessages = () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      setDeleteModal(false);

      setTimeout(async () => {
        socket.emit("delete messages", {
          senderid: senderID,
          receiverid: receiverID,
        });

        const text = "Chat Deleted";
        const type = "success";

        toast(text, {
          type,
        });

        fetchMessages();
        fetchContacts();
      }, 1000);
    }, 2000);
  };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loader for 3 seconds
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Clear the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

  // const [userId, setUserId] = useState(null);

  useEffect(() => {
    // fetchUserId();
    fetchMessages();
    fetchContacts();

    socket.on("messages", (fetchedMessages) => {
      setMessages(fetchedMessages);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    socket.on("chat message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      fetchContacts();
    });

    socket.on("contacts", (fetchedContacts) => {
      console.log("fetchedContacts: ", fetchedContacts);
      setContacts(fetchedContacts);
      if (!selectedContact && fetchedContacts.length > 0) {
        if (contact_first_name) {
          const relevantContact = fetchedContacts.find(
            (contact) => contact.contact_id === contact_id
          );
          setSelectedContact(relevantContact);
          fetchMessages(relevantContact.contact_id);
        } else {
          fetchedContacts[0];
        }
      }
    });

    // Return a cleanup function to ensure no memory leaks and multiple listeners
    return () => {
      socket.off("messages");
      socket.off("chat message");
      socket.off("contacts");
    };
  }, []); // Empty dependency array means this runs only once on component mount

  console.log("Contacts: ", contacts);

  const fetchUserId = async () => {
    if (userId) {
      // setUserId(parseInt(userId)); // Set userId state if loginUserData is available
    } else {
      console.error("User ID not found in local storage");
    }
  };

  return (
    <>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", height: "100%" }}>
            {/* Left panel */}
            <div
              style={{
                overflowY: "auto",
                maxHeight: "80vh",
                width: "35%",
                borderRight: "1px solid #ccc",
                padding: "0px",
              }}
            >
              {/* Contact list */}
              <div style={{ display: "flex" }}>
                <div>
                  <ChevronLeft
                    style={{ marginTop: "10px", cursor: "pointer" }}
                    size={20}
                    onClick={() => navigate(-1)}
                  />
                </div>
                <div style={{ width: "100%" }}>
                  {contacts.map((contact) => (
                    <div
                      style={{
                        cursor: "pointer",
                        height: "8vh",
                        borderRadius: "5px",
                        backgroundColor:
                          selectedContact &&
                          selectedContact.contact_id === contact.contact_id
                            ? "#e2e2e2"
                            : "transparent",
                        marginBottom: "5px",
                        padding: "5px",
                      }}
                      key={contact.id}
                      onClick={() => handleContactSelection(contact)}
                    >
                      <div
                        style={{
                          paddingTop: "5px",
                          display: "flex",
                          alignItems: "left",
                        }}
                      >
                        {contact.profile_pic == null || undefined ? (
                          <img
                            src={avatar}
                            style={{ width: "30px", borderRadius: "50px" }}
                            alt="Avatar"
                          />
                        ) : (
                          <img
                            src={contact.profile_pic}
                            style={{ width: "30px", borderRadius: "50px" }}
                            alt="Avatar"
                          />
                        )}
                        {/* <Row>
                                                    <Col xs="5"> */}
                        <h6
                          style={{
                            fontSize: "12px",
                            margin: "0",
                            marginLeft: "10px",
                          }}
                        >
                          {contact.contact_first_name}{" "}
                        </h6>
                        {/* </Col>

                                                    <Col xs="7"> */}
                        <div style={{ marginLeft: "20px", marginTop: "-3px" }}>
                          <p style={{ fontSize: "11px" }}>
                            {formatTimestamp(contact.last_message_timestamp)}
                          </p>
                        </div>
                        {/* </Col>
                                                </Row> */}
                      </div>
                      <div
                        style={{
                          marginTop: "-15px",
                          marginLeft: "40px",
                          display: "flex",
                          gap: "20px",
                          fontSize: "11px",
                        }}
                      >
                        <p>{contact.last_message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                &nbsp;&nbsp;
              </div>
            </div>
            &nbsp;&nbsp;
            {/* Right panel */}
            <div
              style={{
                height: "80vh",
                width: "70%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header */}

              {selectedContact && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    height: "8vh",
                    backgroundImage:
                      "linear-gradient(90.46deg, #073F3D 0%, #0F6D6A 100%)",
                    borderRadius: "15px",
                    padding: "10px",
                    backgroundColor: "green",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    {selectedContact.profile_pic == null || undefined ? (
                      <img
                        src={avatar}
                        style={{ width: "30px", borderRadius: "50px" }}
                        alt="Avatar"
                      />
                    ) : (
                      <img
                        src={selectedContact.profile_pic}
                        style={{ width: "30px", borderRadius: "50px" }}
                        alt="Avatar"
                      />
                    )}
                    <div
                      style={{ marginTop: "4px", width: "calc(100% - 80px)" }}
                    >
                      <h5 style={{ color: "white", margin: "0" }}>
                        {selectedContact.contact_first_name}{" "}
                        {selectedContact.contact_last_name}
                      </h5>
                    </div>
                    {/* Add your icon here */}
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        fontSize: "24px",
                        color: "white",
                      }}
                    >
                      <img
                        src={Report}
                        onClick={toggle}
                        style={{
                          cursor: "pointer",
                          width: "30px",
                          borderRadius: "50px",
                        }}
                        alt="Avatar"
                      />
                      <img
                        src={Trash}
                        onClick={() =>
                          deletetoggle(userId, selectedContact.contact_id)
                        }
                        style={{ width: "30px", borderRadius: "50px" }}
                        alt="Avatar"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Message display area */}
              <div
                style={{
                  overflowX: "auto",
                  flex: "1",
                  maxHeight: "65vh",
                  padding: "15px",
                }}
              >
                {messages.length == 0 || messages == null || undefined ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        height: "8vh",
                        backgroundImage:
                          "linear-gradient(90.46deg, #073F3D 0%, #0F6D6A 100%)",
                        borderRadius: "15px",
                        padding: "10px",
                        backgroundColor: "green",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        {profile_pic == null || undefined ? (
                          <img
                            src={avatar}
                            style={{ width: "30px", borderRadius: "50px" }}
                            alt="Avatar"
                          />
                        ) : (
                          <img
                            src={profile_pic}
                            style={{ width: "30px", borderRadius: "50px" }}
                            alt="Avatar"
                          />
                        )}
                        <div
                          style={{
                            marginTop: "4px",
                            width: "calc(100% - 80px)",
                          }}
                        >
                          <h5 style={{ color: "white", margin: "0" }}>
                            {contact_first_name}{" "}
                          </h5>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: "200px", textAlign: "center" }}>
                      {t("Messages Not Found for this user")}
                    </div>
                  </>
                ) : (
                  <>
                    {messages.map((data, index) => (
                      <div
                        key={index}
                        style={{
                          textAlign:
                            data.senderid === userId ? "right" : "left",
                          backgroundColor:
                            data.senderid === userId ? "#DCEBEB" : "#E4E4E4D4",
                          color:
                            data.senderid === userId ? "#0F6D6A" : "#383737",
                          marginBottom: "10px",
                          maxWidth: "40%", // Adjust the maximum width as needed
                          borderRadius:
                            data.senderid === userId
                              ? "10px 0 10px 10px"
                              : "0 10px 10px 10px",
                          padding: "10px",
                          wordWrap: "break-word",
                          marginLeft: data.senderid === userId ? "auto" : "0",
                          marginRight: data.senderid !== userId ? "auto" : "0",
                        }}
                      >
                        {data.image == null || undefined ? (
                          <> {data.message}</>
                        ) : (
                          <>
                            <div
                              style={{
                                display: "flex",
                                alignContent: "center",
                                justifyContent: "center",
                              }}
                            >
                              {data.image && (
                                <img
                                  src={data.image}
                                  alt="Sent"
                                  style={{ maxWidth: "100px" }}
                                />
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
                {/* <div ref={messagesEndRef} /> */}
              </div>
              {/* Message input area */}
              <div
                style={{
                  gap: "10px",
                  display: "flex",
                  position: "fixed",
                  bottom: "0",
                  width: "100%",
                  padding: "10px",
                }}
              >
                <div style={{ width: "47%", display: "flex", gap: "10px" }}>
                  {/* Image input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                    id="imageInput"
                  />
                  <label htmlFor="imageInput">
                    <div
                      style={{
                        backgroundColor: "#f2f2f2",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={Attachicon}
                        alt="send"
                        style={{ width: "40px" }}
                      />
                    </div>
                  </label>
                  {/* Image preview */}
                  {showPreview && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  {/* Message input */}
                  <Input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                      width: "100%",
                      borderRadius: "50px",
                      borderColor: "#ced4da",
                      boxShadow: "none",
                    }}
                    placeholder={t("Send Message...")}
                  />
                </div>
                {/* Send message button */}

                {loading ? (
                  <Button color="primary" disabled>
                    <Spinner size="sm" />
                  </Button>
                ) : (
                  <img
                    src={Send}
                    alt="send"
                    style={{ width: "40px", cursor: "pointer" }}
                    onClick={sendMessage}
                  />
                )}

                {/* <img src={Send} alt="send" style={{ width: "40px", cursor: "pointer" }} onClick={sendMessage} /> */}
              </div>
            </div>
          </div>
          {/* /modal */}
          <ReportModal
            modal={modal}
            toggle={toggle}
            loading={loading}
            reportuser={reportuser}
          />
          <DeleteModal
            modal={deletmodal}
            toggle={deletetoggle}
            loading={loading}
            deleteMessages={deleteMessages}
          />
          {/* <ToastContainer position="top-center" /> */}
        </>
      )}
    </>
  );
};

export default Chat;

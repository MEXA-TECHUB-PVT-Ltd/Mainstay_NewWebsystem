import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import io from "socket.io-client";
import Sidebar from "./Sidebar";
import MessageList from "./MessageList";
import axios from "axios";
import TopHeader from "./components/TopHeader";
import InputChat from "./components/InputChat";
import useWindowSize from "../../utility/hooks/useWindowSize";
import { Card, Col, Container, Row } from "reactstrap";
import { SOCKET_URL } from "../../urls/api";
import { ToastContainer } from "react-toastify";

let socket;

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchParams] = useSearchParams();
  const [contacts, setContacts] = useState([]);
  const [imageInput, setImageInput] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [reRender, setReRender] = useState(false);

  const [width, height] = useWindowSize();

  const localUser =
    JSON.parse(localStorage.getItem("loginUserData")) || undefined;
  console.log(localUser);

  // const userId = searchParams.get("userId");
  const userId = localUser?.user ? localUser?.user?.id : localUser?.id;
  const first_name = searchParams.get("first_name");
  const last_name = searchParams.get("last_name");
  const profile_pic = searchParams.get("profile_pic");
  const initialReceiverId = searchParams.get("receiverId");
  const [receiverId, setReceiverId] = useState(initialReceiverId);
  const [initialData, setInitialData] = useState({
    name: first_name + " " + last_name,
    image: profile_pic,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageInput(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null); // Clear the preview if the file is not an image
    }
  };

  const fetchContacts = async () => {
    setContactLoading(false);
    try {
      const response = await axios.get(`${SOCKET_URL}contacts/${userId}`);
      setContacts(response.data);
      console.log(response);
      if (!initialReceiverId) {
        setReceiverId(response?.data[0]?.id);
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setContactLoading(false);
    }
  };
  useEffect(() => {
    fetchContacts();
  }, [userId]);

  useEffect(() => {
    socket = io(SOCKET_URL, {
      query: { userId },
      autoConnect: false,
    });
    socket.connect();
    socket.on("receive_message", (receivedMessage) => {
      console.log("Received new message:", receivedMessage);
      fetchContacts();
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });
    socket.on("unread_count", (newUnreadCount) => {
      console.log("newUnreadCount", newUnreadCount);
      setUnreadCount(newUnreadCount);
    });

    return () => {
      socket.off("receive_message");
      socket.off("unread_count");
      socket.disconnect();
    };
  }, [userId]);

  console.log("newUnreadCount", unreadCount);

  const updateContactList = (newMessage) => {
    setContacts((prevContacts) => {
      const newContacts = [...prevContacts];
      const contactIndex = newContacts.findIndex(
        (contact) => contact.id === newMessage.receiver_id
      );
      if (contactIndex > -1) {
        const updatedContact = {
          ...newContacts[contactIndex],
          last_online: new Date().toISOString(),
        }; // Assuming last_online is updated
        newContacts.splice(contactIndex, 1); // Remove the contact from current position
        newContacts.unshift(updatedContact); // Add the contact at the top
      }
      return newContacts;
    });
  };

  const sendMessage = async () => {
    if (!message && !imageInput) {
      return;
    }
    setLoading(true);
    if (receiverId) {
      let imageUrl = ""; // Default to an empty string if no image is uploaded

      // Check if there's an image to upload
      if (imageInput) {
        const formData = new FormData();
        formData.append("image", imageInput);

        try {
          const uploadResponse = await axios.post(
            `${SOCKET_URL}upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          imageUrl = uploadResponse.data.imageUrl;
        } catch (error) {
          console.error("Failed to upload image:", error);
        }
      }

      const msgData = {
        sender_id: userId,
        receiver_id: receiverId,
        message: message,
        image_url: imageUrl,
      };

      socket.emit("send_message", msgData);
      setMessages((prevMessages) => [...prevMessages, msgData]);
      updateContactList(msgData); // Update contacts list to reflect the new message
      setMessage("");
      setImagePreview(null);
      setImageInput(null);
      fetchContacts();
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(false);
    if (receiverId && userId) {
      try {
        const response = await axios.get(
          `${SOCKET_URL}messages/${userId}/${receiverId}`
        );
        setMessages(response.data.messages.reverse());
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setMessagesLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [userId, receiverId]);
  useEffect(() => {
    if (reRender) {
      fetchContacts();
    }
  }, [reRender]);

  const handleSelectContact = (contact) => {
    console.log("Selected contact:", contact.id, userId, unreadCount, contact);
    setReRender(true);
    if (contact.unread_count > 0) {
      fetchContacts();
    }
    setReceiverId(contact.id);
    setUnreadCount(0);
    if (userId && contact.id) {
      socket.emit("mark_messages_as_read", { userId, receiverId: contact.id });
    }
  };

  const findReceiver = contacts?.find((user) => user.id === receiverId);

  // Ensure socket listeners handle updates properly
  useEffect(() => {
    const updateUnreadCount = (newUnreadCount) => {
      setUnreadCount(newUnreadCount);
    };

    socket.on("unread_count", updateUnreadCount);

    return () => {
      socket.off("unread_count", updateUnreadCount);
    };
  }, [socket]);

  return (
    <>
      {contactLoading ? (
        <p> loading....</p>
      ) : (
        <>
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <Row>
              <Col md="3">
                <Sidebar
                  contacts={contacts}
                  onSelectContact={handleSelectContact}
                  receiverId={receiverId}
                  count={unreadCount}
                  messages={messages}
                  width={width}
                />
              </Col>
              <Col md="9" style={{ display: "flex", flexDirection: "column" }}>
                <TopHeader
                  findReceiver={findReceiver}
                  initialData={initialData}
                  receiverId={receiverId}
                  senderId={userId}
                  fetchMessages={fetchMessages}
                />
                <MessageList messages={messages} userId={userId} />
                <InputChat
                  message={message}
                  setMessage={setMessage}
                  sendMessage={sendMessage}
                  handleFileChange={handleFileChange}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                  setImageInput={setImageInput}
                  loading={loading}
                />
              </Col>
            </Row>
          </div>
        </>
      )}

      {/* <ToastContainer position="top-center" newestOnTop /> */}
    </>
  );
}

export default ChatComponent;

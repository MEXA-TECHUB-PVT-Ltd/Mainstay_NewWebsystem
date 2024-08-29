import { NavLink } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import io from "socket.io-client";
import { Badge } from "reactstrap";
import { Bell, Power } from "react-feather"; // Importing the Bell icon from react-feather
import axios from "axios";
import { SOCKET_URL, BASE_URL, authGet } from "../../../../../urls/api";
import { ToastContainer, toast } from "react-toastify";
import SuccessModal from "../../../../../views/coachee/component/SuccessModal";

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

const VerticalNavMenuLink = ({ item, activeItem }) => {
  const LinkTag = item.externalLink ? "a" : NavLink;
  const user = JSON.parse(localStorage.getItem("loginUserData")) || undefined;
  const role = user?.user ? user?.user?.role : user?.role;
  const userId = user?.user ? user?.user?.id : user?.id;
  console.log("ROLE", role);
  const { t } = useTranslation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userId) {
      const fetchCount = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5019/get-unread-count/${userId}`
          );
          const data = response?.data;
          console.log(data);
          setUnreadCount(data?.count);
        } catch (error) {
          console.log("Unread message count error", error);
        }
      };
      fetchCount();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      socket.io.opts.query = { userId }; // Update the query with the userId
      socket.connect(); // Manually connect if autoConnect is false

      console.log("Connected to socket");
    }

    socket.on("unread_count", (count) => {
      setUnreadCount(count);
    });

    socket.on("mark_messages_as_read", (data) => {
      console.log("MARKED", data);
      fetchCount();
    });

    // socket.on("coach-start-session", (socketData) => {
    //   console.log("Socket: ", socketData);
    //   if (socketData.coachStarted) {
    //     console.log("Coach has started the session");
    //     toast.success(`Coach has started the session`);
    //   }
    // });

    socket.on("session request", (data) => {
      console.log("New session request received:", data);
      // You can update your UI here to show the new session request
      alert("New session request received");
    });

    // Clean up the socket listeners and disconnect on unmount or userId change
    return () => {
      socket.off("unread_count");
      socket.off("mark_messages_as_read");
      // socket.off("coach-start-session");
      socket.off("session request");
      socket.disconnect();
    };
  }, [userId]);

  // async function checkForSessionNotifications() {
  //   const response = await fetch(`${BASE_URL}notification-request`);
  //   const notificationRequest = await response.json();
  //   if (notificationRequest?.result) {
  //     console.log("New Notification:", notificationRequest?.result.title);
  //     if (role === "coach") {
  //       toast.success(
  //         `You have a new session request from ${notificationRequest?.result?.first_name} ${notificationRequest?.result?.last_name}`
  //       );
  //     }
  //     await fetch(
  //       `${BASE_URL}notification-request/${notificationRequest?.result.id}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );
  //   }
  // }

  // async function checkForAcceptedNotifications() {
  //   console.log("ROLE", role);
  //   if (role === "coachee") {
  //     const response = await fetch(`${BASE_URL}notification-request-accepted`);
  //     const notificationRequest = await response.json();
  //     if (notificationRequest?.result) {
  //       console.log("New Notification:", notificationRequest?.result, role);
  //       console.log("Accepted");
  //       // alert("hello")
  //       toast.success(
  //         `Your session request has been accepted by ${notificationRequest?.result?.first_name} ${notificationRequest?.result?.last_name}`
  //       );
  //       // await fetch(
  //       //   `${BASE_URL}notification-request-accepted/${notificationRequest?.result.id}`,
  //       //   {
  //       //     method: "DELETE",
  //       //   }
  //       // );
  //     }
  //   }
  // }

  // async function checkForRatingNotifications() {
  //   const response = await fetch(`${BASE_URL}notification-request-rating`);
  //   const notificationRequest = await response.json();
  //   if (notificationRequest?.result) {
  //     console.log("New Notification:", notificationRequest?.result, role);
  //     if (role === "coach") {
  //       console.log("hello coach");
  //       toast.success(
  //         `You have got a new review from ${notificationRequest?.result?.first_name} ${notificationRequest?.result?.last_name}`
  //       );
  //     }
  //     await fetch(
  //       `${BASE_URL}notification-request-rating/${notificationRequest?.result.id}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );
  //   }
  // }

  // async function checkForPaymentNotifications() {
  //   const response = await fetch(`${BASE_URL}notification-request-payment`);
  //   const notificationRequest = await response.json();
  //   if (notificationRequest?.result) {
  //     console.log("New Notification:", notificationRequest?.result, role);
  //     if (role === "coach") {
  //       console.log("hello coach");
  //       toast.success(
  //         `You have got a new payment from ${notificationRequest?.result?.first_name} ${notificationRequest?.result?.last_name}`
  //       );
  //     }
  //     await fetch(
  //       `${BASE_URL}notification-request-payment/${notificationRequest?.result.id}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );
  //   }
  // }

  // Set intervals for each notification check
  // setInterval(checkForSessionNotifications, 40000);
  // setInterval(checkForAcceptedNotifications, 40000);
  // setInterval(checkForRatingNotifications, 40000);

  // const fetchBadges = async () => {
  //   try {
  //     const response = await authGet(`rating/getCoachBadges/${userId}`);
  //     if (response.success) {
  //       console.log(response);
  //       const { average_rating, total_ratings } = response.resultRating;
  //       const average = parseFloat(average_rating);
  //       const count = parseInt(total_ratings, 10);

  //       let badgeName;
  //       if (count === 50 && average >= 4) {
  //         badgeName = "Platinum";
  //       } else if (count === 25 && average >= 4) {
  //         badgeName = "Gold";
  //       } else if (count === 15 && average >= 4) {
  //         badgeName = "Silver";
  //       } else if (count === 5 && average >= 4) {
  //         badgeName = "Bronze";
  //       } else {
  //         badgeName = null; // Or handle no badge scenario
  //       }

  //       console.log(badgeName);

  //       if (badgeName) {
  //         toast.success(
  //           `Congratulation You have received new Badge. ${badgeName}`
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   if (userId && role === "coach") {
  //     fetchBadges();
  //   }
  // }, [userId]);

  return (
    <>
      <li
        className={classnames({
          "nav-item": !item.children,
          disabled: item.disabled,
          active: item.navLink === activeItem,
        })}
      >
        <LinkTag
          className="d-flex align-items-center"
          target={item.newTab ? "_blank" : undefined}
          {...(item.externalLink
            ? { href: item.navLink || "/" }
            : {
                to: item.navLink || "/",
                className: ({ isActive }) =>
                  isActive && !item.disabled
                    ? "d-flex align-items-center active"
                    : "",
              })}
          onClick={(e) => {
            if (
              item.navLink.length === 0 ||
              item.navLink === "#" ||
              item.disabled
            ) {
              e.preventDefault();
            }
          }}
          style={{ width: "100%" }} // Ensure the link tag takes full width of its parent
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            {item.icon}
            <span
              className="menu-item text-truncate"
              style={{ marginLeft: "8px", color: "#FFFFFF", flexGrow: 1 }}
            >
              {t(item.title)}
              {item.title === "Chats" && unreadCount > 0 && (
                <span
                  style={{
                    height: "8px",
                    width: "8px",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginLeft: "65px",
                    // position: "relative",
                    // top: "-2px",
                  }}
                />
              )}
            </span>
          </div>
          {item.badge && item.badgeText ? (
            <Badge className="ms-auto me-1" color={item.badge} pill>
              {item.badgeText}
            </Badge>
          ) : null}
        </LinkTag>
      </li>

      {/* 
      <SuccessModal
        isOpen={isSuccessOpen}
        toggle={handleCloseSuccess}
        title="Badge Received"
        text={`You have received a new Badge`}
      /> */}

      {/* {isModalOpen && (
        <NotificationModal
          isOpen={isModalOpen}
          toggle={handleCloseModal}
          title={modalContent?.title}
          content={modalContent?.content}
        />
      )} */}
    </>
  );
};

export default VerticalNavMenuLink;

import React, { Suspense, useCallback, useEffect } from "react";

// ** Router Import
import Router from "./router/Router";

import "./styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure CSS is imported
import { BASE_URL, SOCKET_URL, authGet } from "./urls/api";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

const App = () => {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("loginUserData")) || undefined;
  const role = user?.user ? user?.user?.role : user?.role;
  const userId = user?.user ? user?.user?.id : user?.id;

  useEffect(() => {
    if (userId) {
      socket.io.opts.query = { userId }; // Update the query with the userId
      socket.connect(); // Manually connect if autoConnect is false

      console.log("Connected to socket");
    }

    socket.on("coach-start-session", (socketData) => {
      console.log("Socket: ", socketData);
      if (socketData.coachStarted) {
        console.log("Coach has started the session");
        toast.success(t(`Coach has started the session`));
      }
    });
    // Listen for notification creation events
    socket.on("notification_created", (notification) => {
      console.log("New notification created:", notification);
      // Update the UI or notify the user
    });

    // Listen for notification update events
    socket.on("notification_updated", (notifications) => {
      console.log("Notifications updated:", notifications);
      // Update the UI or notify the user
    });

    // Clean up the socket listeners and disconnect on unmount or userId change
    return () => {
      socket.off("coach-start-session");
      socket.off("notification_created");
      socket.off("notification_updated");
      socket.disconnect();
    };
  }, [userId]);

  const getCoins = useCallback(async () => {
    if (role === "coachee") {
      try {
        const response = await authGet("rating/getCoacheeWellCoins");
        const newCoins = response?.overallTotalCoins;
        if (["30", "60", "100", "300"].includes(newCoins)) {
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [role]);

  useEffect(() => {
    if (role === "coachee") {
      getCoins();
    }
  }, [role]);

  const fetchBadges = async () => {
    try {
      const response = await authGet(`rating/getCoachBadges/${userId}`);
      if (response.success) {
        console.log(response);
        const { average_rating, total_ratings } = response.resultRating;
        const average = parseFloat(average_rating);
        const count = parseInt(total_ratings, 10);

        let badgeName;
        if (count === 50 && average >= 4) {
          badgeName = "Platinum";
        } else if (count === 25 && average >= 4) {
          badgeName = "Gold";
        } else if (count === 15 && average >= 4) {
          badgeName = "Silver";
        } else if (count === 5 && average >= 4) {
          badgeName = "Bronze";
        } else {
          badgeName = null; // Or handle no badge scenario
        }

        console.log(badgeName);

        if (badgeName) {
          toast.success(
            `${t("Congratulation You have received new Badge.")} ${badgeName}`
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId && role === "coach") {
      fetchBadges();
    }
  }, [userId]);

  async function checkForSessionNotifications() {
    const response = await fetch(`${BASE_URL}notification-request`);
    const notificationRequest = await response.json();
    if (notificationRequest?.result) {
      console.log("New Notification:", notificationRequest?.result.title);
      if (role === "coach") {
        toast.success(
          `${t("You have a new session request from")} ${
            notificationRequest?.result?.first_name
          } ${notificationRequest?.result?.last_name}`
        );
      }
      await fetch(
        `${BASE_URL}notification-request/${notificationRequest?.result.id}`,
        {
          method: "DELETE",
        }
      );
    }
  }

  async function checkForNotificationsAccepted() {
    const response = await fetch(`${BASE_URL}notification-request-accepted`);
    const notificationRequest = await response.json();
    if (notificationRequest?.result) {
      console.log("New Notification:", notificationRequest?.result, role);
      if (role !== "coach") {
        toast.success(
          `${t("Your session request has been accepted by")} ${
            notificationRequest?.result?.first_name
          } ${notificationRequest?.result?.last_name}`,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
      await fetch(
        `${BASE_URL}notification-request-accepted/${notificationRequest?.result.id}`,
        {
          method: "DELETE",
        }
      );
    }
  }

  async function checkForPaymentNotifications() {
    const response = await fetch(`${BASE_URL}notification-request-payment`);
    const notificationRequest = await response.json();
    if (notificationRequest?.result) {
      console.log("New Notification:", notificationRequest?.result, role);
      if (role === "coach") {
        console.log("hello coach");
        toast.success(
          `${t("You have got a new payment from")} ${
            notificationRequest?.result?.first_name
          } ${notificationRequest?.result?.last_name}`
        );
      }
      await fetch(
        `${BASE_URL}notification-request-payment/${notificationRequest?.result.id}`,
        {
          method: "DELETE",
        }
      );
    }
  }

  async function checkForRatingNotifications() {
    const response = await fetch(`${BASE_URL}notification-request-rating`);
    const notificationRequest = await response.json();
    if (notificationRequest?.result) {
      if (role === "coach") {
        console.log("hello coach");
        toast.success(
          `${t("You have got a new review from")} ${
            notificationRequest?.result?.first_name
          } ${notificationRequest?.result?.last_name}`
        );
      }
      await fetch(
        `${BASE_URL}notification-request-rating/${notificationRequest?.result.id}`,
        {
          method: "DELETE",
        }
      );
    }
  }

  useEffect(() => {
    const sessionInterval = setInterval(checkForSessionNotifications, 5000);
    const notificationsAcceptedInterval = setInterval(
      checkForNotificationsAccepted,
      20000
    );
    const paymentNotificationsInterval = setInterval(
      checkForPaymentNotifications,
      20000
    );
    const ratingNotificationsInterval = setInterval(
      checkForRatingNotifications,
      20000
    );

    return () => {
      clearInterval(sessionInterval);
      clearInterval(notificationsAcceptedInterval);
      clearInterval(paymentNotificationsInterval);
      clearInterval(ratingNotificationsInterval);
    };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Router />
      </Suspense>
      <ToastContainer
        position="top-center"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default App;

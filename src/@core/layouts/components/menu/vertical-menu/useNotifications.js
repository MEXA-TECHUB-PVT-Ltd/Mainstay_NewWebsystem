import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../../../urls/api";
import { debounce } from "lodash";

const useNotifications = (userId, role) => {
  const [notifications, setNotifications] = useState([]);
  const [alertedNotifications, setAlertedNotifications] = useState(
    new Set(JSON.parse(localStorage.getItem("alertedNotifications") || "[]"))
  );
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalContent = useCallback(
    debounce((content) => {
      setModalContent(content);
      setIsModalOpen(true);
    }, 300),
    []
  );

  const clearModal = () => {
    setModalContent(null);
    setIsModalOpen(false);
  };

  const fetchData = useCallback(async () => {
    if (!userId) return;

    try {
      const url = `${BASE_URL}notifications/getAll?${role}_id=${userId}&is_read=false`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const newNotifications = data.result.filter(
        (notification) => !alertedNotifications.has(notification.id)
      );

      setNotifications(newNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [userId, role, alertedNotifications]);

  useEffect(() => {
    const intervalId = setInterval(fetchData, 20000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  useEffect(() => {
    notifications.forEach((notification) => {
      if (
        [
          "SESSION_REQUEST",
          "SESSION_STARTED",
          "PAYMENT_SUCCESSFUL",
          "WELL_COINS_RECEIVED",
        ].includes(notification.title)
      ) {
        toast.info(`${t("Notification:")} ${notification.content}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        handleModalContent({
          title: notification.title,
          content: notification.content,
        });
      }
      setAlertedNotifications((prev) => {
        const updated = new Set(prev);
        updated.add(notification.id);
        localStorage.setItem(
          "alertedNotifications",
          JSON.stringify([...updated])
        );
        return updated;
      });
    });
  }, [notifications, handleModalContent]);

  return {
    notifications,
    modalContent,
    isModalOpen,
    clearModal,
    alertedNotifications,
  };
};

export default useNotifications;

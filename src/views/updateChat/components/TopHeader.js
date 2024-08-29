import React, { useState } from "react";
import trash from "@assets/images/avatars/Trash.png";
import report from "@assets/images/avatars/report.png";
import DeleteChat from "./DeleteChat";
import axios from "axios";
import { BASE_URL, SOCKET_URL } from "../../../urls/api";
import moment from "moment";
import { toast } from "react-toastify";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const TopHeader = ({
  findReceiver,
  initialData,
  receiverId,
  senderId,
  // fetchContacts,
  fetchMessages,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [error, setError] = useState("");
  const reasons = [
    t("Scam"),
    t("Fake Profile"),
    t("Inappropriate Picture"),
    t("Bad behavior"),
    t("Underage"),
    t("Other"),
  ];
  // const receiverId = findReceiver ? findReceiver.id : initialData?.id;
  const userData = JSON.parse(localStorage.getItem("loginUserData")) || {};
  const accessToken = userData?.accessToken;

  const toggleDelete = () => {
    setIsDeleteOpen(!isDeleteOpen);
  };

  const toggleReport = () => {
    setIsReportOpen(!isReportOpen);
  };
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${SOCKET_URL}delete/${senderId}/${receiverId}`
      );
      toast.success(t("Chat deleted successfully!"));
      toggleDelete();
      // fetchContacts();
      fetchMessages();
      setLoading(false);
    } catch (error) {
      console.log("Error while deleting chat", error);
    }
  };
  const handleReport = async () => {
    if (!selectedReason) {
      console.log("Please select a reason");
      setError("Please select a reason");
    } else {
      setError("");
      setLoading(true);
      try {
        const response = await axios.post(
          `${BASE_URL}users/report`,
          {
            reported: receiverId,
            reported_by: senderId,
            reason: selectedReason,
          },
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
        toast.success(t("Report submit successfully!"));
        toggleReport();
        setLoading(false);
      } catch (error) {
        console.log("Error while reporting user", error);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "10px",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid #ccc",
        position: "fixed",
        top: 70,
        left: "38%",
        right: 20,
        backgroundColor: "#073F3D",
        margin: "10px",
        borderRadius: "15px",
      }}
    >
      <div className="d-flex gap-1 align-items-center">
        <img
          src={findReceiver?.profile_pic || initialData?.image}
          alt={findReceiver?.first_name}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginRight: "15px",
          }}
        />
        <div>
          <h5 style={{ color: "#FFFF" }}>
            {findReceiver
              ? findReceiver?.first_name + " " + findReceiver?.last_name
              : initialData?.name}
          </h5>
          {findReceiver?.is_online ? (
            <span style={{ color: "#FFFF" }}> {t("Active now")} </span>
          ) : (
            <>
              {/* {findReceiver?.last_online ? (
                <span style={{ color: "#FFF9" }}>
                  Last seen: {' '}
                  {moment(findReceiver?.last_online).format(
                    "MMMM DD YYYY, h:mm a"
                  )}
                </span>
              ) : (
                ""
              )} */}
            </>
          )}
        </div>
      </div>
      <div>
        <img
          src={report || "default-avatar.png"}
          alt={findReceiver?.first_name}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            marginRight: "15px",
            cursor: "pointer",
          }}
          onClick={toggleReport}
        />
        <img
          src={trash || "default-avatar.png"}
          alt={findReceiver?.first_name}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            marginRight: "15px",
            cursor: "pointer",
          }}
          onClick={toggleDelete}
        />
      </div>
      <DeleteChat
        isOpen={isDeleteOpen}
        toggle={toggleDelete}
        title={t("Delete Chat")}
        actionText={t("Delete")}
        action={handleDelete}
        loading={loading}
      />
      <DeleteChat
        isOpen={isReportOpen}
        toggle={toggleReport}
        title={t("Report User")}
        actionText={t("Report")}
        action={handleReport}
        loading={loading}
        reasons={reasons}
        selectedReason={selectedReason}
        setSelectedReason={setSelectedReason}
        error={error}
      />
    </div>
  );
};

export default TopHeader;

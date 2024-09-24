import React, { useEffect, useState } from "react";
import { ChevronLeft } from "react-feather";
import { CardBody, Card, Row, Col, Spinner } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import requestIcon from "@assets/images/avatars/request_icon.png";
import requestAccepted from "@assets/images/avatars/request_accepted.png";
import startsIn10Mints from "@assets/images/avatars/starts_in_10_mints.png";
import notificationReview from "@assets/images/avatars/notification_review.png";
import payment from "@assets/images/avatars/payment.png";
import wellcoins from "@assets/images/avatars/wellcoins.png";
import "./Scrollbar.css";
import { BASE_URL } from "../../urls/api";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const Notifications = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [userdetails, setUserdetails] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem("loginUserData"));
  const userLocal = userData?.user || userData;
  const [notifications, setNotifications] = useState([]);

  const updateStatus = async () => {
    try {
      let response;
      if (userLocal?.role === "coach") {
        const response = await fetch(`${BASE_URL}notifications/updateByUser`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coachId: userLocal?.id,
            is_read: true,
          }),
        });
      }
      if (userLocal?.role === "coachee") {
        const response = await fetch(`${BASE_URL}notifications/updateByUser`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coacheeId: userLocal?.id,
            is_read: true,
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setNotifications(jsonData.result);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      let response;
      if (userLocal?.role === "coach") {
        response = await fetch(
          `${BASE_URL}notifications/getAll?coach_id=${userLocal?.id}`
        );
      } else {
        response = await fetch(
          `${BASE_URL}notifications/getAll?coachee_id=${userLocal?.id}`
        );
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setNotifications(jsonData.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    updateStatus();
  }, []);

  useEffect(() => {
    // Show loader for 3 seconds
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Clear the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

  const handleNavigation = (item) => {
    if (userLocal?.role === "coach") {
      if (
        item.title === "SESSION_ACCEPTED" ||
        item.title === "SESSION_REQUEST"
      ) {
        navigate("/coach/coaching?status=SESSION_REQUEST");
      } else if (
        item.title === "SESSION_STARTED" ||
        item.title === "SESSION_REVIEW"
      ) {
        navigate("/coach/coaching?status=SESSION_REVIEW");
      } else if (item.title === "NEW_BADGE") {
        navigate("/coach/my-badge");
      } else {
        navigate("/coach/coaching");
      }
    } else if (userLocal?.role === "coachee") {
      if (item.title === "WELL_COINS_RECEIVED") {
        navigate(`/coachee/badge`);
      } else if (item.title === "PAYMENT_SUCCESSFUL") {
        navigate(
          `/coachee/coach-detail/${item.coach_id}?session=${item.session_id}`
        );
      } else if (item.title === "NEW_BADGE") {
        navigate("/coachee/badge");
      } else {
        navigate(
          `/coachee/coach-detail/${item.coach_id}?session=${item.session_id}`
        );
      }
    }
  };

  const getIcon = (title) => {
    switch (title) {
      case "SESSION_ACCEPTED":
        return requestAccepted;
      case "SESSION_REVIEW":
        return notificationReview;
      case "SESSION_STARTED":
        return startsIn10Mints;
      case "SESSION_ENDED":
        return startsIn10Mints;
      case "SESSION_REQUEST":
        return requestIcon;
      case "SESSION_REMINDER":
        return startsIn10Mints;
      case "PAYMENT_SUCCESSFUL":
        return payment;
      case "WELL_COINS_RECEIVED":
      case "NEW_BADGE":
        return wellcoins;
      default:
        return null;
    }
  };

  const getNotificationMessage = (item) => {
    const nameStyle = {
      color: "#0F6D6A",
      fontWeight: "bold",
    };

    if (userLocal?.role === "coach") {
      switch (item.title) {
        case "SESSION_REQUEST":
          return (
            <span>
              {t("You have a session request from ")}
              <span style={nameStyle}>{item.coachee_full_name}</span>.
            </span>
          );
        case "SESSION_REVIEW":
          return (
            <span>
              {t(" New review received from ")}
              <span style={nameStyle}>{item.coachee_full_name}</span>.{" "}
              {t("Check it out now!")}
            </span>
          );
        case "SESSION_STARTED":
          return (
            <span>
              {t("Your session with ")}
              <span style={nameStyle}>{item.coachee_full_name}</span>{" "}
              {t("is about to start")}
            </span>
          );
        case "PAYMENT_SUCCESSFUL":
          return (
            <span>
              {t("Payment received for session with ")}
              <span style={nameStyle}>{item.coachee_full_name}</span>.
            </span>
          );
        case "NEW_BADGE":
          return t("Congratulations! You have received new badges.");
        default:
          return item.content;
      }
    } else if (userLocal?.role === "coachee") {
      switch (item.title) {
        case "SESSION_REQUEST":
          return (
            <span>
              {t("Your session request has been sent to ")}
              <span style={nameStyle}>{item.coach_full_name}</span>.
            </span>
          );
        case "SESSION_ENDED":
          return (
            <span>
              {t("Kindly rate your session with ")}
              <span style={nameStyle}>{item.coach_full_name}</span>.
            </span>
          );
        case "SESSION_STARTED":
          return (
            <span>
              {t("Your session with ")}
              <span style={nameStyle}>{item.coach_full_name}</span>{" "}
              {t("has started.")}
            </span>
          );
        case "PAYMENT_SUCCESSFUL":
          return (
            <span>
              {t("You have successfully paid for the session with ")}
              <span style={nameStyle}>{item.coach_full_name}</span>.
            </span>
          );
        case "SESSION_ACCEPTED":
          return (
            <span>
              {t("Your session has been accepted by ")}
              <span style={nameStyle}>{item.coach_full_name}</span>.
            </span>
          );
        case "NEW_BADGE":
          return t("Congratulations! You received new badges. Keep going.");
        case "WELL_COINS_RECEIVED":
          return t("Congratulations! You received new wellcoins.");
        default:
          return item.content;
      }
    } else {
      return item.content;
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
          <Row>
            <Col sm="6" md="7" lg="7">
              <div style={{ display: "flex" }}>
                <ChevronLeft
                  style={{ cursor: "pointer" }}
                  size={30}
                  onClick={() => navigate(-1)}
                />
                <h2 className="pb-2">Notifications</h2>
              </div>
            </Col>
          </Row>

          <Card style={{ width: "100%" }}>
            <CardBody
              style={{
                display: "flex",
                alignItems: "start",
                flexDirection: "column",
              }}
            >
              {notifications.length === 0 ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ height: "100vh", width: "100%" }}
                >
                  <p style={{ textAlign: "center" }}>No records found yet</p>
                </div>
              ) : (
                notifications
                  .filter(
                    (item) =>
                      !(
                        userLocal?.role === "coach" &&
                        item.title === "WELL_COINS_RECEIVED"
                      ) &&
                      !(
                        userLocal?.role === "coach" &&
                        item.title === "SESSION_ACCEPTED"
                      ) &&
                      !(
                        userLocal?.role === "coachee" &&
                        item.title === "SESSION_REVIEW"
                      ) &&
                      !(
                        userLocal?.role === "coach" &&
                        item.title === "SESSION_ENDED"
                      )
                  )
                  .map((item, index) => (
                    <React.Fragment key={index}>
                      <Row>
                        <Col xs="12" md="12">
                          <div
                            onClick={() => handleNavigation(item)}
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "start",
                            }}
                          >
                            <img
                              src={getIcon(item.title)}
                              alt="Icon"
                              style={{ width: "50px", height: "50px" }}
                            />
                            <div
                              style={{
                                marginLeft: "15px",
                                marginTop: "7px",
                              }}
                            >
                              <p style={{ fontSize: "13px" }}>
                                {getNotificationMessage(item)}
                              </p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      {index !== notifications.length - 1 && (
                        <Row style={{ width: "100%" }}>
                          <Col>
                            <div
                              style={{
                                marginTop: "5px",
                                marginBottom: "5px",
                                borderTop: "1px solid #e3e1e1",
                                width: "100%",
                              }}
                            ></div>
                          </Col>
                        </Row>
                      )}
                    </React.Fragment>
                  ))
              )}
            </CardBody>
          </Card>
        </>
      )}
    </>
  );
};

export default Notifications;

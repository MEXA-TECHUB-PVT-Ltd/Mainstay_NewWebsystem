// SessionCard.js
import React from "react";
import { Card, CardBody, Col } from "reactstrap";
import Avatar from "@components/avatar";
import { format } from "date-fns";
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import { getBadgeImage } from "../../../utility/badges";
import { useTranslation } from "react-i18next";

const SessionCard = ({ item, onClick }) => {
  const { t } = useTranslation();
  console.log(item);
  console.log(item?.session_info?.session_details?.status);
  return (
    <Col
      lg={3}
      md={4}
      xs={12}
      className="mb-4"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <Card style={{ borderRadius: "15px" }}>
        <CardBody style={{ paddingLeft: "5px" }}>
          <div className="d-flex align-item-center justify-content-between">
            <div
              style={{
                position: "relative",
                display: "inline-block",
              }}
              className="d-flex align-item-center"
            >
              {/* <img
                src={item?.session_info?.coachee_profile_pic || defaultAvatar}
                alt=""
                width={50}
                height={50}
                style={{ borderRadius: "50%"}}
              /> */}
              <div>
                <Avatar
                  img={item?.session_info?.coachee_profile_pic || defaultAvatar}
                  imgHeight="40"
                  imgWidth="40"
                  // status="online"
                />
              </div>
              {item?.session_info?.coachee_badge && (
                <img
                  src={getBadgeImage(item?.session_info?.coachee_badge)}
                  alt="Badge"
                  style={{
                    position: "absolute",
                    right: "-30px",
                    bottom: "10px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "transparent",
                    boxShadow: "unset",
                  }}
                />
              )}
              <div style={{ marginLeft: "10px" }}>
                <h6 style={{ fontSize: "12px", fontWeight: "bold" }}>
                  {item?.session_info?.coachee_name}
                </h6>
                <p style={{ fontSize: "10px" }}>
                  {item?.session_info?.coaching_area_name}
                </p>
              </div>
            </div>
            <div>
              <p
                style={{
                  color: "#fff",
                  padding: "2px",
                  fontSize: "12px",
                  textTransform: "capitalize",
                  backgroundColor:
                    item?.session_info?.session_details?.status === "accepted"
                      ? "#00B549" // accepted status color
                      : item?.session_info?.session_details?.status ===
                        "rejected"
                      ? "#FF463A" // rejected status color
                      : item?.session_info?.session_details?.status ===
                        "completed"
                      ? "#00B549" // complete status color
                      : item?.session_info?.session_details?.status === "paid"
                      ? "#00B549" // paid status color
                      : "#D8AA04", // default color

                  fontWeight: "500",
                  borderRadius: "8px",
                }}
              >
                {t(item?.session_info?.session_details?.status)}
              </p>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <p> {t("Session length")} </p>
            <p
              style={{ color: "#0F6D6A", fontSize: "14px", fontWeight: "bold" }}
            >
              {item?.session_info?.session_details?.duration} {t("mins")}
            </p>
          </div>
          <div className="d-flex justify-content-between">
            <p> {t("Date/Time")} </p>
            <p
              style={{ color: "#0F6D6A", fontSize: "14px", fontWeight: "bold" }}
            >
              {format(
                new Date(item?.session_info?.session_details?.date),
                "dd/MM, "
              ) + item?.session_info?.session_details?.section}
            </p>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default SessionCard;

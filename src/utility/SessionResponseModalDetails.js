import React, { useEffect, useState } from "react";
import { Button, Input, ModalFooter, ModalHeader } from "reactstrap";
import Avatar from "@components/avatar";
import { MessageCircle, Star } from "react-feather";
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { authGet } from "../urls/api";
import filledStar from "../@core/assets/images/logo/fill_star.png";
import { renderStars } from "../views/coach/utils/badge";
import { getBadgeImage } from "./badges";
import { useTranslation } from "react-i18next";

const SessionResponseModalDetails = ({
  data,
  toggleRequestModal,
  handleSession,
}) => {
  const [rating, setRating] = useState();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const getRating = async () => {
    const rating = await authGet(
      `rating/getRatingBySession/${data?.session_info?.session_details?.session_id}`
    )
      .then((response) => setRating(response?.result))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getRating();
  }, []);

  return (
    <div>
      <ModalHeader toggle={toggleRequestModal}>
        <p
          style={{
            fontWeight: "600",
            fontSize: "18px",
            marginTop: "15px",
            color: "#0F6D6A",
          }}
        >
          {t("Session Details")}
        </p>
      </ModalHeader>

      <>
        <div className="mb-1  ">
          <div className="d-flex" style={{ marginTop: "20px" }}>
            <div
              className="d-flex justify-content-between flex-wrap"
              style={{ width: "100%" }}
            >
              <div className="d-flex align-items-center">
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <Avatar
                    style={{
                      height: "60px",
                      width: "60px",
                      marginLeft: "10px",
                    }}
                    className="ml-2"
                    img={
                      data?.session_info?.coachee_profile_pic || defaultAvatar
                    }
                    imgHeight="60"
                    imgWidth="60"
                    // status="online"
                  />
                  {data?.session_info?.coachee_badge && (
                    <img
                      src={getBadgeImage(data?.session_info?.coachee_badge)}
                      alt="Badge"
                      style={{
                        position: "absolute",
                        right: "-10px",
                        bottom: "-15px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "transparent",
                        boxShadow: "unset",
                      }}
                    />
                  )}
                </div>

                <div style={{ marginLeft: "12px" }}>
                  <h2
                    style={{
                      fontSize: "14px",
                      color: "#0F6D6A",
                      fontWeight: "500",
                      display: "flex",
                    }}
                  >
                    {data?.session_info?.coachee_name}
                  </h2>

                  <div className="d-flex flex-wrap">
                    <p style={{ fontSize: "12px" }}>
                      <div
                        style={{
                          marginLeft: "10px",
                          padding: "3px",
                          color: "#fff",
                          textTransform: "capitalize",
                          borderRadius: "7px",
                          backgroundColor:
                            data?.session_info?.session_details?.status ===
                            "accepted"
                              ? "#00B549"
                              : data?.session_info?.session_details?.status ===
                                "pending"
                              ? "#D8AA04"
                              : data?.session_info?.session_details?.status ===
                                "completed"
                              ? "#008000"
                              : "#FF463A",
                        }}
                      >
                        {t(data?.session_info?.session_details?.status)}
                      </div>
                    </p>
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginRight: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  backgroundColor: "#0F6D6A",
                  height: "40px",
                  width: "40px",
                  cursor: "pointer",
                }}
                onClick={
                  () =>
                    navigate(
                      `/chat-component?receiverId=${data?.session_info?.coachee_id}&first_name=${data.session_info.coach_name}&profile_pic=${data.session_info.coachee_profile_pic}`
                    )
                  // navigate(
                  //   `/coach/chat?contact_id=${data.session_info.coachee_id}&contact_first_name=${data.session_info.coach_name}&profile_pic=${data.session_info.coachee_profile_pic}`
                  // )
                }
                // onClick={() => console.log(data)}
              >
                <MessageCircle style={{ color: "#fff" }} />
              </div>
            </div>
          </div>
          <div style={{ marginLeft: "12px", marginRight: "15px" }}>
            <div className="d-flex justify-content-between mt-1 flex-wrap">
              <p style={{ color: "#0F6D6A", fontWeight: "bold" }}>
                {" "}
                {t("Category")}{" "}
              </p>
              <p
                style={{
                  color: "#0F6D6A",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {" "}
                {data?.session_info?.coaching_area_name}
              </p>
            </div>
            <div className="d-flex justify-content-between flex-wrap">
              <p style={{ color: "#0F6D6A", fontWeight: "bold" }}>
                {" "}
                {t("Date")}{" "}
              </p>
              <p
                style={{
                  color: "#0F6D6A",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {" "}
                {data?.session_info?.session_details?.date &&
                  format(
                    new Date(data?.session_info?.session_details?.date),
                    "EEE, MMM d, yyyy"
                  )}
              </p>
            </div>
            <div className="d-flex justify-content-between flex-wrap">
              <p style={{ color: "#0F6D6A", fontWeight: "bold" }}>
                {" "}
                {t("Time")}{" "}
              </p>
              <p
                style={{
                  color: "#0F6D6A",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {data?.session_info?.session_details?.section}
              </p>
            </div>
            <div className="d-flex justify-content-between flex-wrap">
              <p style={{ color: "#0F6D6A", fontWeight: "bold" }}>
                {t("Session Type")}
              </p>
              <p
                style={{
                  color: "#0F6D6A",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {data?.session_info?.session_details?.duration}
                {t("minutes")} (CHF{" "}
                {data?.session_info?.session_details?.amount})
              </p>
            </div>
            {rating && (
              <>
                <div className="">
                  <p style={{ color: "#0F6D6A", fontWeight: "bold" }}>
                    {t("Review")}{" "}
                  </p>
                  <div
                    style={{
                      maxHeight: "150px",
                      overflow: "auto",
                    }}
                  >
                    <div
                      style={{
                        border: "1px solid  #0F6D6A",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <div style={{ margin: "10px 0" }}>
                        {renderStars(parseInt(rating?.rating))}
                      </div>
                      {rating?.comment}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
      {data?.session_info?.session_details?.status === "pending" && (
        <ModalFooter>
          <div
            className="d-flex justify-content-around"
            style={{ width: "100%" }}
          >
            <Button
              color="primary"
              className="justify-content-center w-50"
              onClick={() => handleSession("rejected")}
              style={{ borderRadius: "25px", margin: "10px" }}
            >
              {t("Reject")}
            </Button>
            <Button
              color="primary"
              className="justify-content-center w-50"
              onClick={() => handleSession("accepted")}
              style={{ borderRadius: "25px", margin: "10px" }}
            >
              {t("Accept")}
            </Button>
          </div>
        </ModalFooter>
      )}
    </div>
  );
};

export default SessionResponseModalDetails;

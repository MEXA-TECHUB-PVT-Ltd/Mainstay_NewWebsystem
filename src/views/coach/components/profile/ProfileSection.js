import React, { useState } from "react";
import { Button } from "reactstrap";
import ProfileModal from "../modals/ProfileModal";
import { getBadgeImage } from "../../../../utility/badges";
import { useTranslation } from "react-i18next";

const CoachProfileSection = ({ user, refetch }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentStyle, setContentStyle] = useState({
    maxHeight: "0px",
    overflow: "hidden",
    transition: "max-height 0.5s ease",
  });

  console.log("user", user?.about);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const toggleText = () => {
    if (!isExpanded) {
      // Assuming an average character height, adjust accordingly
      setContentStyle({
        maxHeight: "500px",
        overflow: "hidden",
        transition: "max-height 0.5s ease",
      });
    } else {
      setContentStyle({
        maxHeight: "0px",
        overflow: "hidden",
        transition: "max-height 0.5s ease",
      });
    }
    setIsExpanded(!isExpanded);
  };

  const renderAboutText = () => {
    if (user?.about?.length > 100 && !isExpanded) {
      console.log(user?.about?.length);
      return (
        <>
          <div
            style={{
              maxHeight: "60px",
              overflow: "hidden",
              transition: "max-height 0.5s ease",
            }}
          >
            {user.about.substring(0, 100)}...
            <Button color="link" onClick={toggleText}>
              See More
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>
            {user?.about}

            {user?.about?.length > 100 && (
              <Button color="link" onClick={toggleText}>
                See Less
              </Button>
            )}
          </div>
        </>
      );
    }
  };

  const badgeImage = user?.badges ? getBadgeImage(user.badges.name) : null;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div
          className="d-flex align-items-center gap-1 flex-wrap"
          style={{ flex: 1 }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={user?.profile_pic}
              alt="Profile Image"
              style={{ width: "60px", height: "60px", borderRadius: "30px" }}
            />
            {badgeImage && (
              <img
                src={badgeImage}
                alt="Badge"
                style={{
                  position: "absolute",
                  right: "-10px",
                  bottom: "-5px",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "transparent",
                  boxShadow: "unset",
                }}
              />
            )}
          </div>
          <div>
            <h5 className="mb-0">{user?.first_name + " " + user?.last_name}</h5>
            <p className="mb-0 text-muted">{user?.email}</p>
          </div>
        </div>
        <Button
          color="primary"
          size="sm"
          style={{ borderRadius: "50px", boxShadow: "none" }}
          onClick={toggleModal}
        >
          {t("Edit Profile")}
        </Button>
      </div>
      <hr />
      <h3> {t("About")} </h3>
      <p>{renderAboutText() || ""}</p>
      <ProfileModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        user={user}
        refetch={refetch}
      />
    </>
  );
};

export default CoachProfileSection;

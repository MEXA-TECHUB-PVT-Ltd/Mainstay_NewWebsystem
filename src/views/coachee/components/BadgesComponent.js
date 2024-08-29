import React, { useState } from "react";
import { Card } from "reactstrap";
import activeBadge from "../../../@core/assets/images/logo/active-badge.png";
import inactiveBadge from "../../../@core/assets/images/logo/inactive-badge.png";
import { coacheeBadges } from "../../coach/utils/badge";
import "./style.css";
import BadgeModal from "../../coach/components/badge/BadgeModal";
import { useTranslation } from "react-i18next";

const BadgesComponent = ({ userBadge }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const toggleModal = (badge = null) => {
    if (userBadge !== badge.title) {
      setIsModalOpen(!isModalOpen);
      setSelectedBadge(badge);
    }
  };

  return (
    <Card
      className="flex-grow-1 text-center p-4 height-control"
      style={{ maxWidth: "450px", cursor: "pointer", marginRight: "20px" }}
    >
      <h1 style={{ color: "#0F6D6A" }}>{t("My Mainstays Badges")}</h1>
      <div className="d-flex justify-content-around align-items-center flex-wrap">
        {coacheeBadges.map((badge) => (
          <div
            key={badge.title}
            className="text-center my-2"
            onClick={() => toggleModal(badge)}
          >
            <img
              src={
                userBadge === badge.requiredBadge ? activeBadge : inactiveBadge
              }
              alt={badge.title + " Badge"}
              width="80"
            />
            <h2>{badge.title}</h2>
            <p>{badge.criteria}</p>
          </div>
        ))}
      </div>
      {/* <BadgeModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        userBadge={selectedBadge}
      /> */}
    </Card>
  );
};

export default BadgesComponent;

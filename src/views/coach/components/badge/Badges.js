import React, { useState } from "react";
import { Card } from "reactstrap";
import BadgeModal from "./BadgeModal"; // Import the BadgeModal component
import { badges } from "../../utils/badge";
import activeBadge from "../../../../@core/assets/images/logo/active-badge.png";
import inactiveBadge from "../../../../@core/assets/images/logo/inactive-badge.png";
import "./style.css";
import { useTranslation } from "react-i18next";

const Badges = ({ userBadge }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const toggleModal = (badge = null) => {
    if (userBadge?.name !== badge.title || !badge.title) {
      setIsModalOpen(!isModalOpen);
      setSelectedBadge(badge);
    }
  };

  return (
    <Card
      className="flex-grow-1 text-center p-2 height-control"
      style={{ maxWidth: "450px", cursor: "pointer" }}
    >
      <h1 style={{ color: "#0F6D6A" }}> {t("My Mainstays Badges")} </h1>
      <div className="d-flex justify-content-around align-items-center flex-wrap">
        {badges?.map((badge) => (
          <div
            key={badge.title}
            className="text-center my-2"
            onClick={() => toggleModal(badge)}
          >
            <img
              src={
                userBadge?.name === badge.requiredBadge
                  ? activeBadge
                  : inactiveBadge
              }
              alt={badge.title + " Badge"}
              width="70"
            />
            <h3>{badge?.title}</h3>
            <p
              style={{
                fontSize: "12px",
              }}
            >
              {badge?.criteria}
            </p>
          </div>
        ))}
      </div>
      {selectedBadge && (
        <BadgeModal
          isOpen={isModalOpen}
          toggle={toggleModal}
          userBadge={selectedBadge}
        />
      )}
    </Card>
  );
};

export default Badges;

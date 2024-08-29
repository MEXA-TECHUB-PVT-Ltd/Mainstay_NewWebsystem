import React from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import badge from "../../../../@core/assets/images/logo/badge.png";

const BadgeModal = ({ isOpen, toggle, userBadge }) => {
  const badgeDetails = {
    Bronze:
      "Participate in 5 sessions with an average rating of 4 or above to earn a Bronze badge.",
    Silver:
      "Participate in 15 sessions with an average rating of 4 or above to earn a Silver badge.",
    Gold: "Participate in 25 sessions with an average rating of 4 or above to earn a Gold badge.",
    Platinum:
      "Participate in 50 sessions with an average rating of 4 or above to earn a Platinum badge",
  };

  const renderModalContent = () => {
    if (!userBadge) {
      return "No badge selected.";
    } else {
      const nextBadgeAdvice = badgeDetails[userBadge.title];
      return `${nextBadgeAdvice}`;
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle} className="bg-info text-white"></ModalHeader>
      <ModalBody className="text-center">
        <img src={badge} alt="badge" width={100} />
        <h2 className="my-2">You are doing great</h2>
        <p>{renderModalContent()}</p>
      </ModalBody>
    </Modal>
  );
};

export default BadgeModal;

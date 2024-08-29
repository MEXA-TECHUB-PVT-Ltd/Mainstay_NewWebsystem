import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import triangleL from "./images/triangleL.png";
import triangleR from "./images/triangleR.png";
import bell from "./images/bell.png";
import end from "./images/end.png";
import badgeIcon from "./images/badgeIcon.png";
import badge from "./images/badge.png";
import { useTranslation } from "react-i18next";

const SessionEndModal = ({ isOpen, toggle, handleRateModal, name }) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered">
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>
        <Container>
          <Row className="justify-content-center">
            <Col xs="auto">
              <img
                src={triangleL}
                alt="Triangle Left"
                className="position-absolute"
                style={{ left: 0 }}
                width={60}
              />
            </Col>
            <Col>
              <div className="text-center mt-5">
                <img
                  src={end}
                  alt="Notification Icon"
                  className="img-fluid"
                  style={{ maxWidth: "90px", maxHeight: "100px" }}
                />
                <p className="mt-2">{"Session Ended!"}</p>
                <p className="mt-2">
                  {" "}
                  {t("Kindly rate your session with")} {name}
                </p>
                <Button
                  color="primary"
                  className="mt-2"
                  onClick={handleRateModal}
                >
                  {t("Rate Now")}
                </Button>
                <p
                  className="mt-1"
                  style={{ cursor: "pointer" }}
                  onClick={toggle}
                >
                  {t("Maybe Later")}
                </p>
              </div>
            </Col>
            <Col xs="auto">
              <img
                src={triangleR}
                alt="Triangle Right"
                className="position-absolute"
                style={{ right: 0 }}
                width={60}
              />
            </Col>
          </Row>
        </Container>
      </ModalBody>
    </Modal>
  );
};

export default SessionEndModal;

import React from "react";
import { Modal, ModalHeader, ModalBody, Container, Row, Col } from "reactstrap";
import triangleL from "./images/triangleL.png";
import triangleR from "./images/triangleR.png";
import bell from "./images/bell.png";
import end from "./images/end.png";
import badgeIcon from "./images/badgeIcon.png";
import badge from "./images/badge.png";

const BellModal = ({ isOpen, toggle }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-lg">
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody
        style={{
          backgroundImage: `url(${bell})`,
          backgroundSize: "cover",
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col xs="auto">
              <img
                src={triangleL}
                alt="Triangle Left"
                className="position-absolute"
                style={{ left: 0 }}
              />
            </Col>
            <Col>
              <div className="text-center">
                <img
                  src={bell}
                  alt="Notification Icon"
                  className="img-fluid"
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
                <p>{"content"}</p>
              </div>
            </Col>
            <Col xs="auto">
              <img
                src={triangleR}
                alt="Triangle Right"
                className="position-absolute"
                style={{ right: 0 }}
              />
            </Col>
          </Row>
        </Container>
      </ModalBody>
    </Modal>
  );
};

export default BellModal;

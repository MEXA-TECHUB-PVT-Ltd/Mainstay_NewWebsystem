import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import congratulations from "../../../@core/assets/images/icons/congratulations.png";
import confetti from "../../../@core/assets/images/icons/Confetti-ezgif.com-speed.gif";
import { useTranslation } from "react-i18next";

const SuccessModal = ({ isOpen, toggle, title, text }) => {
  const { t } = useTranslation();
  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className="modal-dialog-centered"
        style={{ height: "800px" }}
      >
        <ModalHeader toggle={toggle}>
          <h3 style={{ color: "#0F6D6A" }}>{title}</h3>
        </ModalHeader>
        <ModalBody
          style={{
            // textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            position: "relative",
            padding: "20px",
            minHeight: "500px",
          }}
        >
          <img
            src={confetti}
            alt="Celebration confetti"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // zIndex: "-1"
            }}
          />

          <img
            src={congratulations}
            alt="Congratulations"
            style={{ width: "250px", zIndex: 1 }}
          />
          <h2 style={{ color: "#0F6D6A" }}>{t("Congratulations!")}</h2>
          <p style={{ color: "#0F6D6A" }}>{text}</p>
          <h3 style={{ color: "#0F6D6A" }}> {t("Keep it up!")} </h3>
          <Button color="primary" style={{ zIndex: 99999 }} onClick={toggle}>
            {" "}
            {t("Okay")}{" "}
          </Button>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    </>
  );
};

export default SuccessModal;

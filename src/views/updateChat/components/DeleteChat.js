import { t } from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";

const DeleteChat = ({
  isOpen,
  toggle,
  title,
  actionText,
  action,
  loading,
  reasons,
  selectedReason,
  setSelectedReason,
  error,
}) => {
  const { t } = useTranslation();
  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered">
      <ModalHeader toggle={toggle}>
        <h3 style={{ color: "#0F6D6A" }}>{title}</h3>
      </ModalHeader>
      <ModalBody>
        {reasons?.length > 0 ? (
          <div style={{ textAlign: "center" }}>
            <h5>{t("Select Reason")}</h5>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div
              style={{
                padding: "10px",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {reasons.map((reason, index) => (
                <div
                  key={index}
                  onClick={() => handleReasonSelect(reason)}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selectedReason === reason ? "#0F6D6A" : "#EEEEEE",
                    padding: "8px",
                    borderRadius: "3px",
                    margin: "5px",
                    display: "inline-block",
                    color: selectedReason === reason ? "#FFFF" : "",
                  }}
                >
                  {reason}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {" "}
            {t("Are you sure you want to")} {actionText}?
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          {t("Cancel")}
        </Button>
        <Button color="danger" onClick={action}>
          {loading ? <Spinner size="sm" /> : t("Submit")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteChat;

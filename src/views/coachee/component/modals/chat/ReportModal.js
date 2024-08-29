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

const ReportModal = ({ modal, toggle, loading, reportuser }) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}> {t("Report User<")} </ModalHeader>
      <ModalBody> {t("Do you want to report this user?")} </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          {t("Cancel")}
        </Button>
        {loading ? (
          <Button color="primary">
            {" "}
            <Spinner size="sm" />{" "}
          </Button>
        ) : (
          <Button color="primary" onClick={reportuser}>
            {t("Report")}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default ReportModal;

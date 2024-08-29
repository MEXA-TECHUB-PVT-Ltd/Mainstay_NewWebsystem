import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";
import image from "../../@core/assets/images/icons/delete_account.png";
import { useTranslation } from "react-i18next";

const DeleteAccountModal = ({ isOpen, toggle, action, loading }) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="modal-dialog-centered"
      //   size="lg"
    >
      <ModalHeader toggle={toggle}>
        <h3 style={{ color: "#0F6D6A" }}> {t("Delete Account")} </h3>
      </ModalHeader>
      <ModalBody>
        <div className="d-flex justify-content-center align-items-center">
          <img src={image} alt="" width={150} />
        </div>

        <p>
          {t(
            `By deleting your account, you will lose access to all your data associated with this account. However,you have the option to retrieve your data within 90 days of deletion by sending an email request to our administrative team at Main-Stays@gmail.com.`
          )}
        </p>
        <p>
          {t(
            `In the body of the email, provide the following complete profile credentials:`
          )}
        </p>
        <li> {t(`Username`)}: </li>
        <li> {t(`Email Address`)}:</li>
        <li> {t(`Full Name`)}:</li>
        <li> {t(`Any Additional Information (if applicable)`)}:</li>
        <p>
          {t(
            `Please ensure that the provided information matches the details associated with your deleted account.`
          )}
        </p>
      </ModalBody>
      <ModalFooter></ModalFooter>
      <div className="d-flex justify-content-center align-items-center mb-2">
        <Button color="primary" onClick={action}>
          {loading ? <Spinner size="sm" /> : t("Yes, Delete Account")}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;

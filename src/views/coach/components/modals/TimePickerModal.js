import React from "react";
import {
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import CustomTimeInput from "../../../../utility/CustomTimePicker";
import { useTranslation } from "react-i18next";

const TimePickerModal = ({
  modalOpen,
  toggleModal,
  startTime,
  handleStartTimeChange,
  endTime,
  handleEndTimeChange,
  addAvailability,
  setStartTime,
  setEndTime,
  timeError,
  setModalOpen,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          {t("Select Time")}
        </ModalHeader>
        <ModalBody>
          <CustomTimeInput
            label={t("Start Time:")}
            value={startTime}
            onChange={setStartTime}
            timeError={timeError}
          />
          <CustomTimeInput
            label={t("End Time:")}
            value={endTime}
            onChange={setEndTime}
            timeError={timeError}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="justify-content-center"
            onClick={addAvailability}
          >
            {t("Save Time")}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default TimePickerModal;

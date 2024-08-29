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
  return (
    <>
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          Select Time
        </ModalHeader>
        <ModalBody>
          <CustomTimeInput
            label="Start Time:"
            value={startTime}
            onChange={setStartTime}
            timeError={timeError}
          />
          <CustomTimeInput
            label="End Time:"
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
            Save Time
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default TimePickerModal;

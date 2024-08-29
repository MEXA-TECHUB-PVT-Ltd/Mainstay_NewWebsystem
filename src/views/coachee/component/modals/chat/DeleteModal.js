import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from 'reactstrap';

const DeleteModal = ({ modal, toggle, loading, deleteMessages }) => {
  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Delete Chat</ModalHeader>
      <ModalBody>Do you want to delete the chat ?</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        {loading ? (
          <Button color="primary">
            {" "}
            <Spinner size="sm" />{" "}
          </Button>
        ) : (
          <Button color="primary" onClick={deleteMessages}>
            Delete
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default DeleteModal

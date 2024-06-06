import {ClockCircleOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import Opening from "./Opening";
import "./App.css";

const MyModal: React.FC = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" style={{margin: 50}} onClick={handleShow}>
        Show Opening Hours
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            <ClockCircleOutlined
              style={{color: "#A1A2A4", fontSize: "1.5rem"}}
            />
            <div> Opening hours </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Opening />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MyModal;

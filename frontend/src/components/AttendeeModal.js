import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "../App.css";
import axios from "axios";
import { Button, Card, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function AttendeeModal(props) {
  const user = firebase.auth().currentUser;
  const [formData, setFormData] = useState({});
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [rsvpDeadline, setRsvpDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const { weddings, setWeddingData, setAttendeeModalToggle, weddingData, attendeeId } =
    props;

  const handleChange = (e) => {
    let updatedValue = { [e.target.name]: e.target.value };
    setFormData((prev) => ({ ...prev, ...updatedValue }));
  };

  const editAttendee = async () => {
        if(!formData.name  || !formData.extras || !formData.foodChoices){
          setInvalid(true);
          return;
        }
        if(formData.foodChoices.toString().split(",").length == 0){
          setInvalid(true);
          return;
        }
        let newAttendee = {
            name: formData.name,
            email: user.email,
            attending: formData.attending === "on" ? true : false,
            extras: parseInt(formData.extras),
            foodChoices: formData.foodChoices.toString().split(","),
            responded: true
        }
        try {
            const { data } = await axios.patch(
                `http://localhost:3001/weddings/${weddingData._id}/attendee/${attendeeId}`,
                newAttendee
            );
            
            setInvalid(false);
            let index = weddings.map(function(w) { return w._id; }).indexOf(weddingData._id);
            weddings[index] = data;            
            setAttendeeModalToggle(false);
            setWeddingData(weddings);
        } catch (e) {
            console.log(e);
        }
  };

  return (
    <Modal show={true}>
      <Modal.Header closeButton onHide={() => setAttendeeModalToggle(false)}>
        <Modal.Title>
          Respond to Invitation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={invalid}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              onChange={(e) => handleChange(e)}
              placeholder="Enter your full name"
              required
            />
            <Form.Control.Feedback type="invalid">
               Please input your name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Attending?</Form.Label>
            <Form.Check
              type="checkbox"
              name="attending"
              onChange={(e) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="date">
            <Form.Label>Extras</Form.Label>
            <Form.Control
              type="number"
              name="extras"
              onChange={(e) => handleChange(e)}
              placeholder="# of extras"
              min="0"
              required
            />
            <Form.Control.Feedback type="invalid">
               Please specify the number of extras you are bringing.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="rsvpdeadline">
            <Form.Label>Food Choices</Form.Label>
            <Form.Control
              type="text"
              name="foodChoices"
              onChange={(e) => handleChange(e)}
              placeholder="Food choices separated by commas ex: chicken,steak"
              required
            />
            <Form.Control.Feedback type="invalid">
               Please specify your food choices separated by commas.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setAttendeeModalToggle(false)}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={async () => {
            await editAttendee();
          }}
        >
        Respond
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AttendeeModal;

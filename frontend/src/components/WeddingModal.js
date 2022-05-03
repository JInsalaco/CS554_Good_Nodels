import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "../App.css";
import axios from "axios";
import { Button, Card, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const longMonths = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

function WeddingModal(props) {
  const user = firebase.auth().currentUser;
  const [formData, setFormData] = useState({});
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [rsvpDeadline, setRsvpDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);


  const { setUpdateWeddingData, setWeddingModalToggle, weddingData, type } =
    props;
  
  const handleChange = (e) => {
    let updatedValue = { [e.target.name]: e.target.value };
    setFormData((prev) => ({ ...prev, ...updatedValue }));
  };

  const dateStrToObj = (dateStr) => {
    let dateArr = dateStr.split("-");
    let year = parseInt(dateArr[0]);
    let month = longMonths[parseInt(dateArr[1]) + 1];
    let day = parseInt(dateArr[2]);
    return { year, month, day };
  };

  const addWedding = async () => {
    if (!title || !venue || !date || !rsvpDeadline) {
      setInvalid(true);
      return;
    }
    const formData = {
      title: title,
      venue: venue,
      date: dateStrToObj(date),
      rsvpDeadline: dateStrToObj(rsvpDeadline),
      contactPerson: user.email,
      events: [],
    };
    try {
      const response = await axios.post(
        "http://localhost:3001/weddings",
        formData
      );
      setUpdateWeddingData(response);
      setInvalid(false);
      setWeddingModalToggle(false);
    } catch (e) {
      console.log("User has no weddings");
    }
  };

  const editWedding = async () => {
    const formData = {
      title: title ? title : null,
      venue: venue ? venue : null,
      date: date ? dateStrToObj(date) : null,
      rsvpDeadline: rsvpDeadline ? dateStrToObj(rsvpDeadline) : null,
    };

    try {
      await axios.put(
        `http://localhost:3001/weddings/${weddingData._id}`,
        formData
      );
      const { data } = await axios.get(
        `http://localhost:3001/weddings/wedding/${user.email}`
      );
      setUpdateWeddingData(data);
      setInvalid(false);
      setWeddingModalToggle(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal show={true}>
      <Modal.Header closeButton onHide={() => setWeddingModalToggle(false)}>
        <Modal.Title>
          {type === "CREATE" ? "Create" : "Edit"} Wedding
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder={!weddingData ? '' : weddingData.title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Venue</Form.Label>
            <Form.Control
              type="text"
              placeholder={!weddingData ? '' : weddingData.venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="date">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="rsvpdeadline">
            <Form.Label>RSVP Deadline</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => setRsvpDeadline(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setWeddingModalToggle(false)}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={async () => {
            if (type === "CREATE") {
              await addWedding();
            } else if (type === "EDIT") {
              await editWedding();
            }
          }}
        >
          {type === "CREATE" ? "Add" : "Update"}!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default WeddingModal;

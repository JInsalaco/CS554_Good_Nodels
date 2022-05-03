import React, { useState } from "react";
import firebase from "firebase/app";
import "../App.css";
import axios from "axios";
import { Button,Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const longMonths = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

function WeddingModal(props) {
  const user = firebase.auth().currentUser;
  const [formData, setFormData] = useState({});
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [rsvpDeadline, setRsvpDeadline] = useState("");
  const [invalid, setInvalid] = useState(false);


  const { setUpdateWeddingData, setWeddingModalToggle, weddingData, type } =
    props;
  
  let rsvpDate; 
  let weddingDate;
  let formWeddingDate;
  let formRsvp;
  
  if(weddingData){
      rsvpDate = new Date(`${weddingData.rsvpDeadline.year}-${weddingData.rsvpDeadline.month}-${weddingData.rsvpDeadline.day}`)
      console.log(rsvpDate)
      weddingDate = new Date(`${weddingData.date.year}-${weddingData.date.month}-${weddingData.date.day}`)
      formRsvp = new Date(rsvpDate).toISOString().split("T")[0]
      formWeddingDate = new Date(weddingDate).toISOString().split("T")[0]
    } else {
      formRsvp = '';
      formWeddingDate = '';
    }

  const handleChange = (e) => {
    let updatedValue = { [e.target.name]: e.target.value };
    setFormData((prev) => ({ ...prev, ...updatedValue }));
  };

  const dateStrToObj = (dateStr) => {
    let dateArr = dateStr.split("-");
    let year = parseInt(dateArr[0]);
    console.log(dateArr[1])
    let month = longMonths[parseInt(dateArr[1])];
    let day = parseInt(dateArr[2]);
    console.log(year, month, day)
    return { year, month, day };
  };

  const addWedding = async () => {
    if (!title || !venue || !date || !rsvpDeadline) {
      setInvalid(true);
      return;
    }
    dateStrToObj(date)
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
              defaultValue={weddingData ? weddingData.title : ''}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Venue</Form.Label>
            <Form.Control
              type="text"
              defaultValue={weddingData ? weddingData.venue : ''}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="date">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              defaultValue={formWeddingDate}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="rsvpdeadline">
            <Form.Label>RSVP Deadline</Form.Label>
            <Form.Control
              type="date"
              defaultValue={formRsvp}
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

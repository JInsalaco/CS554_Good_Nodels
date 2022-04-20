import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import { Button, Card, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Events(props) {
  const [eventData, setEventData] = useState(undefined);
  const [weddingName, setWeddingName] = useState(undefined);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [eventID, setEventID] = useState(undefined);
  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  let eventCards = undefined;

  const months = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

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

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/weddings/${props.weddingID}`
        );
        setEventData(data.events);
        setWeddingName(data.title);
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    }
    fetchData();
  }, [props.weddingID]);

  const handleInput = (state, e) => {
    if (state === "eventName") {
      setEventName(e.target.value);
    } else if (state === "eventDesc") {
      setEventDesc(e.target.value);
    } else if (state === "eventDate") {
      setEventDate(e.target.value);
    }
  };

  const addNewEvent = async () => {
    // Error checks
    if (eventName.length === 0 || eventDesc.length === 0 || !eventDate) {
      alert("You must fill out all details!");
      return;
    }
    if (new Date(eventDate).getTime() < new Date().getTime()) {
      alert("Event cannot be in the past!");
      return;
    }
    let date = new Date(eventDate);
    date.setHours(date.getHours() + 5);
    let dateObj = {
      month: date.toLocaleString("default", { month: "long" }),
      day: date.getDate(),
      year: date.getFullYear(),
    };
    // Add the event
    let newData;
    try {
      newData = await axios.patch(
        `http://localhost:3001/weddings/${props.weddingID}/event`,
        {
          title: eventName,
          description: eventDesc,
          date: dateObj,
        }
      );
      setEventData(newData.data.events);
      setShowAdd(false);
      setEventName("");
      setEventDesc("");
      setEventDate("");
    } catch (e) {
      alert("Could not add new event!");
      console.log(e);
    }
  };

  const deleteEvent = async () => {
    let newData;
    try {
      newData = await axios.delete(
        `http://localhost:3001/weddings/${props.weddingID}/event/${eventID}`
      );
      console.log(newData.data.events);
      setEventData(newData.data.events);
      setShowDelete(false);
    } catch (e) {
      alert("Could not delete event!");
      console.log(e);
    }
  };

  const editEvent = async () => {
    // Error checks
    if (eventName.length === 0 || eventDesc.length === 0 || !eventDate) {
      alert("You must fill out all details!");
      return;
    }
    if (new Date(eventDate).getTime() < new Date().getTime()) {
      alert("Event cannot be in the past!");
      return;
    }
    let date = new Date(eventDate);
    let dateObj = {
      month: longMonths[date.getUTCMonth()],
      day: date.getUTCDate(),
      year: date.getUTCFullYear(),
    };
    // Edit the event
    let newData;
    try {
      newData = await axios.patch(
        `http://localhost:3001/weddings/${props.weddingID}/event/${eventID}`,
        {
          title: eventName,
          description: eventDesc,
          date: dateObj,
        }
      );
      setEventData(newData.data.events);
      setShowEdit(false);
    } catch (e) {
      alert("Could not edit this event, please try again!");
      console.log(e);
    }
  };

  const addModal = (
    <Modal show={showAdd} onHide={() => setShowAdd(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => handleInput("eventName", e)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => handleInput("eventDesc", e)}
            />
          </Form.Group>
          <Form.Group controlId="date">
            <Form.Label>Event Date</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => handleInput("eventDate", e)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowAdd(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={addNewEvent}>
          Add!
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const editModal = (
    <Modal show={showEdit} onHide={() => setShowEdit(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => handleInput("eventName", e)}
              value={eventName}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => handleInput("eventDesc", e)}
              value={eventDesc}
            />
          </Form.Group>
          <Form.Group controlId="date">
            <Form.Label>Event Date</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => handleInput("eventDate", e)}
              value={eventDate}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEdit(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={editEvent}>
          Edit!
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const deleteModal = (
    <Modal show={showDelete} onHide={() => setShowDelete(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure you want to delete this event?</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDelete(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={deleteEvent}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );

  // Create the display of events
  if (eventData) {
    let eventImage;
    eventCards = eventData.map((event) => {
      if (event.title.toLowerCase().includes("party")) {
        eventImage = (
          <i
            className="fa-solid fa-champagne-glasses event-image"
            alt="event icon"
          ></i>
        );
      } else if (
        event.title.toLowerCase().includes("dinner") ||
        event.title.toLowerCase().includes("food")
      ) {
        eventImage = (
          <i className="fa-solid fa-utensils event-image" alt="event icon"></i>
        );
      } else {
        eventImage = (
          <i
            className="fa-solid fa-cake-candles event-image"
            alt="event icon"
          ></i>
        );
      }
      return (
        <Card
          className="event-card"
          style={{ width: "18rem", marginLeft: "auto", marginRight: "auto" }}
          key={event._id}
        >
          <Card.Body>
            {eventImage}
            <Card.Title>{event.title}</Card.Title>
            <Card.Text>{event.description}</Card.Text>
            <Card.Text>
              {event.date.month} {event.date.day}, {event.date.year}
            </Card.Text>
            <Button
              variant="primary"
              onClick={() => {
                setShowEdit(true);
                setEventName(event.title);
                setEventDesc(event.description);
                setEventDate(
                  `${event.date.year}-${months[event.date.month]}-${String(
                    event.date.day
                  ).padStart(2, "0")}`
                );
                setEventID(event._id);
              }}
            >
              Edit Event
            </Button>
            <br /> <br />
            <Button
              variant="primary"
              onClick={() => {
                setShowDelete(true);
                setEventID(event._id);
              }}
            >
              Delete Event
            </Button>
          </Card.Body>
        </Card>
      );
    });
  }

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <h2>Error loading page, please try again!</h2>
      </div>
    );
  } else {
    return (
      <div className="event-div">
        <h2>Events for {weddingName}</h2>
        {eventCards}
        <Button variant="primary" onClick={() => setShowAdd(true)}>
          Add an Event
        </Button>
        {addModal}
        {editModal}
        {deleteModal}
      </div>
    );
  }
}

export default Events;

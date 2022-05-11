import React, { useState, useEffect } from "react";
import "../App.css";
import { Card, Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Attendees(props) {
  let weddingData = props.weddingData;

  const removeAttendee = async (attendeeId) => {
    const { data } = await axios.delete(
      `http://localhost:3001/weddings/${weddingData._id}/attendee/${attendeeId}`
    );
    props.liftState(data);
  };

  return (
    <Container>
      <Row xs={1} md={2} lg={3} className="g-4">
        {weddingData.attendees.map((attendee, index) => {
          return (
            <Card className="attendee-card" key={attendee.email}>
              <Card.Body>
                <Card.Title>{attendee.name}</Card.Title>
                <Card.Text>Email:</Card.Text>
                <Card.Text>{attendee.email}</Card.Text>
                <Card.Text>Attending: </Card.Text>
                <Card.Text>{attendee.attending ? "Yes" : "No"}</Card.Text>
                <Card.Text>Extras:</Card.Text>
                <Card.Text>{attendee.extras}</Card.Text>
                {attendee.foodChoices.map((choice) => {
                  return <Card.Text>{choice}</Card.Text>;
                })}
              </Card.Body>
              {props.canEdit && (
                <Button
                  variant="danger"
                  value={attendee._id}
                  className="mt-4 mb-4"
                  onClick={(e) => removeAttendee(e.target.value)}
                >
                  Remove Attendee
                </Button>
              )}
            </Card>
          );
        })}
      </Row>
    </Container>
  );
}

export default Attendees;

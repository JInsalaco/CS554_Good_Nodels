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
            <ListGroup>
                <Row xs={2} md={4} lg={5} className="g-4">
                    {weddingData.attendees.map((attendee, index) => {
                        return (
                            <ListGroup.Item key={attendee._id + index}>
                                <Col>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{attendee.name}</Card.Title>
                                            <Card.Text>Email: {attendee.email}</Card.Text>
                                            <Card.Text>
                                                Attending?: {attendee.attending ? "Yes" : "No"}
                                            </Card.Text>
                                            <Card.Text>Extras: {attendee.extras}</Card.Text>
                                            {attendee.foodChoices.map((choice) => {
                                                return <Card.Text>{choice}</Card.Text>;
                                            })}
                                        </Card.Body>
                                        {props.canEdit && (
                                            <Button
                                                variant="danger"
                                                value={attendee._id}
                                                onClick={(e) => removeAttendee(e.target.value)}
                                            >
                                                Remove Attendee
                                            </Button>
                                        )}
                                    </Card>
                                </Col>
                            </ListGroup.Item>
                        );
                    })}
                </Row>
            </ListGroup>
        </Container>
    );
}

export default Attendees;

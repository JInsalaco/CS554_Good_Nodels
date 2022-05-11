import firebase from "firebase/app";
import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Card,
    Container,
    Button,
    Row
  } from "react-bootstrap";
import AttendeeModal from "./AttendeeModal";

function AttendingWeddings() {
  const [weddingData, setWeddingData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [attendeeModalToggle, setAttendeeModalToggle] = useState(false);

  const user = firebase.auth().currentUser;
  const email = user.email;
  let list = null;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await axios.get(
          `http://localhost:3001/weddings/attending/${email}`
        );
        console.log(data.data);
        setWeddingData(data.data);
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(e);
      }
    }
    fetchData();
  }, [email]);

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  } else if (error) {
    console.log(error);
    return (
      <div>
        <h2>Error</h2>
      </div>
    );
  } else {
    console.log(weddingData.length);
    return (
      <Container className='attending-weddings' xs={12} sm={8} md={6} lg={5} xl={4}>
        <Row xs={1} md={2} lg={3} className="g-4">
          {weddingData.map((wedding) => {
            return (
              <Card className='invite-card'>
                <Card.Body>
                  <Card.Title>{wedding.title}</Card.Title>
                  <Card.Text>{wedding.date.month} {wedding.date.day}, {wedding.date.year}</Card.Text>
                  <Card.Text>RSVP by: {wedding.rsvpDeadline.month} {wedding.rsvpDeadline.day}, {wedding.rsvpDeadline.year}</Card.Text>
                </Card.Body>
              {!wedding.attendees.find((att) => att.email === email).responded && 
                <Button 
                  variant='primary'
                  className='mb-2 mt-2'
                  onClick={() => setAttendeeModalToggle(!attendeeModalToggle)}>Respond to Invitation
                </Button>
              }   
              {attendeeModalToggle && (
                <AttendeeModal
                  setAttendeeModalToggle={setAttendeeModalToggle}
                  setWeddingData={setWeddingData}
                  weddingData={wedding}
                  weddings = {weddingData}
                  attendeeId={wedding.attendees.find((att) => att.email === email)._id}
                />
              )}
              </Card>
          );
          })}
        </Row>
      </Container>
        
    );
  }
}

export default AttendingWeddings;
import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AddAttendee from "./AddAttendee";
import Attendees from "./Attendees";
import AddGift from "./AddGift";
import GiftCard from "./GiftCard";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import Photos from "./Photos";
import firebase from "firebase/app";
import "bootstrap/dist/css/bootstrap.min.css";

function Wedding() {
  const navigate = useNavigate();
  const [weddingData, setWeddingData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [addGiftButtonToggle, setAddGiftButtonToggle] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [addAttendeeButtonToggle, setAddAttendeeButtonToggle] = useState(false);
  const user = firebase.auth().currentUser;

  let { id } = useParams();

  async function liftState(wedding) {
    const giftList = [];
    for (let giftId of wedding.gifts) {
      const { data } = await axios.get(`http://localhost:3001/gifts/${giftId}`);
      giftList.push(data);
    }
    wedding.gifts = giftList;
    setWeddingData(wedding);
  }

  async function deleteWedding() {
    await axios.delete(`http://localhost:3001/weddings/${weddingData._id}`);
    navigate("/");
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/weddings/${id}`
        );
        const giftList = [];
        for (let giftId of data.gifts) {
          const { data } = await axios.get(
            `http://localhost:3001/gifts/${giftId}`
          );
          giftList.push(data);
        }
        data.gifts = giftList;
        setWeddingData(data);
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!weddingData) return;
    // Need to check if user is authorized to edit or view
    let foundAttendee = false;
    for (let i = 0; i < weddingData.attendees.length; i++) {
      if (weddingData.attendees[i].email === user) {
        foundAttendee = true;
      }
    }
    if (!foundAttendee && user.email !== weddingData.contactPerson) {
      return (
        <div className="forbidden-div">
          <h2>403 - You are not invited to this Wedding yet!</h2>
        </div>
      );
    }
    if (user.email === weddingData.contactPerson) {
      setCanEdit(true);
    }
  }, [weddingData]);

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <h2>Error</h2>
      </div>
    );
  } else {
    return (
      <div>
        <br />
        <br />
        <Container className="container">
          <h2>{weddingData.title}</h2>
          <h3>
            {weddingData.date.day} {weddingData.date.month}{" "}
            {weddingData.date.year}
          </h3>
          <h4>{weddingData.venue}</h4>
          <h5>
            RSVP Deadline: {weddingData.rsvpDeadline.day}{" "}
            {weddingData.rsvpDeadline.month} {weddingData.rsvpDeadline.year}
          </h5>
          <h6>{weddingData.contactPerson}</h6>
          <h7>Events:</h7>
          <ul>
            {weddingData.events.map((event) => {
              return <li key={event._id}>{event.title}</li>;
            })}
          </ul>
          <h7>Attendees:</h7>
          <br />
          {canEdit && (
            <Button
              variant="primary"
              onClick={() =>
                setAddAttendeeButtonToggle(!addAttendeeButtonToggle)
              }
            >
              Send Invitation
            </Button>
          )}
          {addAttendeeButtonToggle && (
            <AddAttendee weddingData={weddingData} liftState={liftState} />
          )}
          <Attendees
            weddingData={weddingData}
            canEdit={canEdit}
            liftState={liftState}
          />
          <div className="gift-div">
            <h7 style={{ float: "left" }}>
              Gift Registry for {weddingData.title}:
            </h7>
            <br />
            <br />
            <Container>
              <ListGroup>
                <Row xs={1} md={2} lg={3} className="g-4">
                  {weddingData.gifts.map((gift) => {
                    return (
                      <ListGroup.Item key={gift.id}>
                        <Col>
                          <GiftCard
                            gift={gift}
                            liftState={liftState}
                            canEdit={canEdit}
                            weddingId={weddingData._id}
                            key={gift._id}
                          />
                          <br />
                        </Col>
                      </ListGroup.Item>
                    );
                  })}
                </Row>
              </ListGroup>
            </Container>
            <br />
            <br />
            {canEdit && (
              <Button
                variant="primary"
                onClick={() => setAddGiftButtonToggle(!addGiftButtonToggle)}
              >
                Add Gift
              </Button>
            )}
            <br />
            <br />
            {addGiftButtonToggle && (
              <AddGift wedding={weddingData} liftState={liftState} />
            )}
          </div>
          <br />
          <br />
          <Photos weddingID={weddingData._id} canEdit={canEdit} />
          <br />
          <br />
          {canEdit && (
            <Button variant="danger" onClick={deleteWedding}>
              Delete Wedding
            </Button>
          )}
        </Container>
      </div>
    );
  }
}

export default Wedding;

import firebase from "firebase/app";
import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import AddGift from "./AddGift";
import WeddingModal from "./WeddingModal";
import AddAttendee from "./AddAttendee";
import Attendees from "./Attendees";
import GiftCard from "./GiftCard";
import { Button, Col, ListGroup, Row, Card, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Photos from "./Photos";

function Users() {
  const [weddingData, setWeddingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addGiftButtonToggle, setAddGiftButtonToggle] = useState(false);
  const [addAttendeeButtonToggle, setAddAttendeeButtonToggle] = useState(false);
  const [weddingModalToggle, setWeddingModalToggle] = useState(false);
  const [updateWeddingData, setUpdateWeddingData] = useState(false);
  const user = firebase.auth().currentUser;
  const email = user.email;

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/weddings/wedding/${email}`
        );
        const giftList = [];
        for (let giftId of data.gifts) {
          const { data } = await axios.get(
            `http://localhost:3001/gifts/${giftId}`
          );
          giftList.push(data);
        }
        data.gifts = giftList;
        console.log(data);
        setWeddingData(data);
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
      }
    }
    console.log(1);
    fetchData();
  }, [email, updateWeddingData]);

  async function updateGifts(wedding) {
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
    setWeddingData(null)
  }

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
    return (
      <Card>
        <Card.Body>
          <Card.Title className="mb-4">
            <h1>Your Wedding</h1>
          </Card.Title>
          <Row>
              <Col className='edit-delete'>
              <Button
                variant="primary"
                onClick={() => setWeddingModalToggle(!weddingModalToggle)}
                className="mb-4"
                >
                {weddingData ? "Edit" : "Create"} Wedding
              </Button>
                {weddingModalToggle && (
                  <WeddingModal
                    setWeddingModalToggle={setWeddingModalToggle}
                    setUpdateWeddingData={setUpdateWeddingData}
                    type={weddingData ? "EDIT" : "CREATE"}
                    weddingData={weddingData}
                  />
                )}
              </Col>
              <Col className='edit-delete'>
                {weddingData ? <Button variant="danger" onClick={deleteWedding}>
                    Delete Wedding
                </Button> : <></>}
              </Col>
            </Row>
          {weddingData && (
            <>
              <h2>{weddingData.title}</h2>
              <h3 className='wedding-label'>Wedding Date:</h3>
              <h3 className='wedding-display'>
                {weddingData.date.day} {weddingData.date.month}{" "}
                {weddingData.date.year}
              </h3>
              
              <h4 className='wedding-label'>Venue: </h4>
              <h4 className='wedding-display'>{weddingData.venue}</h4>
              
              <h4 className='wedding-label'>RSVP Deadline: </h4>
              <h4 className='wedding-display'>
                {weddingData.rsvpDeadline.day}{" "}
                {weddingData.rsvpDeadline.month} {weddingData.rsvpDeadline.year}
              </h4>
              
              <h4 className='wedding-label'>Contact Person: </h4>
              <h4 className='wedding-display'>{weddingData.contactPerson}</h4>
              
              <h4 className='wedding-label'>Events: </h4>
              <h4 className='wedding-display'>{weddingData.events < 1 && "None"}</h4>
              <ul className='mt-0 mb-0'>
                {weddingData.events.map((event) => {
                  return (
                    <li key={event._id}>
                      <div>
                        <p>{event.title}</p>
                        <p>
                          {event.date.day} {event.date.month} {event.date.year}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <h4 className='wedding-label'>Attendees: </h4>
              <Button
                variant="primary"
                className='mt-4 mb-4'
                onClick={() =>
                setAddAttendeeButtonToggle(!addAttendeeButtonToggle)
                }
              >
              Add attendee
              </Button>
              <h4 className='wedding-display'>{weddingData.attendees.length < 1 && "None"}</h4>
              {addAttendeeButtonToggle && (
                <AddAttendee weddingData={weddingData} liftState={updateGifts} />
              )}
              <Attendees weddingData={weddingData} canEdit={true} liftState={updateGifts} />
              <div className="gift-div">
                <h4 className='wedding-label' style={{ float: "left" }}>
                  Gift Registry for {weddingData.title}:
                </h4>
                <br />
                <br />
                <Container>
                  <ListGroup>
                    <Row xs={1} md={2} lg={3} className="g-4">
                      {weddingData.gifts.map((gift) => {
                        return (
                              <GiftCard
                                gift={gift}
                                liftState={updateGifts}
                                canEdit={true}
                              />
                        );
                      })}
                    </Row>
                  </ListGroup>
                </Container>
                <br />
                <Button
                  variant="primary"
                  onClick={() => setAddGiftButtonToggle(!addGiftButtonToggle)}
                >
                  Add Gift
                </Button>
                <br />
                {addGiftButtonToggle && (
                  <AddGift wedding={weddingData} liftState={updateGifts} />
                )}
              </div>
              <Photos weddingID={weddingData._id} canEdit={true} />
            </>
          )}
        </Card.Body>
      </Card>
    );
  }
}

export default Users;

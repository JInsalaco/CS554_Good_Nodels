import firebase from "firebase/app";
import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import AddGift from "./AddGift";
import WeddingModal from "./WeddingModal";
import GiftCard from "./GiftCard";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Users() {
  const [weddingData, setWeddingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addGiftButtonToggle, setAddGiftButtonToggle] = useState(false);
  const [weddingModalToggle, setWeddingModalToggle] = useState(false);
  const [updateWeddingData, setUpdateWeddingData] = useState(false);
  const user = firebase.auth().currentUser;
  const email = user.email;

  useEffect(async () => {
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
    await fetchData();
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
      <div>
        <br />
        <br />
        <Container className="container">
          <Button
            variant="primary"
            onClick={() => setWeddingModalToggle(!weddingModalToggle)}
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
          {weddingData && (
            <>
              <br />
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

              <h6>Events: {weddingData.events < 1 && "None"}</h6>
              <ul>
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
              <h6>Attendees: {weddingData.attendees.length < 1 && "None"}</h6>
              <ul>
                {weddingData.attendees.map((attendee) => {
                  return <li key={attendee._id}>{attendee.name}</li>;
                })}
              </ul>
              <h6>Gifts: {weddingData.gifts.length < 1 && "None"}</h6>
              {addGiftButtonToggle && (
                <AddGift wedding={weddingData} liftState={updateGifts} />
              )}
              <br />
              <ListGroup>
                <Row xs={2} md={4} lg={5} className="g-4">
                  {weddingData.gifts.map((gift) => {
                    return (
                      <ListGroup.Item key={gift.id}>
                        <Col>
                          <GiftCard gift={gift} liftState={updateGifts} />
                          <br />
                        </Col>
                      </ListGroup.Item>
                    );
                  })}
                </Row>
              </ListGroup>
              <br />
              <br />
              <Button
                variant="primary"
                onClick={() => setAddGiftButtonToggle(!addGiftButtonToggle)}
              >
                Add Gift
              </Button>
            </>
          )}
        </Container>
      </div>
    );
  }
}

export default Users;

import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AddGift from './AddGift';
import GiftCard from './GiftCard';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Wedding() {
    const [weddingData, setWeddingData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(true);
    const [addGiftButtonToggle, setAddGiftButtonToggle] = useState(false);
    let { id } = useParams();
    
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:3001/weddings/${id}`);
                const giftList = [];
                for (let giftId of data.gifts) {
                    const { data } = await axios.get(`http://localhost:3001/gifts/${giftId}`);
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

    if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }
    else if (error) {
        return (
            <div>
                <h2>Error</h2>
            </div>
        );
    }
    else {
        return (
            <div>
                <br />
                <br />
                <Container className='container'>
                    <h2>{weddingData.title}</h2>
                    <h3>{weddingData.date}</h3>
                    <h4>{weddingData.venue}</h4>
                    <h5>{weddingData.rsvpDeadline}</h5>
                    <h6>{weddingData.contactPerson}</h6>
                    <h7>Events:</h7>
                    <ul>
                        {weddingData.events.map((event) => {
                            return (
                            <li key={event._id}>{event.title}</li>
                            );
                        })}
                    </ul>
                    <h7>Attendees:</h7>
                    <ul>
                        {weddingData.attendees.map((attendee) => {
                            return (
                            <li key={attendee._id}>{attendee.name}</li>
                            );
                        })}
                    </ul>
                    <h7>Gifts:</h7>
                    <br />
                    <br />
                    <Button variant='primary' onClick={() => setAddGiftButtonToggle(!addGiftButtonToggle)}>Add Gift</Button>
                    <br />
                    <br />
                    {addGiftButtonToggle && <AddGift wedding={weddingData}/>}
                    <br />
                    <ListGroup>
                        <Row xs={2} md={4} lg={5} className='g-4'>
                            {weddingData.gifts.map((gift) => {
                                return ( 
                                    <ListGroup.Item key={gift.id}>
                                        <Col>
                                            <GiftCard gift={gift} />
                                            <br />
                                        </Col>
                                    </ListGroup.Item>
                                );
                            })}
                        </Row>
                    </ListGroup>
                </Container>
            </div>
        );
    }
}

export default Wedding;
import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Wedding() {
    const [weddingData, setWeddingData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(true);
    let { id } = useParams();
    
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:3001/weddings/${id}`);
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
                            <li key={event._id}>{event.title}</li>
                        })}
                    </ul>
                    <h7>Attendees:</h7>
                    <ul>
                        {weddingData.attendees.map((attendee) => {
                            <li key={attendee._id}>{attendee.name}</li>
                        })}
                    </ul>
                    <h7>Gifts:</h7>
                    <ul>
                        {weddingData.gifts.map((gift) => {
                            <li key={gift}>{gift}</li>
                        })}
                    </ul>
                </Container>
            </div>
        );
    }
}

export default Wedding;
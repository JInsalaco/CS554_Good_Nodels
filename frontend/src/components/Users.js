import firebase from 'firebase/app';
import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AddGift from './AddGift';
import GiftCard from './GiftCard';
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function Users() {
    const[weddingData, setWeddingData] = useState({});
    const[loading, setLoading] = useState(true);
    const[error,setError] = useState(false);
    const [addGiftButtonToggle, setAddGiftButtonToggle] = useState(false);
    const user = firebase.auth().currentUser
    const email = user.email
    console.clear();
    console.log(email);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:3001/weddings/wedding/${email}`);
                const giftList = [];
                for (let giftId of data.gifts) {
                    const { data } = await axios.get(`http://localhost:3001/gifts/${giftId}`);
                    giftList.push(data);
                }
                data.gifts = giftList;
                console.log(data);
                setWeddingData(data);
                setLoading(false);
                setError(false);
            } catch (e) {
                setLoading(false);
                setError(true);
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

                    <h7>Gifts:</h7>
                    <br />
                    <br />
                    <Button variant='primary' onClick={() => setAddGiftButtonToggle(!addGiftButtonToggle)}>Add Gift</Button>
                    <br />
                    <br />
                    {addGiftButtonToggle && <AddGift wedding={weddingData}/>}
                    <br />
                </Container>
            </div>
        );
    }
}

export default Users;
import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function GiftPage() {
    const [giftData, setGiftData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(true);
    let { id } = useParams();
    
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:3001/gifts/${id}`);
                setGiftData(data);
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
                    <h2>{giftData.title}</h2>
                    <h3>${giftData.price}</h3>
                    <img src={`${giftData.picture}`} alt={`${giftData.title}`}></img>
                    <p>{giftData.description}</p>
                    <a href={`${giftData.url}`}>{giftData.url}</a>
                </Container>
            </div>
        );
    }
}

export default GiftPage;
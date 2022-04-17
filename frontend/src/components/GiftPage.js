import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function GiftPage() {
    const [giftData, setGiftData] = useState(undefined);
    let { id } = useParams();
    
    useEffect(() => {
        setGiftData(undefined);
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:3001/gifts/${id}`);
                setGiftData(data);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [id]);

    return (
        <div>
            <br />
            <br />
            <Container className='container'>
                <div>{JSON.stringify(giftData)}</div>
            </Container>
        </div>
    );
}

export default GiftPage;
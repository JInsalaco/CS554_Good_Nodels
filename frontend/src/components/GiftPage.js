import React, { useEffect } from 'react';
import '../App.css';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function GiftPage() {
    let { id } = useParams();
    
    useEffect(() => {
    }, [id]);

    return (
        <div>
            <br />
            <br />
            <Container className='container'>
                <div>{id}</div>
            </Container>
        </div>
    );
}

export default GiftPage;
import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function GiftCard({gift}) {
    console.log(gift);
    const editGift = () => {
        return;
    };

    const removeGift = () => {
        return;
    };

    return (
        <div>
            <Card>
                <Card.Img variant='top' src={`${gift.picture}`} alt={`${gift.title}`} />
                <Card.Body>
                    <Card.Title>
                        <Link to={`/gifts/${gift._id}`}>{gift.title}</Link>
                    </Card.Title>
                </Card.Body>
                <Button variant='secondary' onClick={editGift}>Edit Gift</Button>
                <Button variant='danger' onClick={removeGift}>Remove Gift</Button>
                <br />
            </Card>
        </div>
    );
}

export default GiftCard;
import React from 'react';
import '../App.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function GiftCard(props) {
    const editGift = async () => {
        return;
    };

    const removeGift = async () => {
        const { data } = await axios.delete('http://localhost:3001/gifts', props.gift._id);
        // props.liftState(data);
    };

    return (
        <div>
            <Card>
                <Card.Img variant='top' src={`${props.gift.picture}`} alt={`${props.gift.title}`} />
                <Card.Body>
                    <Card.Title>
                        <Link to={`/gifts/${props.gift._id}`}>{props.gift.title}</Link>
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
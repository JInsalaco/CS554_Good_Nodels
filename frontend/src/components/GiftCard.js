import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EditGift from './EditGift';
import { Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function GiftCard(props) {
    const [editGiftModal, setEditGiftModal] = useState(false);

    const handleCloseModal = () => {
        setEditGiftModal(false);
    };
    
      const handleOpenModal = () => {
        setEditGiftModal(true);
    };

    const removeGift = async () => {
        const { data } = await axios.delete(`http://localhost:3001/gifts/${props.gift._id}`);
        const response = await axios.get(`http://localhost:3001/weddings/${data.weddingId}`);
        props.liftState(response.data);
    };

    return (
            <Card className='gift-card'>
                <Link to={`/gifts/${props.gift._id}`}>
                    <Card.Img variant='top' src={`${props.gift.picture}`} alt={`${props.gift.title}`} />
                    <Card.Body>
                        <Card.Title>
                            {props.gift.title}
                        </Card.Title>
                    </Card.Body>
                </Link>
                {props.canEdit && (
                    <Button variant='secondary' className='mt-2 mb-2' onClick={handleOpenModal}>
                        Edit Gift
                    </Button>
                )}
                {props.canEdit && (
                    <Button variant='danger' className='mt-2 mb-2' onClick={removeGift}>
                        Remove Gift
                    </Button>
                )}
            {editGiftModal && <EditGift isOpen={editGiftModal} handleCloseModal={handleCloseModal} gift={props.gift} liftState={props.liftState} />}
            </Card>
    );
}

export default GiftCard;
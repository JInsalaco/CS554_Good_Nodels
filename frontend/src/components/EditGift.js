import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditGift(props) {
    const [editGiftModal, setEditGiftModal] = useState(props.isOpen);
    const [formData, setFormData] = useState(props.gift);
    
    const handleChange = (e) => {
        let updatedValue = { [e.target.name]: e.target.value };
        setFormData((prev) => ({ ...prev, ...updatedValue }));
    };

    const handleCloseModal = () => {
        setEditGiftModal(false);
        props.handleCloseModal();
    };

    const editGift = async () => {
        const { data } = await axios.put(`http://localhost:3001/gifts/${props.gift._id}`, formData);
        const response = await axios.get(`http://localhost:3001/weddings/${data.weddingId}`);
        setEditGiftModal(false);
        props.handleCloseModal();
        props.liftState(response.data);
    };
    
    return (
        <div>
            <Modal show={editGiftModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Gift</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <div>
                        <label>
                            Title:
                            <input type='text' onChange={(e) => handleChange(e)} id='title' name='title' value={formData.title} placeholder='Gift Title' />
                        </label>
                        <br />
                        <label>
                            Price:
                            <input type='number' min='0' onChange={(e) => handleChange(e)} id='price' name='price' value={formData.price} placeholder='Gift Price' />
                        </label>
                        <br />
                        <label>
                            URL:
                            <input type='text' onChange={(e) => handleChange(e)} id='url' name='url' value={formData.url} placeholder='Gift URL' />
                        </label>
                        <br />
                        <label>
                            Picture:
                            <input type='text' onChange={(e) => handleChange(e)} id='picture' name='picture' value={formData.picture} placeholder='Gift Picture' />
                        </label>
                        <br />
                        <label>
                            Description:
                            <input type='text' onChange={(e) => handleChange(e)} id='description' name='description' value={formData.description} placeholder='Gift Description' />
                        </label>
                    </div>
                    <br />
                </Modal.Body>
                
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleCloseModal}>Cancel</Button>
                    <Button variant='primary' onClick={editGift}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EditGift;
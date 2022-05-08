import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Button, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditGift(props) {
    const [editGiftModal, setEditGiftModal] = useState(props.isOpen);
    const [formData, setFormData] = useState(props.gift);
    const [invalid, setInvalid] = useState(false);
    
    const handleChange = (e) => {
        let updatedValue = { [e.target.name]: e.target.value };
        setFormData((prev) => ({ ...prev, ...updatedValue }));
    };

    const handleCloseModal = () => {
        setEditGiftModal(false);
        props.handleCloseModal();
    };

    const editGift = async () => {
        if(!formData.title || !formData.price || !formData.url || !formData.picture || !formData.description) {
            setInvalid(true);
            return;
        }
        const { data } = await axios.put(`http://localhost:3001/gifts/${props.gift._id}`, formData);
        const response = await axios.get(`http://localhost:3001/weddings/${data.weddingId}`);
        setInvalid(false);
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
                    <Form noValidate validated={invalid}>
                        <Form.Label style={{ textAlign: 'left' }}>
                            Title:
                            <Form.Control className='form-control' type='text' onChange={(e) => handleChange(e)} id='title' name='title' value={formData.title} placeholder='Gift Title' required />
                            <Form.Control.Feedback type='invalid'>
                                Please input a title.
                            </Form.Control.Feedback>
                        </Form.Label>
                        <br />
                        <br />
                        <Form.Label style={{ textAlign: 'left' }}>
                            Price:
                            <Form.Control className='form-control' type='number' min='0' onChange={(e) => handleChange(e)} id='price' name='price' value={formData.price} placeholder='Gift Price' required />
                            <Form.Control.Feedback type='invalid'>
                                Please input a price.
                            </Form.Control.Feedback>
                        </Form.Label>
                        <br />
                        <br />
                        <Form.Label style={{ textAlign: 'left' }}>
                            URL:
                            <Form.Control className='form-control' type='text' onChange={(e) => handleChange(e)} id='url' name='url' value={formData.url} placeholder='Gift URL' required />
                            <Form.Control.Feedback type='invalid'>
                                Please input a URL.
                            </Form.Control.Feedback>
                        </Form.Label>
                        <br />
                        <br />
                        <Form.Label style={{ textAlign: 'left' }}>
                            Picture:
                            <Form.Control className='form-control' type='text' onChange={(e) => handleChange(e)} id='picture' name='picture' value={formData.picture} placeholder='Gift Picture' required />
                            <Form.Control.Feedback type='invalid'>
                                Please input a picture.
                            </Form.Control.Feedback>
                        </Form.Label>
                        <br />
                        <br />
                        <Form.Label style={{ textAlign: 'left' }}>
                            Description:
                            <Form.Control className='form-control' type='text' onChange={(e) => handleChange(e)} id='description' name='description' value={formData.description} placeholder='Gift Description' required />
                            <Form.Control.Feedback type='invalid'>
                                Please input a description.
                            </Form.Control.Feedback>
                        </Form.Label>
                    </Form>
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
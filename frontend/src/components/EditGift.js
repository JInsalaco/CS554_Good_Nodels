import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Button, Form, FormControl, Modal } from 'react-bootstrap';
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
                        <Form.Group className="mb-3">
                            <Form.Label style={{ textAlign: 'left' }}>
                                Title:
                            </Form.Label>
                            <Form.Control className='form-control' type='text' onChange={(e) => handleChange(e)} id='title2' name='title' value={formData.title} placeholder='Gift Title' required />
                            <Form.Control.Feedback type='invalid'>
                                Please input a title.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <br />
                        <Form.Group className="mb-3">
                            <Form.Label style={{ textAlign: 'left' }}>
                                Price:
                            </Form.Label>
                            <Form.Control className='form-control' type='number' min='0' onChange={(e) => handleChange(e)} id='price2' name='price' value={formData.price} placeholder='Gift Price' required />
                            <Form.Control.Feedback type='invalid'>
                                Please input a price.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <br />
                        <Form.Group className="mb-3">
                            <Form.Label style={{ textAlign: 'left' }}>
                                URL:
                            </Form.Label>
                            <Form.Control className='form-control' type='text' onChange={(e) => handleChange(e)} id='url2' name='url' value={formData.url} placeholder='Gift URL' required />
                            <Form.Control.Feedback type='invalid'>
                                Please input a URL.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <br />
                        <Form.Group className="mb-3">
                            <Form.Label style={{ textAlign: 'left' }}>
                                Picture:
                            </Form.Label>
                            <Form.Control className='form-control' type='text' onChange={(e) => handleChange(e)} id='picture2' name='picture' value={formData.picture} placeholder='Gift Picture' required />
                            <Form.Control.Feedback type='invalid'>
                                Please input a picture.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <br />
                        <br />
                        <Form.Group className="mb-3">
                            <Form.Label style={{ textAlign: 'left' }}>
                                Description:
                            </Form.Label>
                            <Form.Control className='form-control' type='text' onChange={(e) => handleChange(e)} id='description2' name='description' value={formData.description} placeholder='Gift Description' required />
                            <Form.Control.Feedback type='invalid'>
                                Please input a description.
                            </Form.Control.Feedback>
                        </Form.Group>
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
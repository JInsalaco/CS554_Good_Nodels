import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Button, Form, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddGift(props) {
  const [formData, setFormData] = useState({ title: '', price: 0, url: '', picture: '', description: '' });
  const [invalid, setInvalid] = useState(false);

  const handleChange = (e) => {
    let updatedValue = { [e.target.name]: e.target.value };
    setFormData((prev) => ({ ...prev, ...updatedValue }));
  };

  const addGift = async () => {
    if(!formData.title || !formData.price || !formData.url || !formData.picture || !formData.description) {
      setInvalid(true);
      return;
    }
    const { data } = await axios.post('http://localhost:3001/gifts', formData);
    const response = await axios.patch(`http://localhost:3001/weddings/${props.wedding._id}/gift`, { giftId: data._id });
    setInvalid(false);
    document.getElementById('title').value = '';
    document.getElementById('price').value = '';
    document.getElementById('url').value = '';
    document.getElementById('picture').value = '';
    document.getElementById('description').value = '';
    props.liftState(response.data);
  };

  return (
    <div>
      <Form noValidate validated={invalid}>
        <Form.Group className="mb-3">
          <Form.Label style={{ textAlign: 'left' }}>
            Title:
          </Form.Label>
          <Form.Control className='form-control' type='text' onChange={(e) => handleChange(e)} id='title' name='title' placeholder='Gift Title' required />
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
          <Form.Control className='form-control' type='number' min='0' onChange={(e) => handleChange(e)} id='price' name='price' placeholder='Gift Price' required />
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
          <Form.Control className='form-control' type='text' onChange={(e) => handleChange(e)} id='url' name='url' placeholder='Gift URL' required />
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
          <Form.Control className='form-control' type='text' onChange={(e) => handleChange(e)} id='picture' name='picture' placeholder='Gift Picture' required />
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
          <Form.Control className='form-control' type='text' onChange={(e) => handleChange(e)} id='description' name='description' placeholder='Gift Description' required />
          <Form.Control.Feedback type='invalid'>
            Please input a description.
          </Form.Control.Feedback>
        </Form.Group>
      </Form>
      <br />
      <Button variant='primary' size='sm' onClick={addGift}>Submit</Button>
    </div>
  );
}

export default AddGift;
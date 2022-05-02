import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddGift(props) {
  const [formData, setFormData] = useState({ title: '', price: 0, url: '', picture: '', description: '' });

  const handleChange = (e) => {
    let updatedValue = { [e.target.name]: e.target.value };
    setFormData((prev) => ({ ...prev, ...updatedValue }));
  };

  const addGift = async () => {
    const { data } = await axios.post('http://localhost:3001/gifts', formData);
    const response = await axios.patch(`http://localhost:3001/weddings/${props.wedding._id}/gift`, { giftId: data._id });
    document.getElementById('title').value = '';
    document.getElementById('price').value = '';
    document.getElementById('url').value = '';
    document.getElementById('picture').value = '';
    document.getElementById('description').value = '';
    props.liftState(response.data);
  };

  return (
    <div>
      <div className='form-outline mb-4'>
        <label style={{ textAlign: 'left' }}>
          Title:
          <input className='form-control' type='text' onChange={(e) => handleChange(e)} id='title' name='title' placeholder='Gift Title' />
        </label>
        <br />
        <br />
        <label style={{ textAlign: 'left' }}>
          Price:
          <input className='form-control' type='number' min='0' onChange={(e) => handleChange(e)} id='price' name='price' placeholder='Gift Price' />
        </label>
        <br />
        <br />
        <label style={{ textAlign: 'left' }}>
          URL:
          <input className='form-control' type='text' onChange={(e) => handleChange(e)} id='url' name='url' placeholder='Gift URL' />
        </label>
        <br />
        <br />
        <label style={{ textAlign: 'left' }}>
          Picture:
          <input className='form-control' type='text' onChange={(e) => handleChange(e)} id='picture' name='picture' placeholder='Gift Picture' />
        </label>
        <br />
        <br />
        <label style={{ textAlign: 'left' }}>
          Description:
          <input className='form-control' type='text' onChange={(e) => handleChange(e)} id='description' name='description' placeholder='Gift Description' />
        </label>
      </div>
      <br />
      <Button variant='primary' size='sm' onClick={addGift}>Submit</Button>
    </div>
  );
}

export default AddGift;
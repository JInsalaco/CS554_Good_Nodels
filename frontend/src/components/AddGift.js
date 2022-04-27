import { useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AddGift({wedding}) {
  const [formData, setFormData] = useState({ title: '', price: 0, url: '', picture: '', description: '' });

  const handleChange = (e) => {
    let updatedValue = { [e.target.name]: e.target.value };
    setFormData((prev) => ({ ...prev, ...updatedValue }));
  };

  const addGift = async () => {
    const { data } = await axios.post('http://localhost:3001/gifts', formData);
    await axios.patch(`http://localhost:3001/weddings/${wedding._id}/gift`, { giftId: data._id });
    document.getElementById('title').value = '';
    document.getElementById('price').value = '';
    document.getElementById('url').value = '';
    document.getElementById('picture').value = '';
    document.getElementById('description').value = '';
  };

  return (
    <div>
      <div>
        <label>
          Title:
          <input type='text' onChange={(e) => handleChange(e)} id='title' name='title' placeholder='Gift Title' />
        </label>
        <br />
        <label>
          Price:
          <input type='number' min='0' onChange={(e) => handleChange(e)} id='price' name='price' placeholder='Gift Price' />
        </label>
        <br />
        <label>
          URL:
          <input type='text' onChange={(e) => handleChange(e)} id='url' name='url' placeholder='Gift URL' />
        </label>
        <br />
        <label>
          Picture:
          <input type='text' onChange={(e) => handleChange(e)} id='picture' name='picture' placeholder='Gift Picture' />
        </label>
        <br />
        <label>
          Description:
          <input type='text' onChange={(e) => handleChange(e)} id='description' name='description' placeholder='Gift Description' />
        </label>
      </div>
      <br />
      <Button variant='primary' size='sm' onClick={addGift}>Submit</Button>
    </div>
  );
}

export default AddGift;
import React from 'react';

import '../App.css';

function Home() {
  return (
    <div>
      <div className='homepage text-center'>
        <h1>Wedd.io</h1>
        <img class='text-center' alt='Stock wedding photo' src='https://st2.depositphotos.com/1058411/5966/i/450/depositphotos_59667819-stock-photo-blonde-bride-dancing-at-restaurant.jpg'/>
      </div>

      <div 
      class="divider d-flex align-items-center my-4">
      </div>

      <div class='homepage-content'>
        <h2>
          Weddings are stressful enough, let Wedd.io do the planning so you can focus on your big day.
        </h2>
        <h3>
          Wedd.io allows you to:
        </h3>
        <ul>
          <li>
            Create a wedding invitation
          </li>
          <li>
            Invite your friends
          </li>
          <li>
            Create events
          </li>
          <li>
            Upload photos from the event
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
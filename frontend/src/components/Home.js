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
        <h4>
        <ol>
          <ul>
            Create a wedding invitation
          </ul>
          <ul>
            Invite your friends
          </ul>
          <ul>
            Create events
          </ul>
          <ul>
            Upload photos from the event
          </ul>
        </ol>
        </h4>
      </div>
    </div>
  );
}

export default Home;
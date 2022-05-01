import React, {useContext, useState} from 'react';
import {Navigate} from 'react-router-dom';
import {doCreateUserWithEmailAndPassword} from '../firebase/FirebaseFunctions';
import {AuthContext} from '../firebase/Auth';
import SocialSignIn from './SocialSignIn.js';
function SignUp() {
  const {currentUser} = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');
  const handleSignUp = async (e) => {
    e.preventDefault();
    const {displayName, email, passwordOne, passwordTwo} = e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch('Passwords do not match');
      return false;
    }

    try {
      await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName
      );
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser) {
    return <Navigate to='/home' />;
  }

  return (
  <section class="vh-100 bg-image" 
  style={{backgroundImage: `url('https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img3.webp')`}}>
    <div class="mask d-flex align-items-center h-100 gradient-custom-3">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div class="card" style={{borderRadius: '15px;'}}>
              <div class='card-body p-5'>
              <form onSubmit={handleSignUp}>
                <h2 class="text-center mb-5">Sign up using your email</h2>
                {pwMatch && <h4 className='error'>{pwMatch}</h4>}
                
                <div className='form-outline mb-4'>
                  <input
                    className='form-control form-control-lg'
                    required
                    name='displayName'
                    type='text'
                    placeholder='Name'
                  />
                </div>
                <div className='form-outline mb-4'>
                      <input
                        className='form-control form-control-lg'
                        required
                        name='email'
                        type='email'
                        placeholder='Email'
                      />
                </div>

                <div className='form-outline mb-4'>
                      <input
                        className='form-control form-control-lg'
                        id='passwordOne'
                        name='passwordOne'
                        type='password'
                        placeholder='Password'
                        autoComplete='off'
                        required
                      />
                </div>

                <div className='form-outline mb-4'>
                      <input
                        className='form-control form-control-lg'
                        name='passwordTwo'
                        id='passwordTwo'
                        type='password'
                        placeholder='Confirm Password'
                        autoComplete='off'
                        required
                      />
                </div>

                <div class="d-flex justify-content-center">
                  <button id='submitButton' name='submitButton' type='submit' class='btn-lg social-btn signup-btn'>
                      Sign Up
                  </button>
                </div>
                
                <div class="divider d-flex align-items-center my-4">
                  <p class="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
                </div>
              </form>
              <SocialSignIn />
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}



export default SignUp;
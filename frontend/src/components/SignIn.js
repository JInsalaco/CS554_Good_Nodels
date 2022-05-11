import React, {useContext} from 'react';
import SocialSignIn from './SocialSignIn';
import {Navigate, useNavigate} from 'react-router-dom';
import {AuthContext} from '../firebase/Auth';
import {
  doSignInWithEmailAndPassword,
  doPasswordReset
} from '../firebase/FirebaseFunctions';
import Link from 'react'

function SignIn() {
  const {currentUser} = useContext(AuthContext);
  let navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();
    let {email, password} = event.target.elements;

    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      alert(error);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById('email').value;
    if (email) {
      doPasswordReset(email);
      alert('Password reset email was sent');
    } else {
      alert(
        'Please enter an email address below before you click the forgot password link'
      );
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
              <div class="card" style={{borderRadius: '15px'}}>
                <div class='card-body p-5'>
                  <form onSubmit={handleLogin}>
                    <h2 class="text-center mb-5">Sign in using your email</h2>
                    <div className='form-outline mb-4'>
                      <input
                        className='form-control form-control-lg'
                        name='email'
                        id='email'
                        type='email'
                        placeholder='Email'
                        required
                      />
                    </div>
                    <div className='form-outline mb-2'>
                        <input
                          className='form-control form-control-lg'
                          name='password'
                          type='password'
                          placeholder='Password'
                          autoComplete='off'
                          required
                        />
                    </div>
                    <div class="d-flex mb-4 justify-content-end">
                      <button className='forgotPassword' type='button' onClick={passwordReset}>
                      Reset Password
                      </button>
                    </div> 
                    <div class="d-flex justify-content-center">
                      <button id='submitButton' name='submitButton' type='submit' class='btn-lg social-btn signup-btn'>
                        Log in
                      </button>
                    </div>       
                    <div class="divider d-flex align-items-center my-4">
                      <p class="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
                    </div>
                    <SocialSignIn/>
                    <div class="d-flex justify-content-end mt-2">
                      <a href='/signup' class='signUpLink'>Create an account</a>
                    </div>  
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/**

  
 */
export default SignIn;
import React from 'react';
import {doSocialSignIn} from '../firebase/FirebaseFunctions';
import {Button, ButtonGroup, ButtonToolbar, Row, Col} from 'react-bootstrap'
import facebookLogo from './loginimages/Facebook_f_logo.svg';
import googleLogo from './loginimages/Google__G__Logo.svg';
const SocialSignIn = () => {
  const socialSignOn = async (provider) => {
    console.log(provider);
    try {
      await doSocialSignIn(provider);
    } catch (error) {
      alert(error);
    }
  };

  return (
  <div className='social-sign-in'>
    <button class="google-btn social-btn btn-lg btn-block" onClick={() => socialSignOn('google')}
        role="button">
        <img class="login-logo rounded" src={googleLogo} role='presentation' width="24"
        height="24" /><span>Continue with Google</span>
    </button>
    <button class="fb-btn social-btn btn-lg  btn-block" onClick={() => socialSignOn('facebook')}
        role='button'>
        <img class='login-logo rounded' role='presentation' src={facebookLogo} width="24" 
        height="24"/><span>Continue with Facebook</span>
    </button>
  </div>
  );
};

export default SocialSignIn;
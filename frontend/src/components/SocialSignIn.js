import React from 'react';
import {doSocialSignIn} from '../firebase/FirebaseFunctions';

const SocialSignIn = () => {
  const socialSignOn = async (provider) => {
    try {
      await doSocialSignIn(provider);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
    <div class = 'd-flex justify-content-center'>
        <a class="fb-btn btn-lg social-btn" onClick={() => socialSignOn('facebook')}
          role='button'>
          <i class="fa fa-facebook fa-fw"></i> Continue with Facebook
        </a>
    </div>
    <div class = 'd-flex justify-content-center'>
        <a class="google-btn btn-lg social-btn" onClick={() => socialSignOn('google')}
            role="button">
            <i class="fab fa-google me-2"></i>Continue with Google
        </a>
    </div>
    </div>
  );
};

export default SocialSignIn;
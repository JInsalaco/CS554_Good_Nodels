import React, {useContext} from 'react'
import { doSignOut } from '../firebase/FirebaseFunctions'
import Button from 'react-bootstrap/Button'
import {useNavigate} from 'react-router-dom';
import {AuthContext} from '../firebase/Auth';

const SignOutButton = () => {
    return(
    <Button type='button' variant='secondary' onClick={doSignOut}>
        Sign Out
    </Button>
    );
};

export default SignOutButton;
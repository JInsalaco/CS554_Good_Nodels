import React, { useContext } from "react";
import {AuthContext} from '../firebase/Auth';

const Profile = () => {
    const { currentUser } = useContext(AuthContext);
    return (
        <div class='text-center'>
            <br/>
            <br/>
           <img class='center' src='https://64.media.tumblr.com/f0da7c50d726e64c6c0d8a985240b6f4/dfbbb68a95adf2d4-ce/s250x400/afe73dd5883647200c53408018ed3be99b567b80.gifv'/>
        </div>
    );
}

export default Profile;
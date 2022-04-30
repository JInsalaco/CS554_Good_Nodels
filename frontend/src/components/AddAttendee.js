import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function AddGift(props) {
    let weddingData = props.weddingData;

    const [formData, setFormData] = useState({
        email: "",
    });

    const handleChange = (e) => {
        let updatedValue = { [e.target.name]: e.target.value };
        setFormData((prev) => ({ ...prev, ...updatedValue }));
    };

    const addAttendee = async () => {
        let newEmail = formData.email.trim();

        const exists = weddingData.attendees.filter((attendee) => attendee.email === newEmail);

        let newAttendee = {
            name: "pending",
            email: newEmail,
            attending: false,
            extras: 0,
            foodChoices: [],
            responded: false
        };
        

        if(exists.length !== 0){
            alert(`${formData.email} has already been invited`);
            return;
        }

        try {
            const { data } = await axios.patch(
                `http://localhost:3001/weddings/${weddingData._id}/attendee`,
                newAttendee
            );
            props.liftState(data);
        } catch (e) {
            console.log(e);
        }
        document.getElementById("email").value = "";

    };
    return (
        <div>
            <div>
                <label>
                    Email:
                    <input
                        type="email"
                        onChange={(e) => handleChange(e)}
                        id="email"
                        name="email"
                        placeholder="Attendee email"
                    />
                </label>
            </div>
            <br />
            <Button variant="primary" size="sm" onClick={addAttendee}>
                Submit
            </Button>
            <br/>
            <br/>
        </div>
    );
}

export default AddGift;

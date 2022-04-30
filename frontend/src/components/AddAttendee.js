import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function AddGift(props) {
    let weddingData = props.weddingData;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        attending: "",
        extras: 0,
        foodChoice: "",
    });

    const handleChange = (e) => {
        let updatedValue = { [e.target.name]: e.target.value };
        setFormData((prev) => ({ ...prev, ...updatedValue }));
    };

    const addAttendee = async () => {
        let newAttendee = formData;
        newAttendee.attending = formData.attending === "on" ? true : false;
        newAttendee.extras = parseInt(formData.extras);
        newAttendee.foodChoice = formData.foodChoice.toString().split(",");
        try {
            const { data } = await axios.patch(
                `http://localhost:3001/weddings/${weddingData._id}/attendee`,
                newAttendee
            );
            props.liftState(data);
        } catch (e) {
            console.log(e);
        }
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("attending").value = "";
        document.getElementById("extras").value = "";
        document.getElementById("foodChoice").value = "";
    };
    return (
        <div>
            <div>
                <label>
                    Name:
                    <input
                        type="text"
                        onChange={(e) => handleChange(e)}
                        id="name"
                        name="name"
                        placeholder="Attendee Name"
                    />
                </label>
                <br />

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
                <br />
                <label>
                    Attending:
                    <input
                        type="checkbox"
                        onChange={(e) => handleChange(e)}
                        id="attending"
                        name="attending"
                    />
                </label>
                <br />
                <label>
                    Extras:
                    <input
                        type="number"
                        min="0"
                        onChange={(e) => handleChange(e)}
                        id="extras"
                        name="extras"
                        placeholder="Attendee Extras"
                    />
                </label>
                <br />
                <label>
                    Food Choices:
                    <input
                        type="text"
                        onChange={(e) => handleChange(e)}
                        id="foodChoice"
                        name="foodChoice"
                        placeholder="Ex: Chicken, Vegtable"
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

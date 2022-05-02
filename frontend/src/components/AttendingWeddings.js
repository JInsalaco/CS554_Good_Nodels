import firebase from "firebase/app";
import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Card,
    CardHeader,
    Grid,
    makeStyles,
    Button
  } from "@material-ui/core";
import AttendeeModal from "./AttendeeModal";

  const useStyles = makeStyles({
    card: {
      maxWidth: 250,
      height: "auto",
      marginLeft: "auto",
      marginRight: "auto",
      borderRadius: 5,
      border: "1px solid #1e8678",
      boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
    },
    titleHead: {
      borderBottom: "1px solid #1e8678",
      fontWeight: "bold",
    },
    grid: {
      flexGrow: 1,
      flexDirection: "row",
    },
    media: {
      height: "100%",
      width: "100%",
    },
    button: {
      background: '#ADD8E6',
      fontWeight: "bold",
      fontSize: 12,
    },
    Pagination: {
      alignContent:'center', 
      justifyContent:'center'
    }
  });

function AttendingWeddings() {
  const [weddingData, setWeddingData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [attendeeModalToggle, setAttendeeModalToggle] = useState(false);

  const user = firebase.auth().currentUser;
  const email = user.email;
  let list = null;
  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await axios.get(
          `http://localhost:3001/weddings/attending/${email}`
        );
        console.log(data.data);
        setWeddingData(data.data);
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(e);
      }
    }
    fetchData();
  }, [email]);

  const buildList= (wedding) => {
    return (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={wedding.id}>
                <Card className={classes.card} variant="outlined">
                    <CardHeader className={classes.titleHead} title={wedding.title} />
                  <br/>
                  <br/>
                  {!wedding.attendees.find((att) => att.email === email).responded && 
                    <Button 
                      variant="primary"
                      onClick={() => setAttendeeModalToggle(!attendeeModalToggle)}>Respond to Invitation
                    </Button>
                  }
                  {attendeeModalToggle && (
                    <AttendeeModal
                      setAttendeeModalToggle={setAttendeeModalToggle}
                      setWeddingData={setWeddingData}
                      weddingData={wedding}
                      weddings = {weddingData}
                      attendeeId={wedding.attendees.find((att) => att.email === email)._id}
                    />
                  )}
                </Card>
                <br/> 
        </Grid>
      );
  }
  if(weddingData){
    list = weddingData.map((wedding)=>{
        console.log(wedding);
        return buildList(wedding);
    })
}
  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  } else if (error) {
    console.log(error);
    return (
      <div>
        <h2>Error</h2>
      </div>
    );
  } else {
    console.log(weddingData.length);
    return (
        <div>
            <Grid container className={classes.grid} spacing={5}>
              {list}
            </Grid>
        </div>
    );
  }
}

export default AttendingWeddings;
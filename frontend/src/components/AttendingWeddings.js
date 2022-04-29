import firebase from "firebase/app";
import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import AddGift from "./AddGift";
import GiftCard from "./GiftCard";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Card,
    CardHeader,
    CardMedia,
    Grid,
    makeStyles,
    Button
  } from "@material-ui/core";

function AttendingWeddings() {
  const [weddingData, setWeddingData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const user = firebase.auth().currentUser;
  const email = user.email;
  let list = null;

  useEffect(async () => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/weddings/attending/${email}`
        );
        console.log(data);
        setWeddingData(data);
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(e);
      }
    }
    console.log(1);
    await fetchData();
  }, [email]);

  const buildList= (wedding) => {
    return (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.id}>
            
                <Card className={classes.card} variant="outlined">
                    <CardHeader className={classes.titleHead} title={wedding.name} />
                  <br/>
                  <br/>
                </Card>
                <br/> 
        </Grid>
      );
  }
  if(wedding){
    list = wedding.map((wedding)=>{
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
    return (
        <div>
            <Grid container className={classes.grid} spacing={5}>
              {list}
            </Grid>
        </div>
    );
  }
}

export default Users;
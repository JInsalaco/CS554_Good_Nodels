import React, { Fragment, useContext } from "react";
import {AuthContext} from '../firebase/Auth';
import {Container, Row, Card, Col, ListGroup, ListGroupItem} from 'react-bootstrap'
import Users from "./Users";
import AttendingWeddings from "./AttendingWeddings";
import { List } from "@material-ui/core";


const Profile = () => {
    const { currentUser } = useContext(AuthContext);
    console.log(currentUser);
    return (
        <Container>
            <Row>
                <Col sm={7}>
                    <h1>Your Weddings</h1>
                    <Fragment>
                        <Users/>
                    </Fragment>
                </Col>
                <Col sm={5}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>Your profile</h2>
                            </Card.Title>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <p className='user-displayname-tag'>Display Name</p>
                                    <p className='user-displayname-display'>{currentUser.displayName}</p>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <p className='user-email-tag'>Email</p>
                                    <p className='user-email-display'>{currentUser.email}</p>
                                </ListGroupItem>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
            </Row>
        </Container>
    );
}

export default Profile;
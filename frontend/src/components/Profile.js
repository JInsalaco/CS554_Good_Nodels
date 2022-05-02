import React, { Fragment, useContext } from "react";
import {AuthContext} from '../firebase/Auth';
import {Container, Row, Card, Col, ListGroup, ListGroupItem} from 'react-bootstrap'
import Users from "./Users";
import AttendingWeddings from "./AttendingWeddings";
import ChangePassword from "./ChangePassword";


const Profile = () => {
    const { currentUser } = useContext(AuthContext);
    console.log(currentUser);
    return (
        <div className='profile-page'>
        <Container>
            <Row>
                <Col sm={7} className='d-inline-block vertical-spacing'>
                    <Row className='mb-4 justify-content-center'>
                        <Fragment>
                            <Users/>
                        </Fragment>
                    </Row>
                    <Row className='mb-4'>
                        <h1>Your Invites</h1>
                        <Fragment>
                            <AttendingWeddings/>
                        </Fragment>
                    </Row>
                </Col>
                <Col sm={4}>
                    <Row className='mb-4'>
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
                    </Row>
                    <Row className='mb-4'>
                        <Fragment>
                            <ChangePassword/>
                        </Fragment>
                    </Row>
                </Col>
            </Row>
        </Container>
        </div>
    );
}

export default Profile;
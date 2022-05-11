import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Modal,
  Image,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Photos(props) {
  const [photoData, setPhotoData] = useState(undefined);
  const [weddingName, setWeddingName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [photoID, setPhotoID] = useState(undefined);
  const [photoURL, setPhotoURL] = useState("");
  const [photoFile, setPhotoFile] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [invalid, setInvalid] = useState(false);

  let images = undefined;

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/weddings/${props.weddingID}`
        );
        setPhotoData(data.images);
        setWeddingName(data.title);
        setLoading(false);
        setError(false);
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    }
    fetchData();
  }, [props.weddingID]);

  if (photoData) {
    images = photoData.map((photo) => {
      return (
        <Col xs={6} md={4} key={photo._id}>
          <Image
            src={photo.url}
            alt="uploaded wedding image"
            className="photo"
          ></Image>
          <div className="photo-buttons">
            {props.canEdit && (
              <Button
                variant="primary"
                onClick={() => {
                  setShowEdit(true);
                  setPhotoID(photo._id);
                }}
              >
                Edit Image
              </Button>
            )}
            <br />
            <br />
            {props.canEdit && (
              <Button
                variant="primary"
                onClick={() => {
                  setShowDelete(true);
                  setPhotoID(photo._id);
                }}
              >
                Delete Image
              </Button>
            )}
          </div>
        </Col>
      );
    });
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleInput = (state, e) => {
    if (state === "photoURL") {
      setPhotoURL(e.target.value);
    } else if (state === "photoFile") {
      setPhotoFile(e.target.files[0]);
    }
  };

  const addPhoto = async () => {
    // Error check
    if (photoURL.length === 0 && photoFile === undefined) {
      setInvalid(true);
      return;
    } else {
      setInvalid(false);
    }
    if (
      photoFile &&
      photoFile.type !== "image/jpeg" &&
      photoFile.type !== "image/png"
    ) {
      alert("Invalid photo type!");
      return;
    }
    // Add the image
    let newData;
    let photoBase64 = undefined;
    // Convert photoFile to base64 to store in S3
    if (photoFile) {
      photoBase64 = await convertBase64(photoFile);
    }
    try {
      newData = await axios.put(
        `http://localhost:3001/weddings/${props.weddingID}/image`,
        { url: photoURL, imageBinary: photoBase64 }
      );

      // Wait a bit of time so the link becomes accessible
      setTimeout(() => {
        setPhotoData(newData.data.images);
        setShowAdd(false);
        setPhotoURL("");
        setPhotoFile(undefined);
      }, 1000);
    } catch (e) {
      alert("Could not add image, please try again!");
      console.log(e);
    }
  };

  const editPhoto = async () => {
    // Error check
    if (photoURL.length === 0 && photoFile === undefined) {
      setInvalid(true);
      return;
    } else {
      setInvalid(false);
    }
    if (
      photoFile &&
      photoFile.type !== "image/jpeg" &&
      photoFile.type !== "image/png"
    ) {
      alert("Invalid photo type!");
      return;
    }
    // Make the edit
    let newData;
    let photoBase64 = undefined;
    // Convert photoFile to base64 to store in S3
    if (photoFile) {
      photoBase64 = await convertBase64(photoFile);
    }
    try {
      newData = await axios.patch(
        `http://localhost:3001/weddings/${props.weddingID}/image/${photoID}`,
        {
          url: photoURL,
          imageBinary: photoBase64,
        }
      );
      // Wait until the link is accessible
      setTimeout(() => {
        setPhotoData(newData.data.images);
        setShowEdit(false);
        setPhotoURL("");
        setPhotoFile(undefined);
      }, 1000);
    } catch (e) {
      alert("Could not edit image, please try again!");
      console.log(e);
    }
  };

  const deletePhoto = async () => {
    // Make the delete
    let newData;
    try {
      newData = await axios.delete(
        `http://localhost:3001/weddings/${props.weddingID}/image/${photoID}`
      );
      setPhotoData(newData.data.images);
      setShowDelete(false);
    } catch (e) {
      alert("Could not delete image, please try again!");
      console.log(e);
    }
  };

  const addModal = (
    <Modal show={showAdd} onHide={() => setShowAdd(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidated validated={invalid}>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => handleInput("photoURL", e)}
              required
            />
            <Form.Control.Feedback type="invalid">
              You must include either a URL or File.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload your Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => handleInput("photoFile", e)}
              required
            />
            <Form.Control.Feedback type="invalid">
              You must include either a URL or File.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowAdd(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={() => addPhoto()}>
          Add!
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const editModal = (
    <Modal show={showEdit} onHide={() => setShowEdit(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={invalid}>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => handleInput("photoURL", e)}
              required
            />
            <Form.Control.Feedback type="invalid">
              You must include either a URL or File.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload your Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => handleInput("photoFile", e)}
              required
            />
            <Form.Control.Feedback type="invalid">
              You must include either a URL or File.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShowEdit(false);
          }}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            editPhoto();
          }}
        >
          Edit!
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const deleteModal = (
    <Modal show={showDelete} onHide={() => setShowDelete(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Are you sure you want to delete this image?</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDelete(false)}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            deletePhoto();
          }}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <h2>Error loading page, please try again!</h2>
      </div>
    );
  } else {
    return (
      <div className="photo-div">
        <h4 className="wedding-label" style={{ float: "left" }}>
          Photos of {weddingName}:
        </h4>
        <br />
        <br />
        <Container>
          <Row>{images}</Row>
        </Container>
        <br /> <br />
        {props.canEdit && (
          <Button variant="primary" onClick={() => setShowAdd(true)}>
            Add Image
          </Button>
        )}
        {addModal}
        {editModal}
        {deleteModal}
      </div>
    );
  }
}

export default Photos;

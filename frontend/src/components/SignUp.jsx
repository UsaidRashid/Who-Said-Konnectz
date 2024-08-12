import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  FloatingLabel,
  Row,
  Col,
} from "react-bootstrap";
import "../styles/signup.css";

export default function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("name", name);
    formData.append("contact", contact);
    formData.append("password", password);
    formData.append("profilePic", profilePic);

    try {
      const response = await axios.post(
        "http://localhost:3002/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        const token = response.data.token;
        localStorage.setItem("token", token);
        navigate("/");
      } else {
        alert("Unexpected status code: " + response.status);
      }
    } catch (error) {
      console.error("Error in Signing up:", error);
      if (error.response) {
        alert(
          "Error from server: " +
            error.response.status +
            " - " +
            error.response.data.message
        );
      } else if (error.request) {
        alert("No response from the server");
      } else {
        alert("Error setting up the request: " + error.message);
      }
    }
  };

  return (
    <div className="signup-container">
      <Container className="signup-form-container w-50">
        <h1 className="text-center mb-4 fs-3 bolder">
          Join our Who-Said Family!
        </h1>
        <Form onSubmit={handleSubmit} className="mx-5">
          <Row className="mb-3">
            <Col>
              <FloatingLabel
                controlId="username"
                label="Username"
                className="text-black"
              >
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <FloatingLabel
                controlId="email"
                label="Email Address"
                className="text-black"
              >
                <Form.Control
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <FloatingLabel
                controlId="name"
                label="Name"
                className="text-black"
              >
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <FloatingLabel
                controlId="contact"
                label="Contact Number"
                className="text-black"
              >
                <Form.Control
                  type="text"
                  placeholder="Contact Number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <FloatingLabel
                controlId="password"
                label="Password"
                className="text-black"
              >
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="profilePic">
                <Form.Label className="text-black w-100 text-start ms-3">
                  Upload Your Profile Picture
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-control-file"
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" variant="primary" className="w-50 mb-3">
            Sign Up
          </Button>
          <p className="text-center text-black">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </Form>
      </Container>
      <footer className="signup-footer">
        <p>Copyright © Who-Said Private Limited {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

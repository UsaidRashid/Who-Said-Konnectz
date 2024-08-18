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
const api = import.meta.env.VITE_BACKEND_URL;

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
      const response = await axios.post(api + "signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
    <>
      <div className="d-flex flex-column min-vh-100 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white justify-content-center align-items-center">
        <Container
          className="bg-white rounded-3 shadow p-4"
          style={{ maxWidth: "500px" }}
        >
          <h1 className="text-center mb-4 text-emerald-600 font-bold fs-3">
            Join our Who-Said Family!
          </h1>
          <Form onSubmit={handleSubmit} className="mx-5">
            <Row className="mb-3">
              <Col>
                <FloatingLabel controlId="username" label="Username">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="text-white bg-black"
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <FloatingLabel controlId="email" label="Email Address">
                  <Form.Control
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-white bg-black"
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <FloatingLabel controlId="name" label="Name">
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="text-white bg-black"
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <FloatingLabel controlId="contact" label="Contact Number">
                  <Form.Control
                    type="text"
                    placeholder="Contact Number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="text-white bg-black"
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <FloatingLabel controlId="password" label="Password">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="text-white bg-black"
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="profilePic">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    Upload a cheesy Profile Picture!
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      name="profilePic"
                      onChange={handleFileChange}
                    />
                  </label>
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary" className="w-100 mb-3">
              Sign Up
            </Button>
            <p className="text-center text-black">
              Already have an account?{" "}
              <Link to="/login" className="text-primary">
                Sign in
              </Link>
            </p>
          </Form>
        </Container>
      </div>
      <footer className="text-center bg-white py-3 text-dark w-100 mt-3">
        <p className="mb-0">
          Copyright © Who-Said Private Limited {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";
import "../styles/login.css";
const api = import.meta.env.VITE_BACKEND_URL;

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userData = { username, password };

      const response = await axios.post(api + "login", userData);

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        alert(response.data.message);
        navigate("/");
      } else {
        alert("Unexpected status code: " + response.status);
      }
    } catch (error) {
      console.error("Error in Logging in:", error);
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
    <div className="login-container">
      <Container className="login-form-container w-50">
        <h1 className="text-center mb-4 fs-3 bolder">Welcome Back!</h1>
        <Form onSubmit={handleSubmit} className="mx-5">
          <Row className="mb-3">
            <Col>
              <FloatingLabel
                controlId="username"
                label="Username"
                className="text-dark"
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
                controlId="password"
                label="Password"
                className="text-dark"
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
          <Button type="submit" variant="primary" className="w-50 mb-3">
            Sign In
          </Button>
          <Row className="mb-3">
            <Col>
              <p className="text-center text-black">
                <Link to="/signup">Don't have an account? Sign Up</Link>
              </p>
            </Col>
          </Row>
        </Form>
      </Container>
      <footer className="login-footer">
        <p>Copyright © Who-Said Private Limited {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

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
  Spinner,
} from "react-bootstrap";
const api = import.meta.env.VITE_BACKEND_URL;

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white justify-content-center align-items-center">
      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.5)", zIndex: 1000 }}
        >
          <div className="text-center">
            <Spinner animation="border" variant="success" />
            <h2 className="text-emerald-600 mt-3">
              Logging you in... Please wait
            </h2>
          </div>
        </div>
      )}
      <Container
        className="bg-white rounded-3 shadow p-4"
        style={{ maxWidth: "500px" }}
      >
        <h1 className="text-center mb-4 text-emerald-600 font-bold fs-3">
          Welcome Back!
        </h1>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <FloatingLabel controlId="username" label="Username">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-dark text-white"
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
                  className="bg-dark text-white"
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Button
            type="submit"
            variant="primary"
            className="w-100 mb-3"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Sign In"}
          </Button>
          <Row className="mb-3">
            <Col>
              <p className="text-center text-black">
                <Link to="/signup" className="text-primary">
                  Don't have an account? Sign Up
                </Link>
              </p>
            </Col>
          </Row>
        </Form>
      </Container>
      <footer className="text-center bg-white py-3 text-dark w-100 mt-3 absolute bottom-0">
        <p className="mb-0">
          Copyright © Who-Said Private Limited {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

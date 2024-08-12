import * as React from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
  setContact,
  setEmail,
  setName,
  setPassword,
  setUsername,
  setId,
  setProfilePic
} from "../store/Features/userSlice";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Input from '@mui/material/Input';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Who-Said Private Limited
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp() {
  const dispatch = useDispatch();
  const { username, email, name, contact, password, id, profilePic } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(setProfilePic(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('name', name);
    formData.append('contact', contact);
    formData.append('password', password);
    formData.append('profilePic', profilePic);

    try {
      const response = await axios.post(
        "http://localhost:3002/signup",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        const token = response.data.token;
        localStorage.setItem("token", token);
        dispatch(setId(response.data.userData._id));
        navigate("/");
        return response.data;
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
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  value={username}
                  onChange={(e) => dispatch(setUsername(e.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => dispatch(setEmail(e.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => dispatch(setName(e.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="contact"
                  label="Contact Number"
                  name="contact"
                  autoComplete="contact"
                  value={contact}
                  onChange={(e) => dispatch(setContact(e.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => dispatch(setPassword(e.target.value))}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

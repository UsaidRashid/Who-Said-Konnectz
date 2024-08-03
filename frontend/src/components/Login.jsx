// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { Link } from "react-router-dom";

// export default function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const userData = { username, password };

//       const response = await axios.post(
//         "http://localhost:3002/login",
//         userData
//       );

//       if (response.status === 200) {
//         const token = response.data.token;
//         localStorage.setItem("token", token);
//         alert(response.data.message);
//         navigate("/");
//         return response.data;
//       } else {
//         alert("Unexpected status code: " + response.status);
//       }
//     } catch (error) {
//       console.error("Error in Logging in:", error);
//       alert(error.response.data.message);
//       if (error.response) {
//         alert(
//           "Error from server: " +
//             error.response.status +
//             " - " +
//             error.response.data.message
//         );
//       } else if (error.request) {
//         alert("No response from the server");
//       } else {
//         alert("Error setting up the request: " + error.message);
//       }
//     }
//   };

//   return (
//     <div className="mt-36 mx-72">
//       <form action="">
//         <div className="input-group mb-3">
//           <span className="input-group-text" id="basic-addon1">
//             @
//           </span>
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Enter your username"
//             aria-label="Username"
//             aria-describedby="basic-addon1"
//             value={username}
//             onChange={(e) => {
//               setUsername(e.target.value);
//             }}
//           />
//         </div>
//         <div className="input-group mb-3">
//           <input
//             type="password"
//             className="form-control"
//             placeholder="Your password"
//             value={password}
//             onChange={(e) => {
//               setPassword(e.target.value);
//             }}
//           />
//         </div>
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="btn btn-primary"
//             onClick={handleSubmit}
//           >
//             Login
//           </button>
//         </div>
//         <br />
//         <div className="float-right">
//           <p>
//             or{" "}
//             <Link className="underline" to="/signup">
//               register
//             </Link>{" "}
//             for a new user
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// }


import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { useNavigate , Link } from "react-router-dom";
import { useState } from "react";

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

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userData = { username, password };

      const response = await axios.post(
        "http://localhost:3002/login",
        userData
      );

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
      alert(error.response?.data?.message || "An error occurred");
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
      <Container component="main" maxWidth="xs" >
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

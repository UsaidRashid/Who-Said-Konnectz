import React, { useEffect, useState } from "react";
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  CssBaseline,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import Home from "./Home";
import NewPost from "./NewPost";
import Users from "./Users";
import WhoSaid from "./WhoSaid";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// import "../styles/navigation.css";
import ProtectedRoute from "./protectedRoute";
const api = import.meta.env.VITE_BACKEND_URL;

export default function Navigation() {
  const [value, setValue] = React.useState(0);
  const [_id, setId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setId(decodedToken.user._id);
    }
    const fetchToken = async () => {
      try {
        const response = await axios.post(api + "fetch-token", {
          _id,
        });
        if (response.status === 200) {
          localStorage.clear();
          localStorage.setItem("token", response.data.token);
        }
      } catch (error) {
        console.error("Error in Fetching Token:", error);
        console.log(error.response?.data?.message || "An error occurred");
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
    if (_id) fetchToken();
  }, [_id]);

  const postCreated = () => {
    setValue(0);
  };

  const renderComponent = () => {
    switch (value) {
      case 0:
        return <Home />;
      case 1:
        return (
          <ProtectedRoute>
            <NewPost postCreated={postCreated} />
          </ProtectedRoute>
        );
      case 2:
        return (
          <ProtectedRoute>
            <WhoSaid />
          </ProtectedRoute>
        );
      default:
        return <Home />;
    }
  };

  return (
    <Container component="main" className="relative">
      <CssBaseline />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Box sx={{ flex: 1, pb: 8 }}>{renderComponent()}</Box>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-tr from-[#1d976c] to-[#93f9b9] shadow-lg rounded-t-lg flex justify-around items-center py-2 px-4"
        >
          <BottomNavigationAction
            className="text-white transition-transform duration-300 hover:text-[#93f9b9] hover:scale-110"
            label="Home"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            className="text-white transition-transform duration-300 hover:text-[#93f9b9] hover:scale-110"
            label="New Post"
            icon={<AddIcon />}
          />
          <BottomNavigationAction
            className="text-white transition-transform duration-300 hover:text-[#93f9b9] hover:scale-110"
            label="Who-Said"
            icon={<FormatQuoteIcon />}
          />
        </BottomNavigation>
      </Box>
    </Container>
  );
}

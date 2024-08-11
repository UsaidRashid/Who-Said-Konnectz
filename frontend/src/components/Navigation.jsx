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
import Friends from "./Friends";
import WhoSaid from "./WhoSaid";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FriendRequests from "./FriendRequests";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AllDms from "./AllDms";

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
        const response = await axios.post("http://localhost:3002/fetch-token",{_id});
        if (response.status === 200) {
          localStorage.clear();
          localStorage.setItem("token", response.data.token);
        }
      } catch (error) {
        console.error("Error in Logging in:", error);
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
  });

  const postCreated = () => {
    setValue(0);
  };

  const renderComponent = () => {
    switch (value) {
      case 0:
        return <Home />;
      case 1:
        return <AllDms/>;
      case 2:
        return <WhoSaid />;
      case 3:
        return <NewPost postCreated={postCreated} />;
      case 4:
        return <Friends />;
      case 5:
        return <FriendRequests />;
      case 6:
        return <Users />;
      default:
        return <Home />;
    }
  };

  return (
    <Container component="main">
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
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "black",
          }}
        >
          <BottomNavigationAction
            className="text-white"
            label="Home"
            icon={<HomeIcon />}
          />
           <BottomNavigationAction
            className="text-white"
            label="Chats"
            icon={<ChatBubbleOutlineIcon />}
          />
          <BottomNavigationAction
            className="text-white"
            label="Who-Said"
            icon={<FormatQuoteIcon />}
          />
          <BottomNavigationAction
            className="text-white"
            label="New Post"
            icon={<AddIcon />}
          />
          <BottomNavigationAction
            className="text-white"
            label="Friends"
            icon={<HandshakeIcon />}
          />
          <BottomNavigationAction
            className="text-white"
            label="Friend-Requests"
            icon={<HandshakeIcon />}
          />
          <BottomNavigationAction
            className="text-white"
            label="Users"
            icon={<PeopleOutlineIcon />}
          />
        </BottomNavigation>
      </Box>
    </Container>
  );
}

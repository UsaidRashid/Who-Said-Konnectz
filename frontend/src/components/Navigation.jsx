import React from "react";
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

export default function Navigation() {
  const [value, setValue] = React.useState(0);

  const postCreated = () => {
    setValue(0);
  };

  const renderComponent = () => {
    switch (value) {
      case 0:
        return <Home />;
      case 1:
        return <WhoSaid />;
      case 2:
        return <NewPost postCreated={postCreated} />;
      case 3:
        return <Friends />;
      case 4:
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
            label="Users"
            icon={<PeopleOutlineIcon />}
          />
        </BottomNavigation>
      </Box>
    </Container>
  );
}

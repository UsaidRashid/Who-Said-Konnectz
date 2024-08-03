import React from 'react';
import { Box, BottomNavigation, BottomNavigationAction, Container, CssBaseline } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import Home from './Home'; 
import ChatBox from './Chatbox';
import NewPost from './NewPost';

export default function Navigation() {
  const [value, setValue] = React.useState(0);

  const postCreated = () => {
    setValue(0);
  }

  const renderComponent = () => {
    switch (value) {
      case 0:
        return <Home />;
      case 1:
        return <NewPost postCreated={postCreated}/>;
      case 2:
        return <ChatBox />;
      default:
        return <Home />;
    }
  };

  return (
    <Container component="main">
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ flex: 1, pb: 8 }}>
          {renderComponent()}
        </Box>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'black' }}
        >
          <BottomNavigationAction className='text-white' label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction className='text-white' label="New Post" icon={<AddIcon />} />
          <BottomNavigationAction className='text-white' label="ChatBox" icon={<ChatIcon />} />
        </BottomNavigation>
      </Box>
    </Container>
  );
}

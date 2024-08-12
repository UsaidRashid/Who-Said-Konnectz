import "./App.css";
import { Route, BrowserRouter, Routes, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import SignUp from "./components/SignUp";
import { Provider } from "react-redux";
import store from "./store/store";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import Profile from "./components/Profile";
import UserProfile from './components/UserProfile';
import ProfileUpdate from './components/ProfileUpdate';

const AppContent = () => {
  const location = useLocation();
  const showNF =
    location.pathname !== "/login" && location.pathname !== "/signup";
  return (
    <>
      {showNF && <Header />}
      <Routes>
        <Route path="/" element={<Navigation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/profile-update" element={<ProfileUpdate />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;

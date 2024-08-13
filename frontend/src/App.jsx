import "./App.css";
import { Route, BrowserRouter, Routes, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Header from "./components/Header";
import SignUp from "./components/SignUp";
import { Provider } from "react-redux";
import store from "./store/store";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import Profile from "./components/Profile";
import UserProfile from "./components/UserProfile";
import ProfileUpdate from "./components/ProfileUpdate";
import AllDms from "./components/AllDms";
import Friends from "./components/Friends";
import FriendRequests from "./components/FriendRequests";
import Users from "./components/Users";
import ProtectedRoute from "./components/protectedRoute";

const AppContent = () => {
  const location = useLocation();
  const showNF =
    location.pathname !== "/login" && location.pathname !== "/signup";
  return (
    <>
      {showNF && <Header />}
      <div>
        <Routes>
          <Route path="/" element={<Navigation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-update"
            element={
              <ProtectedRoute>
                <ProfileUpdate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <ProtectedRoute>
                <Friends />
              </ProtectedRoute>
            }
          />
          <Route
            path="/friend-requests"
            element={
              <ProtectedRoute>
                <FriendRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute>
                <AllDms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
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

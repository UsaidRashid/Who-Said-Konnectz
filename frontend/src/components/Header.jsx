import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import profile from "../Images/profile.png";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "../styles/navbar.css";

export default function Header() {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState("");
  const [token, setToken] = useState("");
  const [isLoggedin, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    let decodedToken = "";
    if (token) {
      decodedToken = jwtDecode(token);
      setToken(decodedToken);
      console.log(decodedToken);
    }
    setProfilePic(decodedToken?.user?.profilePic);
    if (token !== null) setIsLoggedIn(true);
    else setIsLoggedIn(false);
  },[]);

  async function logout() {
    try {
      const response = await axios.get("http://localhost:3002/logout");

      if (response.status === 200) {
        localStorage.removeItem("token");
        alert(response.data.message);
        navigate("/login");
      } else {
        alert("Unexpected status code: " + response.status);
      }
    } catch (error) {
      console.error("Error logging out:", error);
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
  }

  return (
    <div className="navbar-container">
      <nav className="navbar emerald-gradient shadow-lg fixed w-100 top-0 left-0 z-20">
        <div className="container mx-auto flex justify-between items-center py-4 w-100">
          <div className="flex items-center flex-column">
            <Link to="/" className="hover-effect">
              <h1 className="text-3xl font-bold text-white tracking-wider">
                Who-Said Konnectz
              </h1>
            </Link>
            <p className="ms-72 text-white text-sm">Connecting Forever...</p>
          </div>
          <div className="flex items-center space-x-6 mx-5">
            <div className="dropdown">
              <img
                className="rounded-full cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg"
                src={profilePic ? profilePic : profile}
                alt="Profile"
                style={{ height: "50px", width: "50px" }}
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />

              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <Link to="/profile" className="dropdown-item">
                    <i className="fas fa-user-circle me-2"></i> Your Profile 
                  </Link>
                </li>
                <li>
                  <Link to="/chats" className="dropdown-item">
                    <i className="fas fa-comments me-2"></i> All Chats
                  </Link>
                </li>
                <li>
                  <Link to="/friends" className="dropdown-item">
                    <i className="fas fa-user-friends me-2"></i> Your Friends : {token && token?.user?.friends?.length}
                  </Link>
                </li>
                <li>
                  <Link to="/friend-requests" className="dropdown-item">
                    <i className="fas fa-user-plus me-2"></i> Friend Requests : {token && token?.user?.requestsRecieved?.length}
                  </Link>
                </li>
                {isLoggedin ? (
                  <li>
                    <button
                      className="dropdown-item btn-logout"
                      onClick={logout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i> Log out
                    </button>
                  </li>
                ) : (
                  <li>
                    <button
                      className="dropdown-item btn-login"
                      onClick={() => navigate("/login")}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i> Log in
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import profile from "../Images/profile.png";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import logo from "../Images/logo.png";
const api = import.meta.env.VITE_BACKEND_URL;

export default function Header() {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState("");
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [requestsRecieved, setRequestsRecieved] = useState(0);
  const [friends, setFriends] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      setFriends(decodedToken?.user?.friends?.length);
      setRequestsRecieved(decodedToken?.user?.requestsRecieved?.length);
      setProfilePic(decodedToken?.user?.profilePic);
      setIsLoggedIn(true);
    } else setIsLoggedIn(false);
  }, []);

  async function logout() {
    try {
      const response = await axios.get(api + "logout");

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
    <div className="w-full fixed top-0 left-0 z-20 shadow-lg bg-gradient-to-r from-green-600 to-green-300">
      <nav className="w-full">
        <div className="container mx-auto flex items-center justify-between py-4">
          <img
            src={logo}
            height="60"
            width="60"
            alt="Logo"
            className="rounded-circle"
          />

          <div className="flex flex-col items-center">
            <Link to="/" className="relative group text-decoration-none">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wider group-hover:text-[#e0f7fa] transition-transform duration-300 transform group-hover:scale-105 font-monospace">
                Who-Said Konnectz
              </h1>
              <div
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"
                style={{ transform: "translateY(5px)" }}
              ></div>
            </Link>
            <p className="text-xs sm:text-sm md:text-base text-white mt-1 font-monospace">
              Connecting Forever...
            </p>
          </div>

          <div className="relative">
            <div className="dropdown">
              <img
                className="rounded-full cursor-pointer transition-transform duration-300 transform hover:scale-110 hover:shadow-lg"
                src={profilePic ? profilePic : profile}
                alt="Profile"
                style={{
                  height: "50px",
                  width: "50px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul
                className="dropdown-menu dropdown-menu-end mt-2 bg-white rounded-lg shadow-lg"
                aria-labelledby="dropdownMenuButton"
                style={{ minWidth: "200px" }}
              >
                {isLoggedin && (
                  <>
                    <li>
                      <Link
                        to="/profile"
                        className="dropdown-item py-2 px-4 text-dark hover:bg-[#1d976c] hover:text-white transition-colors duration-200"
                      >
                        <i className="fas fa-user-circle me-2"></i> Your Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/view-posts"
                        className="dropdown-item py-2 px-4 text-dark hover:bg-[#1d976c] hover:text-white transition-colors duration-200"
                      >
                        <i className="fas fa-user-circle me-2"></i> Your Posts
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/chats"
                        className="dropdown-item py-2 px-4 text-dark hover:bg-[#1d976c] hover:text-white transition-colors duration-200"
                      >
                        <i className="fas fa-comments me-2"></i> All Chats
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/friends"
                        className="dropdown-item py-2 px-4 text-dark hover:bg-[#1d976c] hover:text-white transition-colors duration-200"
                      >
                        <i className="fas fa-user-friends me-2"></i> Your
                        Friends: {friends}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/friend-requests"
                        className="dropdown-item py-2 px-4 text-dark hover:bg-[#1d976c] hover:text-white transition-colors duration-200"
                      >
                        <i className="fas fa-user-plus me-2"></i> Friend
                        Requests: {requestsRecieved}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/users"
                        className="dropdown-item py-2 px-4 text-dark hover:bg-[#1d976c] hover:text-white transition-colors duration-200"
                      >
                        <i className="fas fa-user-plus me-2"></i> All Users
                      </Link>
                    </li>
                  </>
                )}
                {isLoggedin ? (
                  <li>
                    <button
                      className="dropdown-item py-2 px-4 text-danger hover:bg-[#f8d7da] transition-colors duration-200"
                      onClick={logout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i> Log out
                    </button>
                  </li>
                ) : (
                  <li>
                    <button
                      className="dropdown-item py-2 px-4 hover:bg-[#d4edda] transition-colors duration-200"
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

import axios from "axios";
import React, { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function Friends() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    let _id = null;
    if (!token || token === "") {
      alert("You must be logged in...");
      navigate("/login");
    } else {
      const decodedToken = jwtDecode(token);
      _id = decodedToken.user._id;
    }
    const main = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3002/fetch-friends",
          { _id }
        );
        if (response.status === 200) {
          setUsers(response.data.users);
        } else {
          alert(response.data.message || "Some Error occured");
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
    if (token) main();
  }, []);

  return (
    <div className="mx-32 my-32  ">
      {user ? (
        <UserProfile user={user} />
      ) : (
        <div className="p-6 bg-emerald-100 min-h-screen">
          <h1 className="text-3xl font-bold text-center text-emerald-800 mb-6">
            All Friends
          </h1>
          <div className="flex flex-col space-y-6">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  onMouseEnter={() => setHoveredCard(user._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setUser(user)}
                  style={{ position: "relative" }}
                >
                  <div className="d-flex flex-row">
                    <img
                      src={user.profilePic}
                      height="40px"
                      width="40px"
                      className="h-16 w-16 rounded-full border-2 border-emerald-500 object-cover"
                    />
                    <div className="mx-5">
                      <h2 className="text-xl font-semibold text-emerald-700">
                        {user.name}
                      </h2>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-gray-500 text-sm">{user.username}</p>
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor:
                        hoveredCard === user._id
                          ? "rgba(255, 255, 255, 0.5)"
                          : "transparent",
                      backdropFilter:
                        hoveredCard === user._id ? "blur(10px)" : "none",
                      zIndex: 10,
                      transition:
                        "background-color 0.3s ease, backdrop-filter 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingRight: "1rem",
                        height: "100%",
                      }}
                    >
                      {hoveredCard === user._id && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: "bold",
                              color: "#4a5568",
                              marginBottom: "0.5rem",
                            }}
                          >
                            See Full Profile
                          </p>
                          <FaArrowRight
                            style={{
                              fontSize: "2rem",
                              color: "#4a5568",
                              transition: "transform 0.3s ease",
                              transform: "translateX(0)",
                              ":hover": {
                                transform: "translateX(5px)",
                              },
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No users found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import axios from "axios";
import React, { useEffect, useState } from "react";
import UserProfile from "./UserProfile";
import { FaArrowRight } from "react-icons/fa";
const api = import.meta.env.VITE_BACKEND_URL;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post(api + "fetch-users");
        if (response.status === 200) {
          setUsers(response.data.users);
        } else {
          alert(response.data.message || "Some Error occurred");
        }
      } catch (error) {
        console.error("Error in Fetching Users:", error);
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

    fetchUsers();
  }, []);

  return (
    <div className="my-32 mx-32">
      {user ? (
        <UserProfile user={user} />
      ) : (
        <div className="p-6 bg-emerald-100 min-h-screen">
          <h1 className="text-4xl font-bold text-center text-emerald-800 mb-8 text-center">
            All Users
          </h1>
          <div className="flex flex-wrap flex-column justify-center gap-6">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 group"
                  onMouseEnter={() => setHoveredCard(user._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setUser(user)}
                  style={{ position: "relative" }}
                >
                  <div className="flex items-center">
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="h-16 w-16 rounded-full border-2 border-emerald-500 object-cover"
                    />
                    <div className="ml-4">
                      <h2 className="text-2xl font-semibold text-emerald-700">
                        {user.name}
                      </h2>
                      <p className="text-gray-500 text-sm">@{user.username}</p>
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
